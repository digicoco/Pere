import { useState } from 'react';
import { Col, Row, View } from '@amzn/stencil-react-components/layout';
import { H2, Text } from '@amzn/stencil-react-components/text';
import { Button, ButtonVariant } from '@amzn/stencil-react-components/button';
import { Breadcrumbs } from '@amzn/stencil-react-components/breadcrumbs';
import { TabBar, TabSwitcher, TabPanel, useTabs } from '@amzn/stencil-react-components/tabs';
import { Input, InputWrapper } from '@amzn/stencil-react-components/input';
import { Select } from '@amzn/stencil-react-components/select';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import styled from '@emotion/styled';
import IconChevronRightSmall from '@amzn/stencil-react-icons/icons/icon-chevron-right-small';

const TextArea = styled('textarea')({
  width: '100%',
  fontFamily: 'inherit',
  fontSize: 16,
  lineHeight: 1.5,
  padding: `${token('dimensions.spacing.200')} ${token('dimensions.spacing.300')}`,
  border: `1px solid ${token('color.input.border-default')}`,
  borderRadius: token('dimensions.border.radius.100'),
  backgroundColor: token('color.input.bg-default'),
  color: token('color.text.primary'),
  resize: 'vertical',
  outline: 'none',
  '&:focus': {
    borderColor: token('color.action.primary.bg-default'),
    boxShadow: `0 0 0 1px ${token('color.action.primary.bg-default')}`,
  },
  '&::placeholder': {
    color: token('color.text.secondary'),
    fontStyle: 'italic',
  },
});

const ActionLinkItem = styled('button')({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: token('dimensions.spacing.300'),
  padding: `${token('dimensions.spacing.200')} ${token('dimensions.spacing.300')}`,
  border: `1px solid ${token('color.border.primary')}`,
  borderRadius: 8,
  backgroundColor: token('color.surface.bg-default'),
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: 16,
  fontWeight: 500,
  color: token('color.text.primary'),
  textAlign: 'left',
  '&:hover': {
    backgroundColor: token('color.surface.bg-muted'),
  },
});

const Footer = styled('div')({
  position: 'sticky',
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: `${token('dimensions.spacing.300')} ${token('dimensions.spacing.800')}`,
  backgroundColor: token('color.surface.bg-default'),
  boxShadow: `0px 0px 5px ${token('color.gradient.elevation')}`,
});

const ChatPreview = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${token('color.border.primary')}`,
  borderRadius: 16,
  backgroundColor: token('color.surface.bg-default'),
  overflow: 'hidden',
});

interface CreateAgentPageProps {
  onBack: () => void;
}

export const CreateAgentPage = ({ onBack }: CreateAgentPageProps) => {
  const [agentName, setAgentName] = useState('');
  const [description, setDescription] = useState('');
  const [model, setModel] = useState('');
  const [instructions, setInstructions] = useState('');

  const tabs = [
    { label: 'Instructions', value: 'instructions' },
    { label: 'Knowledge', value: 'knowledge' },
    { label: 'Actions', value: 'actions' },
    { label: 'Permissions', value: 'permissions' },
  ];

  const { tabBarProps, tabSwitcherProps } = useTabs({ tabs, defaultTab: 'instructions' });

  const tryAskingPrompts = [
    'What is the schedule for today?',
    'What is special about this year for PXT?',
    'What are good places to eat in HQ2?',
  ];

  return (
    <Col flex={1} backgroundColor="color.surface.bg-default" style={{ minHeight: '100%' }}>
      {/* Header with breadcrumbs */}
      <Row
        alignItems="center"
        justifyContent="space-between"
        padding={['dimensions.spacing.300', 'dimensions.spacing.400']}
        borderBottom={`1px solid ${token('color.border.primary')}`}
      >
        <Breadcrumbs
          aria-label="Agent creation"
          crumbs={[
            { title: 'Agents', url: '#' },
            { title: 'Create agent' },
          ]}
          onCrumbClick={(e) => {
            e.preventDefault();
            onBack();
          }}
        />
        <Row gridGap="dimensions.spacing.300" alignItems="center">
          <Button variant={ButtonVariant.Tertiary} onClick={onBack}>
            Exit
          </Button>
          <Button variant={ButtonVariant.Secondary}>
            Publish agent
          </Button>
        </Row>
      </Row>

      {/* Main content area */}
      <Row flex={1} style={{ overflow: 'hidden' }}>
        {/* Left panel - Configuration */}
        <Col style={{ width: '55%', flexShrink: 0, overflow: 'auto' }} padding="dimensions.spacing.400" gridGap="dimensions.spacing.400">
          <TabBar {...tabBarProps} />

          <TabSwitcher {...tabSwitcherProps}>
            <TabPanel value="instructions">
              <Col gridGap="dimensions.spacing.300">
                <InputWrapper id="agent-name" labelText="Name">
                  {(inputProps) => (
                    <Input
                      {...inputProps}
                      placeholder="e.g. Badge Photo Validator"
                      value={agentName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAgentName(e.target.value)}
                    />
                  )}
                </InputWrapper>

                <Col gridGap="dimensions.spacing.200">
                  <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
                    Description
                  </Text>
                  <TextArea
                    placeholder="e.g. Monitors PHA submissions and flags photos with low IVV confidence scores for recruiter review."
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Col>

                <InputWrapper id="agent-model" labelText="Model">
                  {(inputProps) => (
                    <Select
                      {...inputProps}
                      options={[
                        { label: 'Claude 3.5 Sonnet', value: 'claude-3.5-sonnet' },
                        { label: 'Claude 3 Opus', value: 'claude-3-opus' },
                        { label: 'GPT-4o', value: 'gpt-4o' },
                        { label: 'Nova Pro', value: 'nova-pro' },
                      ]}
                      placeholder="Select a model"
                      value={model}
                      onChange={(value: string) => setModel(value)}
                    />
                  )}
                </InputWrapper>

                <Col gridGap="dimensions.spacing.200" flex={1}>
                  <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
                    Instructions
                  </Text>
                  <TextArea
                    placeholder="e.g. Provide concise, expert-level response using sales data from the past quarter, formatted using bullet points."
                    rows={8}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    style={{ flex: 1, minHeight: 200 }}
                  />
                </Col>
              </Col>
            </TabPanel>

            <TabPanel value="knowledge">
              <Col padding="dimensions.spacing.400" gridGap="dimensions.spacing.300">
                <Text fontSize="T200" color="color.neutral.60">
                  Upload documents or connect data sources for the agent to reference.
                </Text>
                <Button variant={ButtonVariant.Secondary}>
                  Add knowledge source
                </Button>
              </Col>
            </TabPanel>

            <TabPanel value="actions">
              <Col padding="dimensions.spacing.400" gridGap="dimensions.spacing.300">
                <Text fontSize="T200" color="color.neutral.60">
                  Define actions the agent can perform on behalf of the recruiter.
                </Text>
                <Button variant={ButtonVariant.Secondary}>
                  Add action
                </Button>
              </Col>
            </TabPanel>

            <TabPanel value="permissions">
              <Col padding="dimensions.spacing.400" gridGap="dimensions.spacing.300">
                <Text fontSize="T200" color="color.neutral.60">
                  Control who can view, edit, and run this agent.
                </Text>
                <Button variant={ButtonVariant.Secondary}>
                  Manage permissions
                </Button>
              </Col>
            </TabPanel>
          </TabSwitcher>
        </Col>

        {/* Right panel - Chat Preview */}
        <Col style={{ width: '45%' }} padding="dimensions.spacing.400">
          <ChatPreview>
            <Col flex={1} padding="dimensions.spacing.400" gridGap="dimensions.spacing.400" justifyContent="center">
              <Col gridGap="dimensions.spacing.200" padding={['0', 'dimensions.spacing.300']}>
                <H2 fontSize="T400">
                  {agentName || 'Agent preview'}
                </H2>
                <Text fontSize="T200" color="color.neutral.70">
                  {description || 'This is the official space for your agent. Configure the agent on the left and preview conversations here.'}
                </Text>
              </Col>

              <Col gridGap="dimensions.spacing.300" padding={['0', 'dimensions.spacing.300']}>
                <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
                  Try asking:
                </Text>
                <Col gridGap="dimensions.spacing.200">
                  {tryAskingPrompts.map((prompt, i) => (
                    <ActionLinkItem key={i}>
                      <Text fontSize="T200" fontWeight="medium" color="color.neutral.90">
                        {prompt}
                      </Text>
                      <IconChevronRightSmall aria-hidden="true" />
                    </ActionLinkItem>
                  ))}
                </Col>
              </Col>
            </Col>

            {/* Chat input area */}
            <Col padding="dimensions.spacing.300" borderTop={`1px solid ${token('color.border.primary')}`}>
              <View
                backgroundColor="color.surface.bg-default"
                border={`1px solid ${token('color.border.primary')}`}
                borderRadius="dimensions.border.radius.300"
                padding={['dimensions.spacing.200', 'dimensions.spacing.300']}
                style={{ boxShadow: '0px 1px 5px rgba(35, 47, 62, 0.1)' }}
              >
                <InputWrapper id="agent-test-input" labelText="">
                  {(inputProps) => (
                    <Input
                      {...inputProps}
                      placeholder="Test your agent here..."
                    />
                  )}
                </InputWrapper>
              </View>
            </Col>
          </ChatPreview>
        </Col>
      </Row>

      {/* Footer */}
      <Footer>
        <Button variant={ButtonVariant.Primary}>
          Apply
        </Button>
      </Footer>
    </Col>
  );
};
