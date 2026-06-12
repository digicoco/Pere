import { useState } from 'react';
import { Col, Row, View } from '@amzn/stencil-react-components/layout';
import { Text, H3 } from '@amzn/stencil-react-components/text';
import { Button, ButtonVariant, ButtonSize } from '@amzn/stencil-react-components/button';
import { Card } from '@amzn/stencil-react-components/card';
import { Chip, ChipSize } from '@amzn/stencil-react-components/chip';
import { Input, InputWrapper } from '@amzn/stencil-react-components/input';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import styled from '@emotion/styled';
import { ActionItem, ActionStatus } from './ActionCard';
import IconThumbUpExtraSmall from '@amzn/stencil-react-icons/icons/icon-thumb-up-extra-small';
import IconThumbDownExtraSmall from '@amzn/stencil-react-icons/icons/icon-thumb-down-extra-small';
import IconCopyExtraSmall from '@amzn/stencil-react-icons/icons/icon-copy-extra-small';
import IconChevronRightSmall from '@amzn/stencil-react-icons/icons/icon-chevron-right-small';

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

interface SinglePromptPanelProps {
  item: ActionItem;
  onComplete: (id: string) => void;
}

export const SinglePromptPanel = ({ item, onComplete }: SinglePromptPanelProps) => {
  const [chatQuery, setChatQuery] = useState('');

  return (
    <Card padding="dimensions.spacing.300" width="100%" borderRadius="dimensions.border.radius.300">
      <Col gridGap="dimensions.spacing.400">
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

        <Row gridGap="dimensions.spacing.200" alignItems="center">
          <Chip size={ChipSize.ExtraSmall}>{item.subtitle}</Chip>
          {item.secondaryText && (
            <Chip size={ChipSize.ExtraSmall}>{item.secondaryText}</Chip>
          )}
          <View flex={1} />
          <Button variant={ButtonVariant.Primary} onClick={() => onComplete(item.id)}>
            Approve
          </Button>
        </Row>

        <Col gridGap="dimensions.spacing.300">
          <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
            Agent Summary
          </Text>
          <Text fontSize="T200" color="color.neutral.90">
            {item.iconType === 'review'
              ? 'Documents have been uploaded and are pending your verification. 4 are gating items that block candidate progress to the next stage. OCR auto-extraction has matched candidate records with 95%+ confidence for 11 of 15 documents.'
              : item.iconType === 'response'
              ? 'These items require your follow-up. The agent has pre-drafted outreach templates and identified the specific blockers for each candidate. Resolving these will unblock downstream pipeline stages.'
              : 'Appointments are scheduled and candidates are ready. 2 candidates are missing non-gating items that can be collected during the session. Connect video sessions are pre-configured.'}
          </Text>
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
        </Col>

        <Col gridGap="dimensions.spacing.200">
          <ActionLink>
            <Text fontSize="T200" fontWeight="medium" color="color.neutral.90">
              Review all items in queue
            </Text>
            <IconChevronRightSmall aria-hidden="true" />
          </ActionLink>
          <ActionLink>
            <Text fontSize="T200" fontWeight="medium" color="color.neutral.90">
              Sort by wait time
            </Text>
            <IconChevronRightSmall aria-hidden="true" />
          </ActionLink>
          <ActionLink>
            <Text fontSize="T200" fontWeight="medium" color="color.neutral.90">
              Generate status report
            </Text>
            <IconChevronRightSmall aria-hidden="true" />
          </ActionLink>
        </Col>

        <ChatInput>
          <InputWrapper id="chat-input" labelText="">
            {(inputProps) => (
              <Input {...inputProps} placeholder="Ask a question about this action" />
            )}
          </InputWrapper>
        </ChatInput>
      </Col>
    </Card>
  );
};
