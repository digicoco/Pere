import { useState } from 'react';
import { Col, Row, View } from '@amzn/stencil-react-components/layout';
import { H3, Text } from '@amzn/stencil-react-components/text';
import { Button, ButtonVariant, ButtonSize } from '@amzn/stencil-react-components/button';
import { Card } from '@amzn/stencil-react-components/card';
import { Chip, ChipSize } from '@amzn/stencil-react-components/chip';
import { Input, InputWrapper } from '@amzn/stencil-react-components/input';
import { Avatar } from '@amzn/stencil-react-components/avatar';
import { AIIconWrapper } from '@amzn/stencil-react-components/ai';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import styled from '@emotion/styled';
import IconSparklesMedium from '@amzn/stencil-react-icons/icons/icon-sparkles-medium';
import IconChevronLeftSmall from '@amzn/stencil-react-icons/icons/icon-chevron-left-small';
import IconThumbDownExtraSmall from '@amzn/stencil-react-icons/icons/icon-thumb-down-extra-small';

// ─── Failing photo data ────────────────────────────────────────────────────────

const failingPhotos = [
  { id: 'bp-1', name: 'Maria Santos', username: 'msantos', confidence: 62, reason: 'Background not uniform — dimly lit room. Face + neck visible but lighting insufficient for badge.', retakeGuidance: 'Use a well-lit area with a plain white or off-white background. Ensure even lighting across the face.' },
  { id: 'bp-2', name: 'Juan Reyes', username: 'jreyes', confidence: 58, reason: 'Partial face occlusion — candidate wearing cap. Real-time capture confirmed but cap violates policy.', retakeGuidance: 'Remove all headwear (caps, hats, headbands). Face must be fully visible from hairline to chin.' },
  { id: 'bp-3', name: 'Ana Cruz', username: 'acruz', confidence: 65, reason: 'Image slightly blurry. White background confirmed. Resolution below minimum threshold.', retakeGuidance: 'Hold device steady or use a tripod. Ensure the camera focuses on the face before capturing. Minimum 300x300px.' },
  { id: 'bp-5', name: 'Carla Mendoza', username: 'cmendoza', confidence: 45, reason: 'Cropped too tight — shoulders not visible. Photo shows only face, missing neck and shoulder line.', retakeGuidance: 'Frame the photo to include full face, neck, and top of shoulders. Do not zoom in too closely.' },
  { id: 'bp-10', name: 'Diego Ignacio', username: 'dignacio', confidence: 52, reason: 'Filter detected — skin smoothing applied. IVV system flagged digital manipulation.', retakeGuidance: 'Do not use any photo filters, beauty modes, or editing apps. Capture using the standard camera with no modifications.' },
];

// ─── Chat conversation steps ───────────────────────────────────────────────────

type Step = 'review' | 'confirm-reasons' | 'customize-message' | 'send-notifications' | 'complete';

const rejectionTemplate = `Hi [Candidate],

Your badge photo submission did not meet our requirements. Please retake your photo following these guidelines:

[SPECIFIC_GUIDANCE]

General requirements:
- Plain white or off-white background
- Full face, neck, and shoulders visible
- No filters, editing, or beauty modes
- Well-lit, in-focus image (minimum 300x300px)
- No headwear unless religious accommodation

Please resubmit within 48 hours to avoid delays in your start date.

Thank you,
Pere Hiring Team`;

// ─── Styled Components ─────────────────────────────────────────────────────────

const PageContainer = styled('div')({
  position: 'fixed',
  inset: 0,
  top: 63,
  zIndex: 90,
  display: 'flex',
  backgroundColor: token('color.surface.bg-default'),
});

const ChatPanel = styled('aside')({
  width: 420,
  minWidth: 420,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRight: `1px solid ${token('color.border.primary')}`,
  backgroundColor: token('color.surface.bg-default'),
  overflow: 'hidden',
});

const ChatHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${token('dimensions.spacing.200')} ${token('dimensions.spacing.300')}`,
  height: 56,
  borderBottom: `1px solid ${token('color.border.primary')}`,
  flexShrink: 0,
});

const ChatBody = styled('div')({
  flex: 1,
  overflowY: 'auto',
  padding: token('dimensions.spacing.300'),
  display: 'flex',
  flexDirection: 'column',
  gap: token('dimensions.spacing.250'),
});

const ChatInputArea = styled('div')({
  borderTop: `1px solid ${token('color.border.primary')}`,
  padding: token('dimensions.spacing.300'),
  display: 'flex',
  flexDirection: 'column',
  gap: token('dimensions.spacing.200'),
  flexShrink: 0,
});

const AiBubble = styled('div')({
  backgroundColor: token('color.surface.bg-muted'),
  borderRadius: `${token('dimensions.border.radius.100')} ${token('dimensions.border.radius.300')} ${token('dimensions.border.radius.300')} ${token('dimensions.border.radius.300')}`,
  padding: `${token('dimensions.spacing.250')} ${token('dimensions.spacing.300')}`,
  fontSize: 14,
  lineHeight: 1.5,
  color: token('color.neutral.90'),
  maxWidth: '92%',
});

const UserBubble = styled('div')({
  alignSelf: 'flex-end',
  backgroundColor: token('color.action.primary.bg-default'),
  borderRadius: token('dimensions.border.radius.300'),
  padding: `${token('dimensions.spacing.200')} ${token('dimensions.spacing.300')}`,
  maxWidth: '85%',
  color: token('color.neutral.00'),
  fontSize: 14,
});

const ContentArea = styled('main')({
  flex: 1,
  overflowY: 'auto',
  padding: token('dimensions.spacing.400'),
  display: 'flex',
  flexDirection: 'column',
  gap: token('dimensions.spacing.300'),
});

const PhotoRow = styled('div')<{ selected?: boolean }>(({ selected }) => ({
  border: `1px solid ${selected ? token('color.red.60') : token('color.border.primary')}`,
  borderRadius: token('dimensions.border.radius.200'),
  padding: token('dimensions.spacing.300'),
  display: 'flex',
  alignItems: 'center',
  gap: token('dimensions.spacing.300'),
  backgroundColor: selected ? 'rgba(218, 55, 51, 0.04)' : 'transparent',
  transition: 'all 150ms ease',
}));

const ConfidenceBadge = styled('span')<{ score: number }>(({ score }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  borderRadius: 100,
  fontSize: 11,
  fontWeight: 700,
  color: token('color.red.70'),
  backgroundColor: 'rgba(218, 55, 51, 0.1)',
}));

const StepIndicator = styled('div')<{ active?: boolean; complete?: boolean }>(({ active, complete }) => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 11,
  fontWeight: 700,
  flexShrink: 0,
  backgroundColor: complete ? token('color.green.60') : active ? token('color.action.primary.bg-default') : token('color.neutral.15'),
  color: complete || active ? token('color.neutral.00') : token('color.neutral.60'),
}));

const StepRow = styled('div')<{ active?: boolean }>(({ active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: token('dimensions.spacing.200'),
  padding: `${token('dimensions.spacing.100')} 0`,
  opacity: active ? 1 : 0.6,
}));

const MessagePreview = styled('pre')({
  backgroundColor: token('color.surface.bg-muted'),
  border: `1px solid ${token('color.border.primary')}`,
  borderRadius: token('dimensions.border.radius.200'),
  padding: token('dimensions.spacing.300'),
  fontSize: 12,
  lineHeight: 1.5,
  fontFamily: 'inherit',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  color: token('color.neutral.70'),
  maxHeight: 300,
  overflow: 'auto',
});

const BackButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  gap: token('dimensions.spacing.100'),
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  color: token('color.neutral.70'),
  fontSize: 14,
  fontWeight: 500,
  fontFamily: 'inherit',
  padding: `${token('dimensions.spacing.100')} ${token('dimensions.spacing.200')}`,
  borderRadius: token('dimensions.border.radius.100'),
  '&:hover': { backgroundColor: token('color.surface.bg-muted') },
});

const SendButton = styled('button')({
  background: `linear-gradient(133deg, ${token('color.purple.70')} 7%, ${token('color.blue.60')} 133%)`,
  color: token('color.neutral.00'),
  border: 'none',
  borderRadius: '50%',
  width: 32,
  height: 32,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const ActionButton = styled('button')({
  background: token('color.surface.bg-default'),
  border: `1px solid ${token('color.border.primary')}`,
  borderRadius: token('dimensions.border.radius.200'),
  padding: `${token('dimensions.spacing.200')} ${token('dimensions.spacing.300')}`,
  fontSize: 13,
  fontWeight: 500,
  color: token('color.action.primary.bg-default'),
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'inherit',
  width: '100%',
  '&:hover': {
    backgroundColor: token('color.action.utility.bg-hover'),
    borderColor: token('color.action.primary.bg-default'),
  },
});

// ─── Component ─────────────────────────────────────────────────────────────────

interface RejectRetakePageProps {
  onClose: () => void;
}

export const RejectRetakePage = ({ onClose }: RejectRetakePageProps) => {
  const [currentStep, setCurrentStep] = useState<Step>('review');
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set(failingPhotos.map(p => p.id)));
  const [notificationsSent, setNotificationsSent] = useState(false);
  const [message, setMessage] = useState('');

  const steps: { key: Step; label: string }[] = [
    { key: 'review', label: 'Review failing photos' },
    { key: 'confirm-reasons', label: 'Confirm rejection reasons' },
    { key: 'customize-message', label: 'Customize retake message' },
    { key: 'send-notifications', label: 'Send notifications' },
    { key: 'complete', label: 'Complete' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  const togglePhoto = (id: string) => {
    setSelectedPhotos(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSendNotifications = () => {
    setNotificationsSent(true);
    setCurrentStep('complete');
  };

  return (
    <PageContainer>
      {/* Left: Chat Panel */}
      <ChatPanel>
        <ChatHeader>
          <Row alignItems="center" gridGap="dimensions.spacing.200">
            <AIIconWrapper fill="color.gradient.action.default">
              <IconSparklesMedium aria-hidden="true" />
            </AIIconWrapper>
            <Col>
              <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
                Pere Copilot
              </Text>
              <Text variant="label-xs" color="color.neutral.60">
                Reject and request retake
              </Text>
            </Col>
          </Row>
          <BackButton onClick={onClose}>
            <IconChevronLeftSmall aria-hidden="true" />
            Back
          </BackButton>
        </ChatHeader>

        <ChatBody>
          {/* Progress steps */}
          <Card padding="dimensions.spacing.250">
            <Col gridGap="dimensions.spacing.100">
              <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Guided flow
              </Text>
              {steps.map((step, i) => (
                <StepRow key={step.key} active={i <= currentStepIndex}>
                  <StepIndicator active={i === currentStepIndex} complete={i < currentStepIndex}>
                    {i < currentStepIndex ? '\u2713' : i + 1}
                  </StepIndicator>
                  <Text fontSize="T100" fontWeight={i === currentStepIndex ? 'bold' : 'regular'} color={i <= currentStepIndex ? 'color.neutral.90' : 'color.neutral.60'}>
                    {step.label}
                  </Text>
                </StepRow>
              ))}
            </Col>
          </Card>

          {/* Chat messages based on current step */}
          <UserBubble>Reject all failing photos and request retake</UserBubble>

          <AiBubble>
            I found {failingPhotos.length} photos below the 70% confidence threshold. I'll walk you through the rejection process step by step — you'll be able to review each one, confirm the rejection reason, and customize the retake notification before I send it.
          </AiBubble>

          {currentStep === 'review' && (
            <>
              <AiBubble>
                Step 1: Review the {failingPhotos.length} failing photos on the right. Deselect any you'd like to keep. All are pre-selected for rejection.
              </AiBubble>
              <ActionButton onClick={() => setCurrentStep('confirm-reasons')}>
                Proceed with {selectedPhotos.size} selected for rejection
              </ActionButton>
            </>
          )}

          {currentStep === 'confirm-reasons' && (
            <>
              <AiBubble>
                Step 2: I've matched each photo to a specific rejection reason based on the IVV analysis. The retake guidance for each candidate is personalized to their specific issue. Review the reasons on the right — edit any that need adjustment.
              </AiBubble>
              <ActionButton onClick={() => setCurrentStep('customize-message')}>
                Reasons look good — prepare notification
              </ActionButton>
              <ActionButton onClick={() => setCurrentStep('review')}>
                Go back and adjust selection
              </ActionButton>
            </>
          )}

          {currentStep === 'customize-message' && (
            <>
              <AiBubble>
                Step 3: Here's the retake notification template. Each candidate will receive a personalized version with their specific issue highlighted. The message includes the general photo requirements and a 48-hour deadline. You can edit the template on the right before sending.
              </AiBubble>
              <ActionButton onClick={handleSendNotifications}>
                Send retake notifications to {selectedPhotos.size} candidates
              </ActionButton>
              <ActionButton onClick={() => setCurrentStep('confirm-reasons')}>
                Go back to reasons
              </ActionButton>
            </>
          )}

          {currentStep === 'complete' && (
            <>
              <AiBubble>
                Done. I've rejected {selectedPhotos.size} badge photos and sent personalized retake notifications to each candidate. They have 48 hours to resubmit. I'll surface any new submissions in your digest when they arrive.
              </AiBubble>
              <Col gridGap="dimensions.spacing.200">
                <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Summary
                </Text>
                <Chip size={ChipSize.ExtraSmall} backgroundColor="color.red.10">{selectedPhotos.size} rejected</Chip>
                <Chip size={ChipSize.ExtraSmall} backgroundColor="color.green.10">{selectedPhotos.size} notifications sent</Chip>
                <Chip size={ChipSize.ExtraSmall}>48hr deadline set</Chip>
              </Col>
              <ActionButton onClick={onClose}>
                Return to digest
              </ActionButton>
            </>
          )}
        </ChatBody>

        <ChatInputArea>
          <Row gridGap="dimensions.spacing.200" alignItems="center">
            <View flex={1}>
              <InputWrapper id="reject-chat-input" labelText="">
                {(inputProps) => (
                  <Input
                    {...inputProps}
                    placeholder="Ask about rejections..."
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                  />
                )}
              </InputWrapper>
            </View>
            <SendButton aria-label="Send">
              <IconChevronLeftSmall aria-hidden="true" color="white" style={{ transform: 'rotate(180deg)' }} />
            </SendButton>
          </Row>
          <Text variant="label-xs" color="color.neutral.60" textAlign="center">
            Each rejection triggers a candidate notification with retake instructions.
          </Text>
        </ChatInputArea>
      </ChatPanel>

      {/* Right: Content Area */}
      <ContentArea>
        <Row alignItems="center" justifyContent="space-between">
          <Col>
            <H3>Reject and Request Retake</H3>
            <Text fontSize="T100" color="color.neutral.70">
              {selectedPhotos.size} of {failingPhotos.length} photos selected for rejection
            </Text>
          </Col>
          {currentStep === 'complete' && (
            <Button variant={ButtonVariant.Primary} size={ButtonSize.Small} onClick={onClose}>
              Done
            </Button>
          )}
        </Row>

        {/* Step 1 & 2: Photo list with rejection reasons */}
        {(currentStep === 'review' || currentStep === 'confirm-reasons') && (
          <Col gridGap="dimensions.spacing.200">
            {failingPhotos.map((photo) => (
              <PhotoRow key={photo.id} selected={selectedPhotos.has(photo.id)}>
                <input
                  type="checkbox"
                  checked={selectedPhotos.has(photo.id)}
                  onChange={() => togglePhoto(photo.id)}
                  style={{ width: 18, height: 18, flexShrink: 0, cursor: 'pointer' }}
                />
                <Avatar username={photo.username} fullName={photo.name} showFullName={false} showUsername={false} />
                <Col flex={1} gridGap="dimensions.spacing.100" style={{ minWidth: 0 }}>
                  <Row alignItems="center" gridGap="dimensions.spacing.200">
                    <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
                      {photo.name}
                    </Text>
                    <ConfidenceBadge score={photo.confidence}>
                      {photo.confidence}% — Fail
                    </ConfidenceBadge>
                  </Row>
                  <Text fontSize="T100" color="color.neutral.70">
                    {photo.reason}
                  </Text>
                  {currentStep === 'confirm-reasons' && (
                    <View padding={['dimensions.spacing.100', 'dimensions.spacing.200']} backgroundColor="color.surface.bg-muted" borderRadius="dimensions.border.radius.100">
                      <Text fontSize="T50" color="color.neutral.90">
                        Retake guidance: {photo.retakeGuidance}
                      </Text>
                    </View>
                  )}
                </Col>
                <Row gridGap="dimensions.spacing.100">
                  <Chip size={ChipSize.ExtraSmall}>IVV-Low</Chip>
                </Row>
              </PhotoRow>
            ))}
          </Col>
        )}

        {/* Step 3: Message template preview */}
        {currentStep === 'customize-message' && (
          <Col gridGap="dimensions.spacing.300">
            <Card padding="dimensions.spacing.300">
              <Col gridGap="dimensions.spacing.200">
                <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
                  Notification template
                </Text>
                <Text fontSize="T100" color="color.neutral.70">
                  Each candidate receives a personalized version with their specific retake guidance inserted at [SPECIFIC_GUIDANCE].
                </Text>
                <MessagePreview>{rejectionTemplate}</MessagePreview>
              </Col>
            </Card>

            <Card padding="dimensions.spacing.300">
              <Col gridGap="dimensions.spacing.200">
                <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
                  Recipients ({selectedPhotos.size})
                </Text>
                {failingPhotos.filter(p => selectedPhotos.has(p.id)).map(photo => (
                  <Row key={photo.id} alignItems="center" gridGap="dimensions.spacing.200">
                    <Avatar username={photo.username} fullName={photo.name} showFullName={false} showUsername={false} />
                    <Col style={{ minWidth: 0 }}>
                      <Text fontSize="T100" fontWeight="bold" color="color.neutral.90">{photo.name}</Text>
                      <Text fontSize="T50" color="color.neutral.70">{photo.retakeGuidance}</Text>
                    </Col>
                  </Row>
                ))}
              </Col>
            </Card>
          </Col>
        )}

        {/* Step 4: Complete confirmation */}
        {currentStep === 'complete' && (
          <Col gridGap="dimensions.spacing.200">
            <Card padding="dimensions.spacing.300" status="success" statusIconAltText="Complete">
              <Col gridGap="dimensions.spacing.200">
                <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
                  All notifications sent
                </Text>
                <Text fontSize="T100" color="color.neutral.70">
                  {selectedPhotos.size} candidates have been notified with personalized retake instructions. Deadline: 48 hours from now.
                </Text>
              </Col>
            </Card>
            {failingPhotos.filter(p => selectedPhotos.has(p.id)).map(photo => (
              <PhotoRow key={photo.id} selected={false}>
                <Avatar username={photo.username} fullName={photo.name} showFullName={false} showUsername={false} />
                <Col flex={1} gridGap="dimensions.spacing.100" style={{ minWidth: 0 }}>
                  <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">{photo.name}</Text>
                  <Text fontSize="T100" color="color.green.70">Notification sent — awaiting resubmission</Text>
                </Col>
                <Chip size={ChipSize.ExtraSmall} backgroundColor="color.green.10">Sent</Chip>
              </PhotoRow>
            ))}
          </Col>
        )}
      </ContentArea>
    </PageContainer>
  );
};
