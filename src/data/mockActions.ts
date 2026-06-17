import { ActionItem } from '../components/ActionCard';

// Site Recruiter sees: Tasks 1, 2, 3, 4, 5, 6, 7, 8, 13
// Persona: Ana Santos (Site Recruiter, Manila-BGC)
// All 15 script tasks accounted for — Site Recruiter gets 14 cards
// (Tasks 9, 10, 11, 12, 14, 15 are other-persona tasks not shown here)

export const dueSoonActions: ActionItem[] = [
  // ── Task 1: Badge Photos ──────────────────────────────────────────────────
  {
    id: 'task-1',
    title: '12 Badge Photos Waiting Review',
    subtitle: 'Oldest: 3h 42m ago · 5 low-confidence scores',
    secondaryText: 'SLA: 12hr · Batch approve available',
    status: 'critical',
    iconType: 'approval',
    hasExternalLink: true,
  },
  // ── Task 2: Rehire Eligibility ────────────────────────────────────────────
  {
    id: 'task-2',
    title: '8 Applications Awaiting Rehire Eligibility',
    subtitle: '3 potential duplicates · Longest wait: 2 days',
    secondaryText: 'Auto-approve if cooling period met',
    status: 'critical',
    iconType: 'approval',
    hasExternalLink: true,
  },
  // ── Task 3: Document Review ───────────────────────────────────────────────
  {
    id: 'task-3',
    title: '15 Documents Awaiting Review',
    subtitle: '4 gating candidate progress · EDM queue',
    secondaryText: 'Batch: Accept All Verified (95%+ OCR)',
    status: 'critical',
    iconType: 'review',
    hasExternalLink: true,
  },
  // ── Task 4: Pre-Hire Appointments Today ───────────────────────────────────
  {
    id: 'task-4',
    title: '12 Pre-Hire Appointments Today',
    subtitle: 'Next: 10:30 AM (4 candidates) · In 22m',
    secondaryText: '4 complete · 8 remaining · 1 no-show',
    status: 'warning',
    iconType: 'task',
    hasExternalLink: false,
  },
  // ── Task 5: Past Appointments ─────────────────────────────────────────────
  {
    id: 'task-5',
    title: '7 Past Appointments Need Status',
    subtitle: '3 from yesterday, 4 from earlier today',
    secondaryText: 'Blocking reschedule for 4 candidates',
    status: 'warning',
    iconType: 'response',
    hasExternalLink: true,
  },
  // ── Task 6: Venue Slots ───────────────────────────────────────────────────
  {
    id: 'task-6',
    title: '2 Venues Missing Appointment Slots',
    subtitle: 'Manila-BGC: 0 slots for tomorrow',
    secondaryText: 'Cebu-IT: 3 remaining · 12 waiting',
    status: 'warning',
    iconType: 'task',
    hasExternalLink: false,
  },
  // ── Task 7: Medical Records ───────────────────────────────────────────────
  {
    id: 'task-7',
    title: '9 Applications Missing Medical Records',
    subtitle: '5 appointments 3+ days ago · MedFirst',
    secondaryText: '4 blocking Day 1 (Jun 23 cohort)',
    status: 'critical',
    iconType: 'response',
    hasExternalLink: true,
  },
  // ── Task 8: Cohort Readiness ──────────────────────────────────────────────
  {
    id: 'task-8',
    title: 'Jun 23 Cohort: 22/35 Ready (63%)',
    subtitle: '7 days to start · 4 at risk',
    secondaryText: 'Forecast: 24-28 ready by Day 1',
    status: 'warning',
    iconType: 'task',
    hasExternalLink: false,
  },
  // ── Task 13: Alert — Offers Expiring ──────────────────────────────────────
  {
    id: 'alert-offers',
    title: '3 Offers Expiring in 24 Hours',
    subtitle: 'Ana Reyes, Ramon Torres, Carla Mendoza',
    secondaryText: 'No response · Jun 23 cohort impact',
    status: 'warning',
    iconType: 'response',
    hasExternalLink: true,
  },
  // ── Task 13: Alert — Pipeline Stall ───────────────────────────────────────
  {
    id: 'alert-stall',
    title: '5 Candidates Stuck in Pipeline >48hr',
    subtitle: 'Pending Decision state · No recruiter action',
    secondaryText: 'Oldest: 3 days · All Jun 23 cohort',
    status: 'warning',
    iconType: 'response',
    hasExternalLink: true,
  },
  // ── Task 13: Alert — No-Show Spike ────────────────────────────────────────
  {
    id: 'alert-noshow',
    title: 'No-Show Rate Spike: 40% Today',
    subtitle: 'Average is 15% · 5 of 12 missed appointments',
    secondaryText: 'Possible cause: SMS reminders failed',
    status: 'warning',
    iconType: 'task',
    hasExternalLink: false,
  },
  // ── Task 13: Alert — Vendor Delay ─────────────────────────────────────────
  {
    id: 'alert-vendor',
    title: 'BGC Vendor Delay: 8 Candidates >5 Days',
    subtitle: 'Accurate SLA breached (target: 3 days)',
    secondaryText: 'Blocking pre-start for Jun 23 cohort',
    status: 'critical',
    iconType: 'review',
    hasExternalLink: true,
  },
  // ── Task 13: Alert — Completion Risk ──────────────────────────────────────
  {
    id: 'alert-completion',
    title: '12 Candidates Unlikely to Complete by Jun 23',
    subtitle: 'Based on task velocity vs. days remaining',
    secondaryText: 'Recommend: move to Jun 30 or escalate',
    status: 'warning',
    iconType: 'task',
    hasExternalLink: false,
  },
  // ── Task 13: Alert — Compliance ───────────────────────────────────────────
  {
    id: 'alert-compliance',
    title: 'Compliance: NID Before LOI',
    subtitle: '1 candidate · PH Data Privacy Act',
    secondaryText: 'Requires immediate remediation',
    status: 'critical',
    iconType: 'review',
    hasExternalLink: true,
  },
];
