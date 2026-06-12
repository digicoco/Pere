import { useState } from 'react';
import { Col, Row, View } from '@amzn/stencil-react-components/layout';
import { Text, H3 } from '@amzn/stencil-react-components/text';
import { Button, ButtonVariant, ButtonSize } from '@amzn/stencil-react-components/button';
import { Card } from '@amzn/stencil-react-components/card';
import { Chip, ChipSize } from '@amzn/stencil-react-components/chip';
import { Input, InputWrapper } from '@amzn/stencil-react-components/input';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import styled from '@emotion/styled';
import { ActionItem } from './ActionCard';
import IconThumbUpExtraSmall from '@amzn/stencil-react-icons/icons/icon-thumb-up-extra-small';
import IconThumbDownExtraSmall from '@amzn/stencil-react-icons/icons/icon-thumb-down-extra-small';
import IconCopyExtraSmall from '@amzn/stencil-react-icons/icons/icon-copy-extra-small';
import IconChevronRightSmall from '@amzn/stencil-react-icons/icons/icon-chevron-right-small';

interface SubPrompt {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

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

interface MultiPromptPanelProps {
  item: ActionItem;
  subPrompts: SubPrompt[];
  onApproveAll: (id: string) => void;
  onApproveOne: (subId: string) => void;
}

export const MultiPromptPanel = ({ item, subPrompts, onApproveAll, onApproveOne }: MultiPromptPanelProps) => {
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
            <Button variant={ButtonVariant.Primary} onClick={() => onApproveAll(item.id)}>
              Approve all {subPrompts.length}
            </Button>
          </Row>

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
                    <Button variant={ButtonVariant.Secondary} onClick={() => onApproveOne(sub.id)}>
                      Approve
                    </Button>
                  </Row>
                </Col>
              </Card>
            ))}
          </Col>

          <Col gridGap="dimensions.spacing.200">
            <ActionLink>
              <Text fontSize="T200" fontWeight="medium" color="color.neutral.90">
                View full photo grid
              </Text>
              <IconChevronRightSmall aria-hidden="true" />
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
