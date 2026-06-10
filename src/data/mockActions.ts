import { ActionItem } from '../components/ActionCard';

export const dueSoonActions: ActionItem[] = [
  {
    id: '1',
    title: 'Review candidate screening for SDE II role',
    agent: 'Screening Agent',
    priority: 'high',
    dueLabel: 'Due today',
  },
  {
    id: '2',
    title: 'Confirm interview schedule for 3 candidates',
    agent: 'Scheduling Agent',
    priority: 'high',
    dueLabel: 'Due today',
  },
  {
    id: '3',
    title: 'Approve sourcing shortlist for PM role',
    agent: 'Sourcing Agent',
    priority: 'medium',
    dueLabel: 'Due tomorrow',
  },
  {
    id: '4',
    title: 'Send follow-up to hiring manager',
    agent: 'Follow-up Agent',
    priority: 'medium',
    dueLabel: 'Due tomorrow',
  },
  {
    id: '5',
    title: 'Review offer letter draft',
    agent: 'Screening Agent',
    priority: 'low',
    dueLabel: 'Due in 2 days',
  },
  {
    id: '6',
    title: 'Validate candidate references',
    agent: 'Screening Agent',
    priority: 'low',
    dueLabel: 'Due in 3 days',
  },
];
