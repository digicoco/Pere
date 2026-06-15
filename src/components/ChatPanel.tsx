import { useState, useEffect } from 'react';
import { Col, Row, View } from '@amzn/stencil-react-components/layout';
import { Text } from '@amzn/stencil-react-components/text';
import { Input, InputWrapper } from '@amzn/stencil-react-components/input';
import { AIIconWrapper } from '@amzn/stencil-react-components/ai';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import styled from '@emotion/styled';
import IconSparklesMedium from '@amzn/stencil-react-icons/icons/icon-sparkles-medium';
import IconChevronRightSmall from '@amzn/stencil-react-icons/icons/icon-chevron-right-small';

const Panel = styled('aside')<{ isOpen: boolean }>(({ isOpen }) => ({
  width: isOpen ? 400 : 0,
  minWidth: isOpen ? 400 : 0,
  height: '100%',
  maxHeight: '100%',
  backgroundColor: token('color.surface.bg-raised'),
  borderLeft: isOpen ? `1px solid ${token('color.border.primary')}` : 'none',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  transition: 'width 0.2s ease, min-width 0.2s ease',
  flexShrink: 0,
}));

const MessageBubble = styled('div')({
  maxWidth: '88%',
  padding: `${token('dimensions.spacing.250')} ${token('dimensions.spacing.300')}`,
  borderRadius: `${token('dimensions.border.radius.100')} ${token('dimensions.border.radius.300')} ${token('dimensions.border.radius.300')} ${token('dimensions.border.radius.300')}`,
  backgroundColor: token('color.surface.bg-muted'),
  fontSize: 16,
  lineHeight: 1.5,
  color: token('color.neutral.90'),
});

const SuggestionPill = styled('button')({
  background: token('color.surface.bg-muted'),
  border: `1px solid ${token('color.border.primary')}`,
  borderRadius: 100,
  padding: '6px 12px',
  fontSize: 11,
  fontWeight: 500,
  color: token('color.neutral.90'),
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'inherit',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: token('color.action.utility.bg-hover'),
  },
});

const SendButton = styled('button')<{ disabled?: boolean }>(({ disabled }) => ({
  background: disabled ? token('color.neutral.15') : `linear-gradient(133deg, ${token('color.purple.70')} 7%, ${token('color.blue.60')} 133%)`,
  color: token('color.neutral.00'),
  border: 'none',
  borderRadius: '50%',
  width: 40,
  height: 40,
  cursor: disabled ? 'not-allowed' : 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

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

const defaultSuggestions = [
  'Show me applicants idle 5+ days in BGC',
  'Draft a reminder for everyone with a PHA tomorrow',
  'Find candidates to fill the BFI4 back-half shift',
  'Reject anyone who hasn\'t responded in 14 days',
  'Why is drop-off so high in step 4?',
];

const taskSuggestionMap: Record<string, { suggestions: string[]; actions: string[]; response: string }> = {
  'documents awaiting review': {
    suggestions: ['Show me all gating documents', 'Auto-approve low-risk documents', 'Escalate expired documents'],
    actions: ['Approve all low-risk documents (11)', 'Flag 4 gating docs for immediate review', 'Send reminder to candidates with missing uploads'],
    response: 'I found 15 documents awaiting review. 4 are currently gating candidate progress — these are blocking next-step transitions. I can batch-approve the 11 low-risk items and flag the 4 critical ones for your manual review.',
  },
  'rehire eligibility': {
    suggestions: ['Show duplicate candidate profiles', 'List candidates by wait time', 'Check rehire policy exceptions'],
    actions: ['Approve 5 clear rehire cases', 'Merge 3 potential duplicate profiles', 'Escalate 2 policy-exception candidates to manager'],
    response: 'I found 8 applications awaiting manual rehire eligibility approval. 3 may be duplicate profiles for the same candidate. The longest wait is 2 days. I recommend approving the 5 straightforward cases and flagging the 3 potential duplicates for deduplication.',
  },
  'missing medical check': {
    suggestions: ['Which candidates have appointments 3+ days ago?', 'Contact clinics for results', 'Reschedule expired checks'],
    actions: ['Send follow-up to 5 clinics with overdue results', 'Reschedule 4 candidates blocking Day 1', 'Mark 2 candidates as no-show'],
    response: 'There are 9 applications missing medical check records. 5 had appointments 3+ days ago with no results returned from the clinic. 4 are actively blocking Day 1 start dates. I recommend sending automated follow-ups to clinics and rescheduling the blocking candidates.',
  },
  'badge photos awaiting approval': {
    suggestions: ['Show low-confidence photos', 'What are the rejection criteria?', 'View photo quality breakdown'],
    actions: ['Approve 7 high-confidence photos', 'Reject 2 non-compliant photos with reason', 'Request retake for 3 borderline cases'],
    response: 'I found 12 badge photos awaiting approval. 5 have low-confidence scores from automated screening. The oldest has been waiting 3h 42m. I can batch-approve the 7 high-confidence photos and present the 5 low-confidence ones for your individual review.',
  },
  'pre-hire appointments today': {
    suggestions: ['Which candidates are missing documents?', 'Show next 3 appointments', 'List no-shows from yesterday'],
    actions: ['Send document reminder to 2 unprepared candidates', 'Confirm next 5 appointments via SMS', 'Mark 3 past appointments as completed'],
    response: 'There are 23 pre-hire appointments today. The next one starts in 22 minutes. 2 candidates are missing required documents for their appointment. I recommend sending them an immediate reminder with upload links and confirming the next batch.',
  },
  'past appointments need status': {
    suggestions: ['Show all overdue status updates', 'Which are blocking reschedules?', 'Auto-close completed appointments'],
    actions: ['Mark 4 today\'s appointments as completed', 'Close 3 yesterday\'s as no-show', 'Trigger reschedule for blocked candidates'],
    response: 'I found 7 past appointments that need a status update. 3 are from yesterday and 4 from today. These are blocking the reschedule flow for candidates who need new appointments. I can mark the confirmed completions and flag the rest for your decision.',
  },
  'venues missing appointment slots': {
    suggestions: ['Show slot availability by venue', 'Which venues are at capacity?', 'Forecast demand for next week'],
    actions: ['Open 12 new slots for Manila-BGC tomorrow', 'Extend Cebu-IT capacity Thu-Fri', 'Alert site managers about shortage'],
    response: 'Manila-BGC has 0 appointment slots available for tomorrow and Cebu-IT has only 3 remaining for Thursday-Friday. Based on current demand, I recommend opening at least 12 slots for Manila-BGC and extending Cebu-IT by 8 slots.',
  },
  'medical follow-up': {
    suggestions: ['Which clinics are non-responsive?', 'Show candidates by urgency', 'Check clinic SLA compliance'],
    actions: ['Send follow-up email to 4 clinics', 'Escalate 2 urgent cases to clinic liaison', 'Reschedule 3 candidates to alternative clinics'],
    response: 'There are 6 candidates needing medical follow-up. 4 clinics haven\'t returned results and 4 candidates are blocking Day 1. Appointments were 3+ days ago. I recommend automated follow-ups to clinics with escalation for the 2 most urgent cases.',
  },
  'MNL1 Regular Full-Time projected to miss headcount': {
    suggestions: ['Show current fill rate breakdown', 'Which sources are underperforming?', 'Compare with last quarter projections'],
    actions: ['Increase sourcing for MNL1 Full-Time by 20%', 'Activate backup candidate pool (34 warm leads)', 'Schedule additional hiring event for Jun 1-2'],
    response: 'MNL1 Regular Full-Time is at 0/180 filled with a Jun 4 start date — projected to miss headcount by 14%. At current conversion rates, you\'ll need 40+ additional applicants in pipeline this week. I recommend activating the backup pool and scheduling an urgent hiring event.',
  },
  'labor orders in Error status': {
    suggestions: ['What caused the errors?', 'Show error details by LO', 'List impacted candidates'],
    actions: ['Resubmit LO-PH-0000213 with corrected data', 'Escalate LO-PH-0000228 to system admin', 'Retry all 4 with updated configurations'],
    response: 'I found 4 labor orders in Error status: LO-PH-0000213, LO-PH-0000228, and 2 others. Common causes are data validation failures and system timeout. I can attempt automated resubmission for 2 that appear to be transient errors, and escalate the other 2 that need configuration fixes.',
  },
  'no-shows from yesterday need follow-up': {
    suggestions: ['Show Connect session data for each', 'What is the no-show reschedule policy?', 'Check if any responded to reminders'],
    actions: ['Send reschedule link to Felix Walsh, Anya Petrov, Tariq Aziz', 'Mark all 3 as no-show in system', 'Open 3 replacement slots for tomorrow'],
    response: 'I found 3 no-shows from yesterday that are blocking the reschedule flow. None responded to the automated 2h reminder. Connect session data shows 0 seconds for all three — they never joined. I recommend marking them as no-show and sending reschedule links with a 48h expiry window.',
  },
  'expired scheduling windows': {
    suggestions: ['Which candidates are affected?', 'Can we extend the window?', 'Show alternative available slots'],
    actions: ['Extend scheduling window by 72h for both candidates', 'Send re-booking notification with new slot options', 'Flag to site coordinator for manual outreach'],
    response: 'Two candidates have expired scheduling windows at Manila-BGC — their original slots expired 48h ago and they cannot self-rebook. The system blocks re-entry after expiry. I recommend extending their window by 72h and sending an SMS with direct booking links to available slots.',
  },
  'medical appointments not yet booked': {
    suggestions: ['Which clinics have availability?', 'Are these blocking Day 1?', 'Show candidate contact details'],
    actions: ['Auto-book 2 candidates at MedFirst (next available Jun 14)', 'Send booking reminder to remaining 2 candidates', 'Escalate to clinic liaison for priority slots'],
    response: 'Four candidates have no medical appointment booked and all are blocking Day 1 readiness. Clinic availability is dropping — next open at MedFirst is Jun 14. I recommend auto-booking the 2 most urgent candidates and sending reminders with self-schedule links to the other 2.',
  },
};

function getContextForMessage(msg: string): { suggestions: string[]; actions: string[]; response: string } | null {
  const lowerMsg = msg.toLowerCase();
  for (const [key, value] of Object.entries(taskSuggestionMap)) {
    if (lowerMsg.includes(key.toLowerCase())) {
      return value;
    }
  }
  return null;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  onTaskComplete?: (taskTitle: string) => void;
}

export const ChatPanel = ({ isOpen, onClose, initialMessage, onTaskComplete }: ChatPanelProps) => {
  const [message, setMessage] = useState('');
  const [actionsTaken, setActionsTaken] = useState<Set<number>>(new Set());
  const [taskCompleted, setTaskCompleted] = useState(false);

  const context = initialMessage ? getContextForMessage(initialMessage) : null;
  const activeSuggestions = context ? context.suggestions : defaultSuggestions;

  // Reset actions taken when initial message changes
  useEffect(() => {
    setActionsTaken(new Set());
    setTaskCompleted(false);
  }, [initialMessage]);

  // Mark task as completed when all actions are done
  useEffect(() => {
    if (context && context.actions.length > 0 && actionsTaken.size === context.actions.length && !taskCompleted) {
      setTaskCompleted(true);
    }
  }, [actionsTaken, context, taskCompleted]);

  const handleAction = (index: number) => {
    setActionsTaken(prev => new Set(prev).add(index));
  };

  return (
    <Panel isOpen={isOpen} role="complementary" aria-label="Pere Copilot">
      <Row
        padding="dimensions.spacing.300"
        borderBottom={`1px solid ${token('color.border.primary')}`}
        alignItems="center"
        justifyContent="space-between"
        gridGap="dimensions.spacing.300"
      >
        <Row alignItems="center" gridGap="dimensions.spacing.200">
          <AIIconWrapper fill="color.gradient.action.default">
            <IconSparklesMedium aria-hidden="true" />
          </AIIconWrapper>
          <Col>
            <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
              Pere Copilot
            </Text>
            <Text variant="label-xs" color="color.neutral.60">
              Proposes · Recruiter approves · Always logged
            </Text>
          </Col>
        </Row>
        <button
          onClick={onClose}
          aria-label="Close Copilot"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: token('dimensions.spacing.200'), borderRadius: 100, color: token('color.neutral.70') }}
        >
          <IconChevronRightSmall aria-hidden="true" />
        </button>
      </Row>

      <Col flex={1} padding="dimensions.spacing.400" gridGap="dimensions.spacing.300" style={{ overflowY: 'auto' }}>
        <MessageBubble>
          Hi — I'm your Pere copilot. I can answer questions about your funnel, draft messages to candidates, or propose workflow changes. I won't take action on your behalf without you approving each step.
        </MessageBubble>
        {initialMessage && (
          <>
            <Row justifyContent="flex-end">
              <View
                backgroundColor="color.action.primary.bg-default"
                padding={['dimensions.spacing.200', 'dimensions.spacing.300']}
                borderRadius="dimensions.border.radius.300"
                maxWidth="88%"
              >
                <Text fontSize="T200" color="color.neutral.00">
                  Review: {initialMessage}
                </Text>
              </View>
            </Row>
            <MessageBubble>
              {context ? context.response : 'I\'ve pulled up the details for this task. Here\'s what I found and my recommended actions. Would you like me to proceed with the suggested resolution, or would you prefer to review each item individually?'}
            </MessageBubble>
            {context && context.actions.length > 0 && (
              <Col gridGap="dimensions.spacing.200">
                <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Suggested actions
                </Text>
                {context.actions.map((action, i) => (
                  <ActionButton
                    key={i}
                    onClick={() => handleAction(i)}
                    style={actionsTaken.has(i) ? {
                      backgroundColor: token('color.green.10'),
                      borderColor: token('color.green.60'),
                      color: token('color.green.70'),
                    } : undefined}
                  >
                    {actionsTaken.has(i) ? `Done: ${action}` : action}
                  </ActionButton>
                ))}
                {taskCompleted && (
                  <ActionButton
                    onClick={() => onTaskComplete?.(initialMessage!)}
                    style={{
                      borderColor: token('color.action.primary.bg-default'),
                      color: token('color.action.primary.bg-default'),
                      fontWeight: 600,
                    }}
                  >
                    Load next task
                  </ActionButton>
                )}
              </Col>
            )}
          </>
        )}
      </Col>

      <Col
        padding="dimensions.spacing.300"
        borderTop={`1px solid ${token('color.border.primary')}`}
        gridGap="dimensions.spacing.300"
      >
        <Col gridGap="dimensions.spacing.200">
          <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {context ? 'Related questions' : 'Commonly asked'}
          </Text>
          <Row gridGap="dimensions.spacing.200" flexWrap="wrap">
            {activeSuggestions.map((s, i) => (
              <SuggestionPill key={i} onClick={() => setMessage(s)}>
                {s}
              </SuggestionPill>
            ))}
          </Row>
        </Col>
        <Row gridGap="dimensions.spacing.200" alignItems="flex-end">
          <View flex={1}>
            <InputWrapper id="copilot-chat-input" labelText="">
              {(inputProps) => (
                <Input
                  {...inputProps}
                  placeholder="Ask anything..."
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                />
              )}
            </InputWrapper>
          </View>
          <SendButton disabled={!message.trim()} aria-label="Send">
            <IconChevronRightSmall aria-hidden="true" color="white" />
          </SendButton>
        </Row>
        <Text variant="label-xs" color="color.neutral.60" textAlign="center">
          Pere Copilot proposes actions — you approve every consequential change.
        </Text>
      </Col>
    </Panel>
  );
};
