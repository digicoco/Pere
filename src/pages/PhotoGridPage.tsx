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
import IconThumbUpExtraSmall from '@amzn/stencil-react-icons/icons/icon-thumb-up-extra-small';
import IconThumbDownExtraSmall from '@amzn/stencil-react-icons/icons/icon-thumb-down-extra-small';

// ─── Badge Photo Data ──────────────────────────────────────────────────────────

const allBadgePhotos = [
  { id: 'bp-1', name: 'Maria Santos', username: 'msantos', confidence: 62, reason: 'Background not uniform — dimly lit room', tags: ['IVV-Low', 'PHA-Batch'] },
  { id: 'bp-2', name: 'Juan Reyes', username: 'jreyes', confidence: 58, reason: 'Partial face occlusion — wearing cap', tags: ['IVV-Low', 'PHA-Batch'] },
  { id: 'bp-3', name: 'Ana Cruz', username: 'acruz', confidence: 65, reason: 'Image slightly blurry. White background confirmed', tags: ['IVV-Low', 'PHA-Batch'] },
  { id: 'bp-4', name: 'Paolo Garcia', username: 'pgarcia', confidence: 71, reason: 'Slight shadow on left side. Full face visible', tags: ['IVV-Med', 'PHA-Batch'] },
  { id: 'bp-5', name: 'Carla Mendoza', username: 'cmendoza', confidence: 45, reason: 'Cropped too tight — shoulders not visible', tags: ['IVV-Low', 'Retake-Req'] },
  { id: 'bp-6', name: 'Ramon Torres', username: 'rtorres', confidence: 88, reason: 'Good quality. White background. Clear face', tags: ['IVV-High', 'Auto-Pass'] },
  { id: 'bp-7', name: 'Sofia Flores', username: 'sflores', confidence: 92, reason: 'Excellent quality. All criteria met', tags: ['IVV-High', 'Auto-Pass'] },
  { id: 'bp-8', name: 'Liam Santos', username: 'lsantos', confidence: 76, reason: 'Off-white background. Acceptable', tags: ['IVV-Med', 'PHA-Batch'] },
  { id: 'bp-9', name: 'Bea Aquino', username: 'baquino', confidence: 85, reason: 'Good quality. Minor lighting variance', tags: ['IVV-High', 'Auto-Pass'] },
  { id: 'bp-10', name: 'Diego Ignacio', username: 'dignacio', confidence: 52, reason: 'Filter detected — skin smoothing applied', tags: ['IVV-Low', 'Retake-Req'] },
  { id: 'bp-11', name: 'Ina Mendoza', username: 'imendoza', confidence: 79, reason: 'Slightly overexposed. Face clear', tags: ['IVV-Med', 'PHA-Batch'] },
  { id: 'bp-12', name: 'Rafael Aguilar', username: 'raguilar', confidence: 90, reason: 'Perfect. White bg, full face, no filters', tags: ['IVV-High', 'Auto-Pass'] },
];

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
  width: 380,
  minWidth: 380,
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
  gap: token('dimensions.spacing.300'),
});

const ChatInput = styled('div')({
  borderTop: `1px solid ${token('color.border.primary')}`,
  padding: token('dimensions.spacing.300'),
  display: 'flex',
  flexDirection: 'column',
  gap: token('dimensions.spacing.200'),
  flexShrink: 0,
});

const UserBubble = styled('div')({
  alignSelf: 'flex-end',
  backgroundColor: token('color.fill.muted.blue'),
  borderRadius: 8,
  padding: `${token('dimensions.spacing.200')} ${token('dimensions.spacing.300')}`,
  maxWidth: '85%',
});

const AiBubble = styled('div')({
  border: `1px solid ${token('color.border.primary')}`,
  borderRadius: 8,
  padding: `${token('dimensions.spacing.250')} ${token('dimensions.spacing.300')}`,
  display: 'flex',
  alignItems: 'center',
  gap: token('dimensions.spacing.200'),
});

const ContentArea = styled('main')({
  flex: 1,
  overflowY: 'auto',
  padding: token('dimensions.spacing.400'),
});

const PhotoGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: token('dimensions.spacing.300'),
});

const PhotoCard = styled('div')<{ actioned?: boolean }>(({ actioned }) => ({
  border: `1px solid ${token('color.border.primary')}`,
  borderRadius: token('dimensions.border.radius.200'),
  padding: token('dimensions.spacing.300'),
  display: 'flex',
  flexDirection: 'column',
  gap: token('dimensions.spacing.200'),
  position: 'relative',
  opacity: actioned ? 0.5 : 1,
  transition: 'opacity 200ms ease',
}));

const ConfidenceBadge = styled('span')<{ score: number }>(({ score }) => {
  const color = score >= 80 ? token('color.green.70') : score >= 65 ? token('color.orange.70') : token('color.red.70');
  const bg = score >= 80 ? 'rgba(0, 168, 144, 0.1)' : score >= 65 ? 'rgba(255, 132, 0, 0.1)' : 'rgba(218, 55, 51, 0.1)';
  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: 100,
    fontSize: 11,
    fontWeight: 700,
    color,
    backgroundColor: bg,
  };
});

const ActionRow = styled('div')({
  display: 'flex',
  gap: token('dimensions.spacing.100'),
  marginTop: token('dimensions.spacing.100'),
});

const ApproveBtn = styled('button')({
  flex: 1,
  height: 30,
  border: `1px solid ${token('color.green.60')}`,
  borderRadius: token('dimensions.border.radius.100'),
  backgroundColor: 'transparent',
  color: token('color.green.70'),
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  '&:hover': { backgroundColor: 'rgba(0, 168, 144, 0.08)' },
});

const RejectBtn = styled('button')({
  flex: 1,
  height: 30,
  border: `1px solid ${token('color.red.60')}`,
  borderRadius: token('dimensions.border.radius.100'),
  backgroundColor: 'transparent',
  color: token('color.red.70'),
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  '&:hover': { backgroundColor: 'rgba(218, 55, 51, 0.08)' },
});

const FlagBtn = styled('button')({
  flex: 1,
  height: 30,
  border: `1px solid ${token('color.border.primary')}`,
  borderRadius: token('dimensions.border.radius.100'),
  backgroundColor: 'transparent',
  color: token('color.neutral.70'),
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
  '&:hover': { backgroundColor: token('color.surface.bg-muted') },
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

const TaskCard = styled('div')({
  border: `1px solid ${token('color.border.primary')}`,
  borderRadius: 8,
  padding: token('dimensions.spacing.300'),
  display: 'flex',
  flexDirection: 'column',
  gap: token('dimensions.spacing.200'),
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

// ─── Component ─────────────────────────────────────────────────────────────────

interface PhotoGridPageProps {
  onClose: () => void;
}

export const PhotoGridPage = ({ onClose }: PhotoGridPageProps) => {
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [rejected, setRejected] = useState<Set<string>>(new Set());
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [flagPending, setFlagPending] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);

  const handleApprove = (id: string) => {
    setApproved(prev => new Set(prev).add(id));
    setRejected(prev => { const n = new Set(prev); n.delete(id); return n; });
    setFlagged(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleReject = (id: string) => {
    setRejected(prev => new Set(prev).add(id));
    setApproved(prev => { const n = new Set(prev); n.delete(id); return n; });
    setFlagged(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleUndo = (id: string) => {
    setApproved(prev => { const n = new Set(prev); n.delete(id); return n; });
    setRejected(prev => { const n = new Set(prev); n.delete(id); return n; });
    setFlagged(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleFlag = (id: string) => {
    const photo = allBadgePhotos.find(p => p.id === id);
    setFlagPending(id);
    setChatMessages(prev => [...prev,
      { role: 'ai', text: `You're flagging ${photo?.name}'s badge photo for security review. Please provide a reason for the flag:` }
    ]);
  };

  const handleFlagSubmit = () => {
    if (flagPending && message.trim()) {
      setFlagged(prev => new Set(prev).add(flagPending));
      setApproved(prev => { const n = new Set(prev); n.delete(flagPending); return n; });
      setRejected(prev => { const n = new Set(prev); n.delete(flagPending); return n; });
      const photo = allBadgePhotos.find(p => p.id === flagPending);
      setChatMessages(prev => [...prev,
        { role: 'user', text: message },
        { role: 'ai', text: `Flagged ${photo?.name}'s photo for security review. Reason: "${message}". The security team will be notified and the photo is now on hold pending their review.` }
      ]);
      setMessage('');
      setFlagPending(null);
    }
  };

  const handleApproveAllPassing = () => {
    const passing = allBadgePhotos.filter(p => p.confidence >= 70).map(p => p.id);
    setApproved(new Set([...approved, ...passing]));
  };

  const approvedCount = approved.size;
  const rejectedCount = rejected.size;
  const flaggedCount = flagged.size;
  const remainingCount = allBadgePhotos.length - approvedCount - rejectedCount - flaggedCount;

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
                Badge photo review
              </Text>
            </Col>
          </Row>
          <BackButton onClick={onClose}>
            <IconChevronLeftSmall aria-hidden="true" />
            Back to digest
          </BackButton>
        </ChatHeader>

        <ChatBody>
          <UserBubble>
            <Text fontSize="T200" color="color.neutral.90">
              Review 12 badge photos awaiting approval
            </Text>
          </UserBubble>

          <AiBubble>
            <View
              backgroundColor="color.status.critical-bg"
              padding="dimensions.spacing.200"
              borderRadius="dimensions.border.radius.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              width={28}
              height={28}
              style={{ flexShrink: 0 }}
            >
              <IconThumbUpExtraSmall aria-hidden="true" />
            </View>
            <Col gridGap="dimensions.spacing.100">
              <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
                12 Badge Photos Awaiting Approval
              </Text>
              <Text variant="label-xs" color="color.neutral.60">
                SLA: 12hr manual review · Oldest: 3h 42m
              </Text>
            </Col>
          </AiBubble>

          <TaskCard>
            <Text fontSize="T100" color="color.neutral.90">
              I found 12 badge photos awaiting review. 5 have low-confidence IVV scores (below 70%), 4 are medium (70-79%), and 3 are high confidence (80%+). The high-confidence photos can be batch-approved. I recommend reviewing the 5 low-confidence ones individually.
            </Text>
          </TaskCard>

          <Col gridGap="dimensions.spacing.200">
            <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Progress
            </Text>
            <Row gridGap="dimensions.spacing.200" flexWrap="wrap">
              <Chip size={ChipSize.ExtraSmall} backgroundColor="color.green.10">
                {approvedCount} approved
              </Chip>
              <Chip size={ChipSize.ExtraSmall} backgroundColor="color.red.10">
                {rejectedCount} rejected
              </Chip>
              {flaggedCount > 0 && (
                <Chip size={ChipSize.ExtraSmall} backgroundColor="color.orange.10">
                  {flaggedCount} flagged
                </Chip>
              )}
              <Chip size={ChipSize.ExtraSmall}>
                {remainingCount} remaining
              </Chip>
            </Row>
          </Col>

          <Col gridGap="dimensions.spacing.200">
            <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Quick actions
            </Text>
            <Button variant={ButtonVariant.Secondary} size={ButtonSize.Small} onClick={handleApproveAllPassing}>
              Approve all passing (70%+)
            </Button>
            <Button variant={ButtonVariant.Tertiary} size={ButtonSize.Small} onClick={() => {
              const failing = allBadgePhotos.filter(p => p.confidence < 70).map(p => p.id);
              setRejected(new Set([...rejected, ...failing]));
            }}>
              Reject all failing and request retake
            </Button>
          </Col>

          {/* Dynamic chat messages */}
          {chatMessages.map((msg, i) => (
            msg.role === 'user' ? (
              <UserBubble key={i}>
                <Text fontSize="T200" color="color.neutral.00">{msg.text}</Text>
              </UserBubble>
            ) : (
              <AiBubble key={i}>
                <Col gridGap="dimensions.spacing.100">
                  <Text fontSize="T100" color="color.neutral.90">{msg.text}</Text>
                </Col>
              </AiBubble>
            )
          ))}

          {flagPending && (
            <AiBubble style={{ borderColor: token('color.orange.60') }}>
              <Text fontSize="T100" fontWeight="bold" color="color.orange.70">
                Waiting for flag reason... Type below and press send.
              </Text>
            </AiBubble>
          )}
        </ChatBody>

        <ChatInput>
          <Row gridGap="dimensions.spacing.200" alignItems="center">
            <View flex={1}>
              <InputWrapper id="photo-grid-chat-input" labelText="">
                {(inputProps) => (
                  <Input
                    {...inputProps}
                    placeholder={flagPending ? "Enter flag reason..." : "Ask about these photos..."}
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' && flagPending) handleFlagSubmit(); }}
                  />
                )}
              </InputWrapper>
            </View>
            <SendButton aria-label="Send" onClick={flagPending ? handleFlagSubmit : undefined}>
              <IconChevronLeftSmall aria-hidden="true" color="white" style={{ transform: 'rotate(180deg)' }} />
            </SendButton>
          </Row>
          <Text variant="label-xs" color="color.neutral.60" textAlign="center">
            {flagPending ? 'Enter a reason to flag this photo for security review.' : 'Pere Copilot proposes — you approve every change.'}
          </Text>
        </ChatInput>
      </ChatPanel>

      {/* Right: Photo Grid Content */}
      <ContentArea>
        <Col gridGap="dimensions.spacing.300">
          <Row alignItems="center" justifyContent="space-between">
            <Col>
              <H3>Badge Photo Review</H3>
              <Text fontSize="T100" color="color.neutral.70">
                12 photos · {approvedCount} approved · {rejectedCount} rejected · {flaggedCount > 0 ? `${flaggedCount} flagged · ` : ''}{remainingCount} remaining
              </Text>
            </Col>
            <Row gridGap="dimensions.spacing.200">
              <Button variant={ButtonVariant.Primary} size={ButtonSize.Small} onClick={handleApproveAllPassing}>
                Approve all passing (70%+)
              </Button>
              <Button variant={ButtonVariant.Tertiary} size={ButtonSize.Small} onClick={onClose}>
                Done
              </Button>
            </Row>
          </Row>

          <PhotoGrid>
            {allBadgePhotos.map((photo) => {
              const isActioned = approved.has(photo.id) || rejected.has(photo.id) || flagged.has(photo.id);
              return (
                <PhotoCard key={photo.id} actioned={isActioned}>
                  <Row alignItems="center" gridGap="dimensions.spacing.200">
                    <Avatar username={photo.username} fullName={photo.name} showFullName={false} showUsername={false} />
                    <Col style={{ minWidth: 0, flex: 1 }}>
                      <Text fontSize="T200" fontWeight="bold" color="color.neutral.90" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {photo.name}
                      </Text>
                      <ConfidenceBadge score={photo.confidence}>
                        {photo.confidence}%
                      </ConfidenceBadge>
                    </Col>
                  </Row>
                  <Text fontSize="T50" color="color.neutral.70" style={{ lineHeight: 1.3 }}>
                    {photo.reason}
                  </Text>
                  <Row gridGap="dimensions.spacing.100" flexWrap="wrap">
                    {photo.tags.map(tag => (
                      <Chip key={tag} size={ChipSize.ExtraSmall}>{tag}</Chip>
                    ))}
                  </Row>
                  {isActioned ? (
                    <Row alignItems="center" justifyContent="space-between" style={{ width: '100%' }}>
                      <Text fontSize="T100" fontWeight="bold" color={approved.has(photo.id) ? 'color.green.70' : flagged.has(photo.id) ? 'color.orange.70' : 'color.red.70'}>
                        {approved.has(photo.id) ? 'Approved' : flagged.has(photo.id) ? 'Flagged for review' : 'Rejected — retake requested'}
                      </Text>
                      <FlagBtn onClick={() => handleUndo(photo.id)} style={{ flex: 'none', width: 'auto', padding: '0 10px' }}>
                        Undo
                      </FlagBtn>
                    </Row>
                  ) : (
                    <ActionRow>
                      <ApproveBtn onClick={() => handleApprove(photo.id)}>Approve</ApproveBtn>
                      <RejectBtn onClick={() => handleReject(photo.id)}>Reject</RejectBtn>
                      <FlagBtn onClick={() => handleFlag(photo.id)}>Flag</FlagBtn>
                    </ActionRow>
                  )}
                </PhotoCard>
              );
            })}
          </PhotoGrid>
        </Col>
      </ContentArea>
    </PageContainer>
  );
};
