import { useState } from 'react';
import { Col, Row, View } from '@amzn/stencil-react-components/layout';
import { Text, H3 } from '@amzn/stencil-react-components/text';
import { Button, ButtonVariant, ButtonSize } from '@amzn/stencil-react-components/button';
import { Card } from '@amzn/stencil-react-components/card';
import { Chip, ChipSize } from '@amzn/stencil-react-components/chip';
import { Input, InputWrapper } from '@amzn/stencil-react-components/input';
import { Avatar } from '@amzn/stencil-react-components/avatar';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import styled from '@emotion/styled';
import { ActionItem } from './ActionCard';
import IconThumbUpExtraSmall from '@amzn/stencil-react-icons/icons/icon-thumb-up-extra-small';
import IconThumbDownExtraSmall from '@amzn/stencil-react-icons/icons/icon-thumb-down-extra-small';
import IconCopyExtraSmall from '@amzn/stencil-react-icons/icons/icon-copy-extra-small';
import IconChevronRightSmall from '@amzn/stencil-react-icons/icons/icon-chevron-right-small';
import IconChevronDownSmall from '@amzn/stencil-react-icons/icons/icon-chevron-down-small';

interface SubPrompt {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

// Full set of 12 badge photo candidates from ops data
const allBadgePhotos = [
  { id: 'bp-1', name: 'Maria Santos', username: 'msantos', confidence: 62, status: 'low' as const, reason: 'Background not uniform — dimly lit room', tags: ['IVV-Low', 'PHA-Batch'] },
  { id: 'bp-2', name: 'Juan Reyes', username: 'jreyes', confidence: 58, status: 'low' as const, reason: 'Partial face occlusion — wearing cap', tags: ['IVV-Low', 'PHA-Batch'] },
  { id: 'bp-3', name: 'Ana Cruz', username: 'acruz', confidence: 65, status: 'low' as const, reason: 'Image slightly blurry. White background confirmed', tags: ['IVV-Low', 'PHA-Batch'] },
  { id: 'bp-4', name: 'Paolo Garcia', username: 'pgarcia', confidence: 71, status: 'medium' as const, reason: 'Slight shadow on left side. Full face visible', tags: ['IVV-Med', 'PHA-Batch'] },
  { id: 'bp-5', name: 'Carla Mendoza', username: 'cmendoza', confidence: 45, status: 'low' as const, reason: 'Cropped too tight — shoulders not visible', tags: ['IVV-Low', 'Retake-Req'] },
  { id: 'bp-6', name: 'Ramon Torres', username: 'rtorres', confidence: 88, status: 'high' as const, reason: 'Good quality. White background. Clear face', tags: ['IVV-High', 'Auto-Pass'] },
  { id: 'bp-7', name: 'Sofia Flores', username: 'sflores', confidence: 92, status: 'high' as const, reason: 'Excellent quality. All criteria met', tags: ['IVV-High', 'Auto-Pass'] },
  { id: 'bp-8', name: 'Liam Santos', username: 'lsantos', confidence: 76, status: 'medium' as const, reason: 'Off-white background. Acceptable', tags: ['IVV-Med', 'PHA-Batch'] },
  { id: 'bp-9', name: 'Bea Aquino', username: 'baquino', confidence: 85, status: 'high' as const, reason: 'Good quality. Minor lighting variance', tags: ['IVV-High', 'Auto-Pass'] },
  { id: 'bp-10', name: 'Diego Ignacio', username: 'dignacio', confidence: 52, status: 'low' as const, reason: 'Filter detected — skin smoothing applied', tags: ['IVV-Low', 'Retake-Req'] },
  { id: 'bp-11', name: 'Ina Mendoza', username: 'imendoza', confidence: 79, status: 'medium' as const, reason: 'Slightly overexposed. Face clear', tags: ['IVV-Med', 'PHA-Batch'] },
  { id: 'bp-12', name: 'Rafael Aguilar', username: 'raguilar', confidence: 90, status: 'high' as const, reason: 'Perfect. White bg, full face, no filters', tags: ['IVV-High', 'Auto-Pass'] },
];

const confidenceColor = (score: number) => {
  if (score >= 80) return token('color.green.70');
  if (score >= 65) return token('color.orange.70');
  return token('color.red.70');
};

const confidenceBg = (score: number) => {
  if (score >= 80) return 'rgba(0, 168, 144, 0.1)';
  if (score >= 65) return 'rgba(255, 132, 0, 0.1)';
  return 'rgba(218, 55, 51, 0.1)';
};

const ActionLink = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: `${token('dimensions.spacing.200')} ${token('dimensions.spacing.300')}`,
  border: `1px solid ${token('color.border.primary')}`,
  borderRadius: token('dimensions.border.radius.200'),
  backgroundColor: token('color.surface.bg-default'),
  cursor: 'pointer',
  fontFamily: 'inherit',
  '&:hover': {
    backgroundColor: token('color.surface.bg-muted'),
  },
});

const ChatInput = styled('div')({
  border: `1px solid ${token('color.purple.70')}`,
  borderRadius: token('dimensions.border.radius.200'),
  padding: `${token('dimensions.spacing.200')} ${token('dimensions.spacing.200')}`,
  width: '100%',
});

const FeedbackButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  border: 'none',
  borderRadius: '100px',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  color: token('color.neutral.70'),
  '&:hover': {
    backgroundColor: token('color.action.utility.bg-hover'),
  },
});

const PhotoGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: token('dimensions.spacing.200'),
});

const ConfidenceBadge = styled('span')<{ score: number }>(({ score }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  borderRadius: 100,
  fontSize: 11,
  fontWeight: 700,
  color: confidenceColor(score),
  backgroundColor: confidenceBg(score),
}));

const PhotoCardActions = styled('div')({
  display: 'flex',
  gap: token('dimensions.spacing.100'),
  marginTop: token('dimensions.spacing.200'),
});

const ApproveBtn = styled('button')({
  flex: 1,
  height: 28,
  border: `1px solid ${token('color.green.60')}`,
  borderRadius: token('dimensions.border.radius.100'),
  backgroundColor: 'transparent',
  color: token('color.green.70'),
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  '&:hover': {
    backgroundColor: 'rgba(0, 168, 144, 0.08)',
  },
});

const RejectBtn = styled('button')({
  flex: 1,
  height: 28,
  border: `1px solid ${token('color.red.60')}`,
  borderRadius: token('dimensions.border.radius.100'),
  backgroundColor: 'transparent',
  color: token('color.red.70'),
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  '&:hover': {
    backgroundColor: 'rgba(218, 55, 51, 0.08)',
  },
});

const ApprovedOverlay = styled('div')({
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(0, 168, 144, 0.06)',
  borderRadius: token('dimensions.border.radius.200'),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const RejectedOverlay = styled('div')({
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(218, 55, 51, 0.06)',
  borderRadius: token('dimensions.border.radius.200'),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

interface MultiPromptPanelProps {
  item: ActionItem;
  subPrompts: SubPrompt[];
  onApproveAll: (id: string) => void;
  onApproveOne: (subId: string) => void;
}

export const MultiPromptPanel = ({ item, subPrompts, onApproveAll, onApproveOne }: MultiPromptPanelProps) => {
  const [approvedItems, setApprovedItems] = useState<Set<string>>(new Set());
  const [rejectedItems, setRejectedItems] = useState<Set<string>>(new Set());
  const [allApproved, setAllApproved] = useState(false);
  const [showPhotoGrid, setShowPhotoGrid] = useState(false);

  const handleApproveAll = () => {
    setAllApproved(true);
    setApprovedItems(new Set(subPrompts.map(s => s.id)));
    onApproveAll(item.id);
  };

  const handleUndoAll = () => {
    setAllApproved(false);
    setApprovedItems(new Set());
    setRejectedItems(new Set());
  };

  const handleApproveOne = (subId: string) => {
    setApprovedItems(prev => new Set(prev).add(subId));
    setRejectedItems(prev => { const n = new Set(prev); n.delete(subId); return n; });
    onApproveOne(subId);
  };

  const handleRejectOne = (subId: string) => {
    setRejectedItems(prev => new Set(prev).add(subId));
    setApprovedItems(prev => { const n = new Set(prev); n.delete(subId); return n; });
  };

  const handleApprovePhoto = (photoId: string) => {
    setApprovedItems(prev => new Set(prev).add(photoId));
    setRejectedItems(prev => { const n = new Set(prev); n.delete(photoId); return n; });
  };

  const handleRejectPhoto = (photoId: string) => {
    setRejectedItems(prev => new Set(prev).add(photoId));
    setApprovedItems(prev => { const n = new Set(prev); n.delete(photoId); return n; });
  };

  return (
    <Col gridGap="dimensions.spacing.200">
      <Card padding="dimensions.spacing.300" width="100%" borderRadius="dimensions.border.radius.300">
        <Col gridGap="dimensions.spacing.300">
          <Row alignItems="center" justifyContent="space-between">
            <Row gridGap="dimensions.spacing.200" alignItems="center">
              <View
                backgroundColor="color.status.critical-bg"
                padding="dimensions.spacing.200"
                borderRadius="dimensions.border.radius.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
                width={32}
                height={32}
              >
                <IconThumbUpExtraSmall aria-hidden="true" />
              </View>
              <H3>{item.title}</H3>
            </Row>
          </Row>

          <Row justifyContent="flex-end">
            {allApproved ? (
              <Button variant={ButtonVariant.Tertiary} onClick={handleUndoAll}>
                Undo all
              </Button>
            ) : (
              <Button variant={ButtonVariant.Primary} onClick={handleApproveAll}>
                Approve all {subPrompts.length}
              </Button>
            )}
          </Row>

          {/* Default sub-prompt cards (low-confidence only) */}
          {!showPhotoGrid && (
            <Col gridGap="dimensions.spacing.300">
              {subPrompts.map((sub) => (
                <Card key={sub.id} padding="dimensions.spacing.300" width="100%">
                  <Col gridGap="dimensions.spacing.200">
                    <Row alignItems="center" justifyContent="space-between">
                      <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
                        {sub.title}
                      </Text>
                    </Row>
                    <Text fontSize="T100" color="color.neutral.90">
                      {sub.description}
                    </Text>
                    <Row alignItems="center" justifyContent="space-between">
                      <Row gridGap="dimensions.spacing.100">
                        {sub.tags.map((tag) => (
                          <Chip key={tag} size={ChipSize.ExtraSmall}>{tag}</Chip>
                        ))}
                      </Row>
                      {approvedItems.has(sub.id) ? (
                        <Button variant={ButtonVariant.Tertiary} onClick={() => { setApprovedItems(prev => { const n = new Set(prev); n.delete(sub.id); return n; }); setAllApproved(false); }}>
                          Undo
                        </Button>
                      ) : (
                        <Button variant={ButtonVariant.Secondary} onClick={() => handleApproveOne(sub.id)}>
                          Approve
                        </Button>
                      )}
                    </Row>
                  </Col>
                </Card>
              ))}
            </Col>
          )}

          {/* Expanded Photo Grid (2-column) */}
          {showPhotoGrid && (
            <Col gridGap="dimensions.spacing.200">
              <Row alignItems="center" justifyContent="space-between">
                <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
                  All 12 badge photos
                </Text>
                <Row gridGap="dimensions.spacing.200">
                  <Button variant={ButtonVariant.Tertiary} size={ButtonSize.Small} onClick={() => {
                    const highConfidence = allBadgePhotos.filter(p => p.confidence >= 70).map(p => p.id);
                    setApprovedItems(new Set([...approvedItems, ...highConfidence]));
                  }}>
                    Approve all passing (70%+)
                  </Button>
                </Row>
              </Row>
              <PhotoGrid>
                {allBadgePhotos.map((photo) => (
                  <Card key={photo.id} padding="dimensions.spacing.250" width="100%" style={{ position: 'relative' }}>
                    {approvedItems.has(photo.id) && (
                      <ApprovedOverlay>
                        <Text fontSize="T100" fontWeight="bold" color="color.green.70">Approved</Text>
                      </ApprovedOverlay>
                    )}
                    {rejectedItems.has(photo.id) && (
                      <RejectedOverlay>
                        <Text fontSize="T100" fontWeight="bold" color="color.red.70">Rejected — retake requested</Text>
                      </RejectedOverlay>
                    )}
                    <Col gridGap="dimensions.spacing.150" style={{ opacity: approvedItems.has(photo.id) || rejectedItems.has(photo.id) ? 0.4 : 1 }}>
                      <Row alignItems="center" gridGap="dimensions.spacing.200">
                        <Avatar username={photo.username} fullName={photo.name} showFullName={false} showUsername={false} />
                        <Col style={{ minWidth: 0 }}>
                          <Text fontSize="T100" fontWeight="bold" color="color.neutral.90" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {photo.name}
                          </Text>
                          <ConfidenceBadge score={photo.confidence}>
                            {photo.confidence}% confidence
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
                      {!approvedItems.has(photo.id) && !rejectedItems.has(photo.id) && (
                        <PhotoCardActions>
                          <ApproveBtn onClick={() => handleApprovePhoto(photo.id)}>Approve</ApproveBtn>
                          <RejectBtn onClick={() => handleRejectPhoto(photo.id)}>Reject</RejectBtn>
                        </PhotoCardActions>
                      )}
                    </Col>
                  </Card>
                ))}
              </PhotoGrid>
            </Col>
          )}

          <Col gridGap="dimensions.spacing.200">
            <ActionLink onClick={() => setShowPhotoGrid(!showPhotoGrid)}>
              <Text fontSize="T200" fontWeight="medium" color="color.neutral.90">
                {showPhotoGrid ? 'Hide photo grid' : 'View full photo grid'}
              </Text>
              {showPhotoGrid ? <IconChevronDownSmall aria-hidden="true" /> : <IconChevronRightSmall aria-hidden="true" />}
            </ActionLink>
            <ActionLink>
              <Text fontSize="T200" fontWeight="medium" color="color.neutral.90">
                Reject all failing and request retake
              </Text>
              <IconChevronRightSmall aria-hidden="true" />
            </ActionLink>
            <ActionLink>
              <Text fontSize="T200" fontWeight="medium" color="color.neutral.90">
                Flag batch for security review
              </Text>
              <IconChevronRightSmall aria-hidden="true" />
            </ActionLink>
          </Col>

          <Row gridGap="dimensions.spacing.100">
            <FeedbackButton aria-label="Copy">
              <IconCopyExtraSmall aria-hidden="true" />
            </FeedbackButton>
            <FeedbackButton aria-label="Helpful">
              <IconThumbUpExtraSmall aria-hidden="true" />
            </FeedbackButton>
            <FeedbackButton aria-label="Not helpful">
              <IconThumbDownExtraSmall aria-hidden="true" />
            </FeedbackButton>
          </Row>

          <ChatInput>
            <InputWrapper id="multi-chat-input" labelText="">
              {(inputProps) => (
                <Input {...inputProps} placeholder="Ask a question about this action" />
              )}
            </InputWrapper>
          </ChatInput>
        </Col>
      </Card>
    </Col>
  );
};
