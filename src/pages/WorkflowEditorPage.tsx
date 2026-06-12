import { useState } from 'react';
import { Col, Row, View } from '@amzn/stencil-react-components/layout';
import { H1, H2, Text } from '@amzn/stencil-react-components/text';
import { Button, ButtonVariant } from '@amzn/stencil-react-components/button';
import { Breadcrumbs } from '@amzn/stencil-react-components/breadcrumbs';
import { Chip, ChipSize } from '@amzn/stencil-react-components/chip';
import { Input, InputWrapper } from '@amzn/stencil-react-components/input';
import { AIIconWrapper } from '@amzn/stencil-react-components/ai';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import styled from '@emotion/styled';
import IconSparklesMedium from '@amzn/stencil-react-icons/icons/icon-sparkles-medium';
import IconSparklesSmall from '@amzn/stencil-react-icons/icons/icon-sparkles-small';
import IconCheckCircleFillSmall from '@amzn/stencil-react-icons/icons/icon-check-circle-fill-small';
import IconChevronRightSmall from '@amzn/stencil-react-icons/icons/icon-chevron-right-small';

// --- Step Data ---

const stepData = [
  {
    name: 'Define Workflow Scope',
    status: 'complete' as const,
    summary: ['Job Code: PH-CS-ASSOC-MNL-BGC-2026', 'Country: Philippines', 'Type: Post-Application (Candidate-Facing)'],
    chatMessage: 'Workflow scope defined. Searching workspace for matching configurations...',
    sources: ['Job Configuration', 'Site Settings', 'Compliance Rules'],
  },
  {
    name: 'Retrieve Job Configuration',
    status: 'complete' as const,
    summary: ['CS Associate — Customer Service', 'Tier-1 (no interview, auto-advance)', 'Pay: PHP 18,000-22,000/mo', 'Shifts: Day, Mid, Night', '35 openings remaining'],
    chatMessage: 'Found your active job posting for Manila-BGC. Tier-1 role — removing interview step, configuring auto-advance after vNHE.',
    sources: ['Job Posting PH-CS-ASSOC', 'Pay Construct', 'Shift Templates'],
  },
  {
    name: 'Retrieve Venue & Schedule Data',
    status: 'complete' as const,
    summary: ['Venue: Manila-BGC Virtual', 'Duration: 20 min (Amazon Connect)', '34 slots available next 5 days', 'Instant vNHE: Enabled (~3 min queue)'],
    chatMessage: 'Connected to Manila-BGC Virtual venue. 34 slots available. "Start Now" instant option enabled.',
    sources: ['Venue Config', 'Schedule Template', 'Slot Availability'],
  },
  {
    name: 'Apply Compliance Rules',
    status: 'complete' as const,
    summary: ['NID collection: post-LOI only (PH legal)', 'BGC consent: e-signature required', 'Medical: mandatory before Day 1', 'Email only (30-day launch)'],
    chatMessage: 'Philippines compliance rules applied. NID post-LOI, BGC e-signature, medical gating enforced.',
    sources: ['PH Data Privacy Act', 'BGC Policy', 'Medical Requirements'],
  },
  {
    name: 'Configure Application Confirmation',
    status: 'complete' as const,
    summary: ['Hero: "Congratulations! Your application is in."', 'CTA: Schedule Pre-Hire Appointment (immediate)', '7 default question buttons', 'Email: PH_APPLICATION_CONFIRMED'],
    chatMessage: 'Application confirmation configured with immediate scheduling CTA. No assessment gate for PH CS.',
    sources: ['Hero Card Template', 'Email Template', 'Question Bank'],
  },
  {
    name: 'Configure Pre-Hire Appointment (vNHE)',
    status: 'complete' as const,
    summary: ['3-tap scheduling: time → date → slot', 'Instant "Start Now" option enabled', 'Reminders: 24hr + 2hr (email)', 'Activities: work auth, badge photo, job preview'],
    chatMessage: 'Pre-hire appointment scheduling configured. Candidates can self-schedule or use instant queue.',
    sources: ['vNHE Flow Config', 'Reminder Templates', 'Activity Checklist'],
  },
  {
    name: 'Configure Decision Gate',
    status: 'complete' as const,
    summary: ['Type: Auto-advance (Tier-1)', 'Trigger: Recruiter marks "Complete"', 'Pass → Offer Letter | Fail → Closed', 'Timeout: 48hr → escalate to team lead'],
    chatMessage: 'Decision gate set to auto-advance for Tier-1. One-click pass/fail in copilot.',
    sources: ['Gate Logic Rules', 'Escalation Policy'],
  },
  {
    name: 'Configure Offer Letter (LOI)',
    status: 'complete' as const,
    summary: ['Hero: "Sign Your Offer Letter"', 'E-signature captures LOI + BGC consent', 'Pay: PHP 18,000/mo (entry)', 'Post-signature: unlocks NID, BGC, Badge'],
    chatMessage: 'Offer letter configured. E-signature captures both LOI and BGC consent in one flow. Post-signature unlocks parallel tasks.',
    sources: ['LOI Template', 'Pay Construct', 'E-Signature Config'],
  },
  {
    name: 'Configure Parallel Pre-Start Tasks',
    status: 'complete' as const,
    summary: ['Task 1: NID Submission (document upload)', 'Task 2: BGC Consent (e-signature)', 'Task 3: Badge Photo (camera/upload + IVV)', 'All 3 must complete before Medical'],
    chatMessage: '3 parallel pre-start tasks configured. Candidate chooses completion order. All gate Medical Check.',
    sources: ['NID Requirements', 'BGC Consent Form', 'IVV Photo Spec'],
  },
  {
    name: 'Configure Medical Check',
    status: 'complete' as const,
    summary: ['Mode: Manual (30-day launch)', 'Clinic: MedFirst — BGC Taguig', 'Days: Mon/Wed/Fri 9AM-12PM', 'Gating: mandatory before Day 1'],
    chatMessage: 'Medical check set to manual mode. MedFirst clinic configured for Mon/Wed/Fri mornings.',
    sources: ['Clinic Directory', 'Medical Policy', 'Scheduling Rules'],
  },
  {
    name: 'Configure Day 1 Readiness',
    status: 'complete' as const,
    summary: ['Start: Jun 23, 2026 | Report: 5:30 AM', 'Location: Manila-BGC, Building 2, Floor 3', 'Pre-loaded Day 1 FAQ (5 questions)', 'Day-before reminder (email)'],
    chatMessage: 'Day 1 readiness page configured with start details, location, and FAQ chatbot.',
    sources: ['Site Map', 'Day 1 Checklist', 'FAQ Database'],
  },
  {
    name: 'Generate Workflow Preview',
    status: 'active' as const,
    summary: ['8 candidate-facing stages', '3 parallel tasks (NID, BGC, Badge)', 'Est. completion: 5-10 days', '9 email notifications'],
    chatMessage: 'Your workflow is ready! 8 stages, 3 parallel tasks, auto-advance for Tier-1. 35 openings × 34 slots = ready for volume.',
    sources: [],
  },
];

// --- Styled Components ---

const EditorGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: '200px 1fr 320px',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
});

const StepSidebar = styled('aside')({
  borderRight: `1px solid ${token('color.border.primary')}`,
  background: token('color.surface.bg-raised'),
  padding: token('dimensions.spacing.300'),
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: token('dimensions.spacing.100'),
});

const StepItem = styled('button')<{ isActive?: boolean }>(({ isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: token('dimensions.spacing.200'),
  width: '100%',
  padding: `${token('dimensions.spacing.200')} ${token('dimensions.spacing.200')}`,
  border: 'none',
  borderRadius: token('dimensions.border.radius.100'),
  background: isActive ? token('color.surface.bg-muted') : 'transparent',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: 13,
  color: token('color.neutral.90'),
  textAlign: 'left' as const,
  '&:hover': {
    backgroundColor: token('color.surface.bg-muted'),
  },
}));

const StepCircle = styled('span')<{ status?: 'complete' | 'active' | 'pending' }>(({ status }) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  border: `2px solid ${
    status === 'complete'
      ? token('color.green.60')
      : status === 'active'
      ? token('color.action.primary.bg-default')
      : token('color.neutral.30')
  }`,
  backgroundColor:
    status === 'complete'
      ? token('color.green.60')
      : status === 'active'
      ? token('color.action.primary.bg-default')
      : 'transparent',
  flexShrink: 0,
}));

const Canvas = styled('div')({
  flex: 1,
  overflowY: 'auto',
  padding: token('dimensions.spacing.400'),
  display: 'flex',
  flexDirection: 'column',
  gap: token('dimensions.spacing.300'),
});

const WorkflowStepCard = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: token('dimensions.spacing.250'),
  padding: `${token('dimensions.spacing.250')} ${token('dimensions.spacing.300')}`,
  border: `1px solid ${token('color.border.primary')}`,
  borderRadius: token('dimensions.border.radius.200'),
  backgroundColor: token('color.surface.bg-default'),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: token('color.surface.bg-muted'),
  },
});

const InputStepCard = styled('div')({
  padding: token('dimensions.spacing.400'),
  border: `2px dashed ${token('color.border.primary')}`,
  borderRadius: token('dimensions.border.radius.200'),
  backgroundColor: token('color.surface.bg-default'),
  display: 'flex',
  flexDirection: 'column',
  gap: token('dimensions.spacing.300'),
});

const CompletedStepCard = styled('div')({
  border: `1px solid ${token('color.border.primary')}`,
  borderLeft: `3px solid ${token('color.action.primary.bg-default')}`,
  borderRadius: token('dimensions.border.radius.200'),
  backgroundColor: token('color.surface.bg-default'),
  display: 'flex',
  flexDirection: 'column',
});

const CardHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${token('dimensions.spacing.200')} ${token('dimensions.spacing.300')}`,
  backgroundColor: token('color.surface.bg-muted'),
  borderBottom: `1px solid ${token('color.border.primary')}`,
});

const CardContentArea = styled('div')({
  padding: `${token('dimensions.spacing.300')} ${token('dimensions.spacing.400')}`,
});

const EditableField = styled('span')({
  cursor: 'text',
  borderRadius: 4,
  padding: '2px 4px',
  display: 'block',
  fontSize: 14,
  lineHeight: 1.5,
  color: token('color.neutral.90'),
  '&:hover': {
    outline: `1px dashed ${token('color.border.primary')}`,
    backgroundColor: token('color.surface.bg-muted'),
  },
  '&:focus': {
    outline: `2px solid ${token('color.action.primary.bg-default')}`,
    outlineOffset: 2,
  },
});

const CardFooter = styled('div')({
  display: 'flex',
  alignItems: 'center',
  padding: `${token('dimensions.spacing.200')} ${token('dimensions.spacing.300')}`,
  backgroundColor: token('color.surface.bg-muted'),
  borderTop: `1px solid ${token('color.border.primary')}`,
});

const SourcesSection = styled('div')({
  padding: `${token('dimensions.spacing.300')} ${token('dimensions.spacing.400')}`,
  borderTop: `1px solid ${token('color.border.primary')}`,
  display: 'flex',
  flexDirection: 'column',
  gap: token('dimensions.spacing.200'),
});

const SourcePill = styled('div')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: token('dimensions.spacing.200'),
  padding: token('dimensions.spacing.200'),
  backgroundColor: token('color.surface.bg-muted'),
  borderRadius: token('dimensions.border.radius.200'),
  fontSize: 14,
  fontWeight: 500,
  color: token('color.neutral.90'),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: token('color.neutral.10'),
  },
});

const ActiveStepCard = styled('div')({
  padding: `${token('dimensions.spacing.300')} ${token('dimensions.spacing.300')}`,
  border: `2px solid ${token('color.action.primary.bg-default')}`,
  borderRadius: token('dimensions.border.radius.200'),
  backgroundColor: token('color.surface.bg-default'),
  display: 'flex',
  flexDirection: 'column',
  gap: token('dimensions.spacing.200'),
});

const LoadingDots = styled('span')({
  display: 'inline-flex',
  gap: 4,
  alignItems: 'center',
  '& span': {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: token('color.action.primary.bg-default'),
    animation: 'pulse 1.4s infinite ease-in-out both',
  },
  '& span:nth-of-type(1)': { animationDelay: '-0.32s' },
  '& span:nth-of-type(2)': { animationDelay: '-0.16s' },
  '& span:nth-of-type(3)': { animationDelay: '0s' },
  '@keyframes pulse': {
    '0%, 80%, 100%': { transform: 'scale(0)', opacity: 0.5 },
    '40%': { transform: 'scale(1)', opacity: 1 },
  },
});

const ChatSidebar = styled('aside')({
  borderLeft: `1px solid ${token('color.border.primary')}`,
  background: token('color.surface.bg-raised'),
  padding: token('dimensions.spacing.400'),
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: token('dimensions.spacing.300'),
  height: '100%',
});

const GradientHeading = styled('h2')({
  fontSize: 20,
  fontWeight: 700,
  textAlign: 'center',
  background: `linear-gradient(133deg, ${token('color.purple.70')} 7%, ${token('color.blue.60')} 133%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  margin: 0,
});

const ChatScrollArea = styled('div')({
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: token('dimensions.spacing.250'),
});

const MessageBubble = styled('div')({
  backgroundColor: token('color.surface.bg-muted'),
  borderRadius: token('dimensions.border.radius.200'),
  padding: `${token('dimensions.spacing.200')} ${token('dimensions.spacing.250')}`,
});

const SendButton = styled('button')({
  width: 32,
  height: 32,
  borderRadius: '50%',
  border: 'none',
  background: `linear-gradient(133deg, ${token('color.purple.70')} 7%, ${token('color.blue.60')} 133%)`,
  color: token('color.neutral.00'),
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

// --- Component ---

interface WorkflowEditorPageProps {
  flowName: string;
  onBack: () => void;
}

export const WorkflowEditorPage = ({ flowName, onBack }: WorkflowEditorPageProps) => {
  const [activeStep, setActiveStep] = useState(
    stepData.findIndex((s) => s.status === 'active')
  );
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());

  return (
    <Col flex={1} backgroundColor="color.surface.bg-default" style={{ height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <View padding={['dimensions.spacing.300', 'dimensions.spacing.400']} borderBottom={`1px solid ${token('color.border.primary')}`} backgroundColor="color.surface.bg-raised">
        <Row alignItems="center" justifyContent="space-between">
          <Col gridGap="dimensions.spacing.200">
            <Breadcrumbs
              aria-label="Workflow navigation"
              crumbs={[
                { title: 'Flows', url: '#' },
                { title: flowName },
              ]}
              onCrumbClick={(e) => {
                e.preventDefault();
                onBack();
              }}
            />
            <Row alignItems="center" gridGap="dimensions.spacing.200">
              <H1 style={{ fontSize: 20 }}>{flowName}</H1>
              <Chip size={ChipSize.ExtraSmall} backgroundColor="color.orange.10">Draft</Chip>
            </Row>
          </Col>
          <Row gridGap="dimensions.spacing.200" alignItems="center">
            <Button variant={ButtonVariant.Tertiary}>Editor</Button>
            <Button variant={ButtonVariant.Tertiary}>Run mode</Button>
            <Button variant={ButtonVariant.Secondary}>Share</Button>
            <Button variant={ButtonVariant.Primary}>Publish</Button>
          </Row>
        </Row>
      </View>

      {/* Body */}
      <EditorGrid>
        {/* Left: Step list */}
        <StepSidebar>
          {stepData.map((step, i) => (
            <StepItem key={i} isActive={activeStep === i} onClick={() => setActiveStep(i)}>
              <StepCircle status={step.status} />
              <Text fontSize="T100" color={activeStep === i ? 'color.neutral.90' : 'color.neutral.70'}>
                {step.name}
              </Text>
            </StepItem>
          ))}
        </StepSidebar>

        {/* Center: Canvas */}
        <Canvas>
          <Text fontSize="T200" color="color.neutral.70">
            Automatically configure a post-application candidate workflow for Philippines CS Associate roles at Manila-BGC, including scheduling, document collection, parallel pre-start tasks, and Day 1 preparation.
          </Text>

          {stepData.map((step, i) => {
            // First step: InputStepCard
            if (i === 0) {
              return (
                <InputStepCard key={i}>
                  <Row alignItems="center" gridGap="dimensions.spacing.200">
                    <AIIconWrapper fill="color.gradient.action.default">
                      <IconSparklesMedium aria-hidden="true" style={{ width: 16, height: 16 }} />
                    </AIIconWrapper>
                    <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">Define Workflow Scope</Text>
                    {step.status === 'complete' && (
                      <Text fontSize="T100" color="color.green.60" style={{ marginLeft: 'auto' }}>✓ Complete</Text>
                    )}
                  </Row>
                  <InputWrapper id="job-code" labelText="Job Code">
                    {(inputProps) => <Input {...inputProps} value="PH-CS-ASSOC-MNL-BGC-2026 (CS Associate, Manila-BGC)" />}
                  </InputWrapper>
                  <InputWrapper id="target-country" labelText="Target Country">
                    {(inputProps) => <Input {...inputProps} value="Philippines" />}
                  </InputWrapper>
                  <InputWrapper id="workflow-type" labelText="Workflow Type">
                    {(inputProps) => <Input {...inputProps} value="Post-Application (Candidate-Facing)" />}
                  </InputWrapper>
                  <Row justifyContent="flex-end">
                    <Button variant={ButtonVariant.Tertiary}>Start</Button>
                  </Row>
                </InputStepCard>
              );
            }

            // Completed steps: card with header, editable content, footer
            if (step.status === 'complete') {
              const isExpanded = expandedSteps.has(i);
              return (
                <CompletedStepCard key={i}>
                  <CardHeader>
                    <Row alignItems="center" gridGap="dimensions.spacing.200">
                      <IconSparklesSmall aria-hidden="true" color={token('color.action.primary.bg-default')} />
                      <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">{step.name}</Text>
                    </Row>
                    <IconCheckCircleFillSmall aria-hidden="true" color={token('color.green.60')} />
                  </CardHeader>
                  <CardContentArea>
                    <Col gridGap="dimensions.spacing.100">
                      {step.summary.map((line, j) => (
                        <EditableField
                          key={j}
                          contentEditable
                          suppressContentEditableWarning
                          role="textbox"
                          aria-label={`Edit: ${line}`}
                        >
                          {line}
                        </EditableField>
                      ))}
                    </Col>
                  </CardContentArea>
                  {isExpanded && step.sources.length > 0 && (
                    <SourcesSection>
                      <Row alignItems="center" justifyContent="space-between">
                        <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">Sources</Text>
                        <Button variant={ButtonVariant.Tertiary}>Add source</Button>
                      </Row>
                      <Row gridGap="dimensions.spacing.200" flexWrap="wrap">
                        {step.sources.map((source, j) => (
                          <SourcePill key={j}>
                            <IconSparklesSmall aria-hidden="true" style={{ width: 16, height: 16 }} color={token('color.action.primary.bg-default')} />
                            {source}
                          </SourcePill>
                        ))}
                      </Row>
                    </SourcesSection>
                  )}
                  <CardFooter>
                    <Button
                      variant={ButtonVariant.Tertiary}
                      onClick={() => {
                        setExpandedSteps((prev) => {
                          const next = new Set(prev);
                          if (next.has(i)) next.delete(i);
                          else next.add(i);
                          return next;
                        });
                      }}
                    >
                      {isExpanded ? 'Collapse' : 'Edit step'}
                    </Button>
                  </CardFooter>
                </CompletedStepCard>
              );
            }

            // Active step: loading indicator
            if (step.status === 'active') {
              return (
                <ActiveStepCard key={i}>
                  <Row alignItems="center" gridGap="dimensions.spacing.200">
                    <AIIconWrapper fill="color.gradient.action.default">
                      <IconSparklesMedium aria-hidden="true" style={{ width: 16, height: 16 }} />
                    </AIIconWrapper>
                    <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">{step.name}</Text>
                    <LoadingDots>
                      <span />
                      <span />
                      <span />
                    </LoadingDots>
                  </Row>
                  <Col gridGap="dimensions.spacing.100" style={{ paddingLeft: token('dimensions.spacing.400') }}>
                    {step.summary.map((line, j) => (
                      <Text key={j} fontSize="T100" color="color.neutral.70">• {line}</Text>
                    ))}
                  </Col>
                  <Text fontSize="T100" color="color.action.primary.bg-default" style={{ paddingLeft: token('dimensions.spacing.400') }}>
                    Generating preview...
                  </Text>
                </ActiveStepCard>
              );
            }

            // Pending steps: WorkflowStepCard
            return (
              <WorkflowStepCard key={i} onClick={() => setActiveStep(i)}>
                <AIIconWrapper fill="color.gradient.action.default">
                  <IconSparklesMedium aria-hidden="true" style={{ width: 16, height: 16 }} />
                </AIIconWrapper>
                <Text fontSize="T200" fontWeight="medium" color="color.neutral.90">{step.name}</Text>
              </WorkflowStepCard>
            );
          })}
        </Canvas>

        {/* Right: Chat panel */}
        <ChatSidebar>
          <GradientHeading>PH CS Manila — Post-Application Workflow</GradientHeading>

          <ChatScrollArea>
            {stepData
              .filter((step) => step.status === 'complete')
              .map((step, i) => (
                <MessageBubble key={i}>
                  <Text fontSize="T100" fontWeight="bold" color="color.neutral.60" style={{ marginBottom: token('dimensions.spacing.100'), display: 'block' }}>
                    Pere Workflow Builder
                  </Text>
                  <Text fontSize="T100" color="color.neutral.90">
                    {step.chatMessage}
                  </Text>
                </MessageBubble>
              ))}

            {/* Active step processing status */}
            {stepData.find((s) => s.status === 'active') && (
              <MessageBubble>
                <Text fontSize="T100" fontWeight="bold" color="color.neutral.60" style={{ marginBottom: token('dimensions.spacing.100'), display: 'block' }}>
                  Pere Workflow Builder
                </Text>
                <Row alignItems="center" gridGap="dimensions.spacing.100">
                  <LoadingDots>
                    <span />
                    <span />
                    <span />
                  </LoadingDots>
                  <Text fontSize="T100" color="color.neutral.70">
                    {stepData.find((s) => s.status === 'active')?.name}...
                  </Text>
                </Row>
              </MessageBubble>
            )}
          </ChatScrollArea>

          <View style={{ marginTop: 'auto' }}>
            <Col gridGap="dimensions.spacing.200">
              <Row alignItems="center" justifyContent="space-between">
                <Row alignItems="center" gridGap="dimensions.spacing.100">
                  <Text fontSize="T100" fontWeight="bold" color="color.neutral.90">{flowName}</Text>
                  <IconChevronRightSmall aria-hidden="true" style={{ width: 12, height: 12, transform: 'rotate(90deg)' }} />
                </Row>
                <Text fontSize="T100" fontWeight="bold" color="color.action.primary.bg-default">New run</Text>
              </Row>
              <Row gridGap="dimensions.spacing.200" alignItems="center">
                <View flex={1}>
                  <InputWrapper id="chat-input" labelText="">
                    {(inputProps) => <Input {...inputProps} placeholder={`Chat with ${flowName}`} />}
                  </InputWrapper>
                </View>
                <SendButton aria-label="Send">
                  <IconChevronRightSmall aria-hidden="true" style={{ width: 16, height: 16, color: 'white' }} />
                </SendButton>
              </Row>
            </Col>
          </View>
        </ChatSidebar>
      </EditorGrid>
    </Col>
  );
};
