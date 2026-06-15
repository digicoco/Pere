import { useState } from 'react';
import { Col, Row, View } from '@amzn/stencil-react-components/layout';
import { H1, Text } from '@amzn/stencil-react-components/text';
import { Button, ButtonVariant } from '@amzn/stencil-react-components/button';
import { Card } from '@amzn/stencil-react-components/card';
import { TabBar, TabSwitcher, TabPanel, useTabs } from '@amzn/stencil-react-components/tabs';
import { AIIconWrapper } from '@amzn/stencil-react-components/ai';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import styled from '@emotion/styled';
import IconChevronLeftSmall from '@amzn/stencil-react-icons/icons/icon-chevron-left-small';
import IconChevronRightSmall from '@amzn/stencil-react-icons/icons/icon-chevron-right-small';

import IconPlusSmall from '@amzn/stencil-react-icons/icons/icon-plus-small';
import IconSparklesMedium from '@amzn/stencil-react-icons/icons/icon-sparkles-medium';
import IconCalendarSmall from '@amzn/stencil-react-icons/icons/icon-calendar-small';
import IconClockSmall from '@amzn/stencil-react-icons/icons/icon-clock-small';

// ─── Types ─────────────────────────────────────────────────────────────────────

type ReadinessStatus = 'ready' | 'partial' | 'blocked';
type AppointmentType = 'nhe' | 'drug-test' | 'interview';

interface TimelineCandidate {
  id: string;
  name: string;
  appointmentTime: string;
  type: AppointmentType;
  typeLabel: string;
  status: ReadinessStatus;
  statusDetail: string;
  tasks: { label: string; complete: boolean }[];
  autoReminders: string[];
}

interface UrgentItem {
  id: string;
  title: string;
  metadata: string;
  severity: 'critical' | 'urgent' | 'warning';
}

interface WalkIn {
  id: string;
  name: string;
  time: string;
  reason: string;
}

// ─── Style constants ───────────────────────────────────────────────────────────

const readinessColors: Record<ReadinessStatus, { dot: string; bg: string; label: string }> = {
  ready: { dot: token('color.green.60'), bg: 'rgba(0, 168, 144, 0.08)', label: 'Ready' },
  partial: { dot: token('color.orange.60'), bg: 'rgba(255, 132, 0, 0.08)', label: 'Partially ready' },
  blocked: { dot: token('color.red.60'), bg: 'rgba(218, 55, 51, 0.08)', label: 'Blocked' },
};

const typeColors: Record<AppointmentType, { bg: string; text: string; bar: string }> = {
  nhe: { bg: 'rgba(0, 168, 144, 0.16)', text: token('color.green.70'), bar: token('color.green.70') },
  'drug-test': { bg: 'rgba(255, 132, 0, 0.14)', text: token('color.orange.70'), bar: token('color.orange.70') },
  interview: { bg: 'rgba(98, 0, 234, 0.14)', text: token('color.purple.70'), bar: token('color.purple.70') },
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────

export const appointmentUrgentItems: UrgentItem[] = [
  { id: 'u1', title: '3 no-shows from yesterday need follow-up', metadata: 'Overdue · Blocking reschedule for Felix Walsh, Anya Petrov, Tariq Aziz', severity: 'critical' },
  { id: 'u2', title: '2 candidates have expired scheduling windows', metadata: 'Urgent · Manila-BGC slots expired 48h ago · Candidates cannot rebook', severity: 'urgent' },
  { id: 'u3', title: '4 medical appointments not yet booked — blocking Day 1', metadata: 'Warning · Clinic availability dropping · Next open: Jun 14', severity: 'warning' },
];

const timelineCandidates: TimelineCandidate[] = [
  {
    id: 'c1', name: 'Maria Santos', appointmentTime: '9:00 AM', type: 'nhe', typeLabel: 'New Hire Event',
    status: 'ready', statusDetail: 'All tasks complete, confirmed via SMS',
    tasks: [
      { label: 'NID uploaded', complete: true },
      { label: 'Badge photo approved', complete: true },
      { label: 'BGC consent signed', complete: true },
      { label: 'Appointment confirmed', complete: true },
    ],
    autoReminders: ['48h reminder sent Jun 9', '24h reminder sent Jun 10', '2h reminder sent today 7:00 AM'],
  },
  {
    id: 'c2', name: 'Juan Reyes', appointmentTime: '9:00 AM', type: 'nhe', typeLabel: 'New Hire Event',
    status: 'ready', statusDetail: 'All documents verified, candidate confirmed',
    tasks: [
      { label: 'NID uploaded', complete: true },
      { label: 'Badge photo approved', complete: true },
      { label: 'BGC consent signed', complete: true },
      { label: 'Appointment confirmed', complete: true },
    ],
    autoReminders: ['48h reminder sent Jun 9', '24h reminder sent Jun 10', '2h reminder sent today 7:00 AM'],
  },
  {
    id: 'c3', name: 'Ana Cruz', appointmentTime: '9:00 AM', type: 'nhe', typeLabel: 'New Hire Event',
    status: 'partial', statusDetail: 'Badge photo pending review — appointment at risk',
    tasks: [
      { label: 'NID uploaded', complete: true },
      { label: 'Badge photo pending review', complete: false },
      { label: 'BGC consent signed', complete: true },
      { label: 'Appointment confirmed', complete: true },
    ],
    autoReminders: ['48h reminder sent Jun 9', '24h reminder sent Jun 10', '2h reminder sent today 7:00 AM'],
  },
  {
    id: 'c4', name: 'Mateo Dela Cruz', appointmentTime: '10:00 AM', type: 'drug-test', typeLabel: 'Drug Test',
    status: 'ready', statusDetail: 'All clear — confirmed for onsite lab',
    tasks: [
      { label: 'Medical form signed', complete: true },
      { label: 'Appointment confirmed', complete: true },
    ],
    autoReminders: ['48h reminder sent Jun 9', '24h reminder sent Jun 10', '2h reminder sent today 8:00 AM'],
  },
  {
    id: 'c5', name: 'Sofia Flores', appointmentTime: '10:00 AM', type: 'interview', typeLabel: 'Phone Screen',
    status: 'partial', statusDetail: 'Missing resume upload — interviewer notified',
    tasks: [
      { label: 'Resume uploaded', complete: false },
      { label: 'Availability confirmed', complete: true },
      { label: 'Appointment confirmed', complete: true },
    ],
    autoReminders: ['48h reminder sent Jun 9', '24h reminder sent Jun 10', '2h reminder sent today 8:00 AM'],
  },
  {
    id: 'c6', name: 'Liam Santos', appointmentTime: '11:00 AM', type: 'nhe', typeLabel: 'New Hire Event',
    status: 'blocked', statusDetail: 'NID expired — cannot attend until resubmitted',
    tasks: [
      { label: 'NID expired — resubmission required', complete: false },
      { label: 'Badge photo approved', complete: true },
      { label: 'BGC consent signed', complete: true },
      { label: 'Appointment not confirmed', complete: false },
    ],
    autoReminders: ['48h reminder sent Jun 9', '24h reminder sent Jun 10 (with NID warning)', 'Manual reminder needed'],
  },
  {
    id: 'c7', name: 'Bea Aquino', appointmentTime: '11:00 AM', type: 'nhe', typeLabel: 'New Hire Event',
    status: 'ready', statusDetail: 'All tasks complete, confirmed via email',
    tasks: [
      { label: 'NID uploaded', complete: true },
      { label: 'Badge photo approved', complete: true },
      { label: 'BGC consent signed', complete: true },
      { label: 'Appointment confirmed', complete: true },
    ],
    autoReminders: ['48h reminder sent Jun 9', '24h reminder sent Jun 10', '2h reminder sent today 9:00 AM'],
  },
  {
    id: 'c8', name: 'Diego Ignacio', appointmentTime: '1:00 PM', type: 'nhe', typeLabel: 'New Hire Event',
    status: 'blocked', statusDetail: 'Medical check not booked — no clinic availability',
    tasks: [
      { label: 'NID uploaded', complete: true },
      { label: 'Badge photo approved', complete: true },
      { label: 'Medical check not booked', complete: false },
      { label: 'Appointment at risk', complete: false },
    ],
    autoReminders: ['48h reminder sent Jun 9', '24h reminder sent Jun 10 (flagged blocked)'],
  },
  {
    id: 'c9', name: 'Ina Mendoza', appointmentTime: '2:00 PM', type: 'interview', typeLabel: 'Phone Screen',
    status: 'ready', statusDetail: 'All tasks complete, candidate confirmed',
    tasks: [
      { label: 'Resume uploaded', complete: true },
      { label: 'Availability confirmed', complete: true },
      { label: 'Appointment confirmed', complete: true },
    ],
    autoReminders: ['48h reminder sent Jun 9', '24h reminder sent Jun 10', '2h reminder due 12:00 PM'],
  },
];

const mockWalkIns: WalkIn[] = [
  { id: '1', name: 'Felix Walsh', time: '08:42', reason: 'PHA today if possible' },
  { id: '2', name: 'Anya Petrov', time: '09:05', reason: 'Lost paperwork, needs help' },
  { id: '3', name: 'Tariq Aziz', time: '09:18', reason: 'Reschedule drug test' },
];

// ─── Styled Components ─────────────────────────────────────────────────────────

const UrgentCard = styled('div')<{ severity: 'critical' | 'urgent' | 'warning' }>(({ severity }) => {
  const borderColor = severity === 'critical' ? token('color.red.60') : severity === 'urgent' ? token('color.orange.60') : token('color.yellow.60');
  return {
    background: `linear-gradient(257deg, rgba(215, 235, 251, 0.2) 22%, rgba(229, 200, 247, 0.2) 128%)`,
    border: `1px solid ${token('color.border.primary')}`,
    borderLeft: `4px solid ${borderColor}`,
    borderRadius: 12,
    padding: `${token('dimensions.spacing.250')} ${token('dimensions.spacing.300')}`,
    display: 'flex',
    alignItems: 'center',
    gap: token('dimensions.spacing.250'),
  };
});

const ReviewButton = styled('button')({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 30,
  padding: '0 14px',
  borderRadius: 100,
  border: '2px solid transparent',
  background: `linear-gradient(${token('color.surface.bg-default')}, ${token('color.surface.bg-default')}) padding-box, linear-gradient(133deg, ${token('color.purple.70')} 7%, ${token('color.blue.60')} 133%) border-box`,
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: 14,
  fontWeight: 500,
});

const TimelineRow = styled('button')<{ readiness: ReadinessStatus }>(({ readiness }) => ({
  background: readinessColors[readiness].bg,
  border: `1px solid ${token('color.border.primary')}`,
  borderRadius: token('dimensions.border.radius.200'),
  width: '100%',
  textAlign: 'left',
  cursor: 'pointer',
  padding: `${token('dimensions.spacing.300')} ${token('dimensions.spacing.300')}`,
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gap: token('dimensions.spacing.300'),
  alignItems: 'center',
  fontFamily: 'inherit',
  transition: 'background-color 150ms ease, box-shadow 150ms ease',
  '&:hover': {
    boxShadow: `0 2px 8px ${token('color.gradient.elevation')}`,
  },
}));

const ReadinessDot = styled('span')<{ status: ReadinessStatus }>(({ status }) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: readinessColors[status].dot,
  flexShrink: 0,
}));

const TaskCheck = styled('span')<{ complete: boolean }>(({ complete }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  borderRadius: '50%',
  backgroundColor: complete ? token('color.green.60') : token('color.neutral.30'),
  color: complete ? token('color.neutral.00') : token('color.neutral.60'),
  fontSize: 10,
  fontWeight: 700,
  flexShrink: 0,
}));

const TypeBadge = styled('span')<{ type: AppointmentType }>(({ type }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  background: typeColors[type].bg,
  color: typeColors[type].text,
  padding: '2px 8px',
  borderRadius: 100,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase' as const,
}));

const DateNavButton = styled('button')({
  height: 30,
  width: 30,
  borderRadius: '50%',
  border: 'none',
  background: 'transparent',
  color: token('color.neutral.70'),
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    backgroundColor: token('color.surface.bg-muted'),
  },
});

const ViewToggleBtn = styled('button')<{ isActive?: boolean }>(({ isActive }) => ({
  height: 30,
  padding: '0 12px',
  borderRadius: 100,
  border: 'none',
  background: isActive ? token('color.neutral.90') : 'transparent',
  color: isActive ? token('color.neutral.00') : token('color.neutral.70'),
  fontSize: 13,
  fontWeight: isActive ? 700 : 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
}));

const WalkInCard = styled('div')({
  border: `1px solid ${token('color.border.primary')}`,
  borderRadius: token('dimensions.border.radius.200'),
  padding: `${token('dimensions.spacing.250')} ${token('dimensions.spacing.300')}`,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
});

const SmallActionBtn = styled('button')({
  background: 'transparent',
  border: `1px solid ${token('color.border.primary')}`,
  color: token('color.neutral.90'),
  borderRadius: 100,
  padding: '0 10px',
  height: 24,
  fontSize: 11,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
  '&:hover': {
    backgroundColor: token('color.surface.bg-muted'),
  },
});

const ActionBtn = styled('button')({
  background: 'transparent',
  border: `1px solid ${token('color.border.primary')}`,
  color: token('color.neutral.90'),
  borderRadius: 100,
  padding: '0 12px',
  height: 28,
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
  '&:hover': {
    backgroundColor: token('color.surface.bg-muted'),
  },
});

const DetailPanel = styled('div')({
  position: 'fixed',
  top: 63,
  right: 0,
  width: 380,
  bottom: 0,
  backgroundColor: token('color.surface.bg-raised'),
  borderLeft: `1px solid ${token('color.border.primary')}`,
  boxShadow: `-4px 0 16px ${token('color.gradient.elevation')}`,
  zIndex: 70,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const TimeGroupLabel = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: token('dimensions.spacing.200'),
  padding: `${token('dimensions.spacing.200')} 0`,
});

// ─── Component ─────────────────────────────────────────────────────────────────

export const AppointmentsPage = ({ onReview, completedTasks }: { onReview?: (msg: string) => void; completedTasks?: Set<string> }) => {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [selectedCandidate, setSelectedCandidate] = useState<TimelineCandidate | null>(null);

  const filteredUrgentItems = appointmentUrgentItems.filter(item => !completedTasks?.has(item.title));

  const tabs = [
    { label: 'Timeline', value: 'timeline' },
    { label: 'Venues', value: 'venues' },
  ];

  const { tabBarProps, tabSwitcherProps } = useTabs({ tabs, defaultTab: 'timeline' });

  // Group candidates by time for timeline view
  const timeGroups = timelineCandidates.reduce<Record<string, TimelineCandidate[]>>((acc, c) => {
    if (!acc[c.appointmentTime]) acc[c.appointmentTime] = [];
    acc[c.appointmentTime].push(c);
    return acc;
  }, {});

  const readyCt = timelineCandidates.filter(c => c.status === 'ready').length;
  const partialCt = timelineCandidates.filter(c => c.status === 'partial').length;
  const blockedCt = timelineCandidates.filter(c => c.status === 'blocked').length;

  return (
    <Col flex={1} backgroundColor="color.surface.bg-default" style={{ minHeight: '100%' }}>
      {/* Header */}
      <View padding="dimensions.spacing.400" backgroundColor="color.surface.bg-raised" borderBottom={`1px solid ${token('color.border.primary')}`}>
        <Row alignItems="center" justifyContent="space-between">
          <Col>
            <H1>Appointments</H1>
            <Text fontSize="T200" color="color.neutral.70">
              Timeline view with candidate readiness. Auto-reminders sent at 48h, 24h, and 2h before each appointment.
            </Text>
          </Col>
          <Button variant={ButtonVariant.Primary}>Add slots</Button>
        </Row>
      </View>

      {/* Tab bar */}
      <View padding={['0', 'dimensions.spacing.400']} borderBottom={`1px solid ${token('color.border.primary')}`}>
        <TabBar {...tabBarProps} />
      </View>

      {/* Date nav + view toggle */}
      <View padding={['dimensions.spacing.300', 'dimensions.spacing.400']} borderBottom={`1px solid ${token('color.border.primary')}`}>
        <Row gridGap="dimensions.spacing.300" alignItems="center">
          <Row alignItems="center" style={{ background: token('color.surface.bg-muted'), border: `1px solid ${token('color.border.primary')}`, borderRadius: 100, padding: 3 }}>
            <DateNavButton aria-label="Previous day">
              <IconChevronLeftSmall aria-hidden="true" />
            </DateNavButton>
            <Text fontSize="T100" fontWeight="medium" color="color.neutral.70" style={{ padding: '0 12px', minWidth: 120, textAlign: 'center' }}>
              Wed, Jun 11
            </Text>
            <DateNavButton aria-label="Next day">
              <IconChevronRightSmall aria-hidden="true" />
            </DateNavButton>
          </Row>
          <Row alignItems="center" style={{ background: token('color.surface.bg-muted'), border: `1px solid ${token('color.border.primary')}`, borderRadius: 100, padding: 3 }}>
            <ViewToggleBtn isActive={viewMode === 'day'} onClick={() => setViewMode('day')}>Day</ViewToggleBtn>
            <ViewToggleBtn isActive={viewMode === 'week'} onClick={() => setViewMode('week')}>Week</ViewToggleBtn>
          </Row>
        </Row>
      </View>

      <TabSwitcher {...tabSwitcherProps}>
        <TabPanel value="timeline">
          <Row flex={1} style={{ minHeight: 0, overflow: 'hidden' }}>
            {/* Main timeline area */}
            <Col flex={1} style={{ overflow: 'auto', padding: token('dimensions.spacing.400') }} gridGap="dimensions.spacing.400">

              {/* Urgent copilot cards */}
              {filteredUrgentItems.length > 0 && (
              <Col gridGap="dimensions.spacing.250">
                <Row alignItems="center" gridGap="dimensions.spacing.200">
                  <AIIconWrapper fill="color.gradient.action.default">
                    <IconSparklesMedium aria-hidden="true" />
                  </AIIconWrapper>
                  <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
                    Copilot — Unresolved scheduling items
                  </Text>
                </Row>
                {filteredUrgentItems.map((item) => (
                  <UrgentCard key={item.id} severity={item.severity}>
                    <AIIconWrapper fill="color.gradient.action.default">
                      <IconSparklesMedium aria-hidden="true" />
                    </AIIconWrapper>
                    <Col flex={1} gridGap="dimensions.spacing.100" style={{ minWidth: 0 }}>
                      <Text fontSize="T100" fontWeight="bold" color="color.neutral.90">
                        {item.title}
                      </Text>
                      <Text variant="label-xs" color="color.neutral.70">
                        {item.metadata}
                      </Text>
                    </Col>
                    <ReviewButton onClick={() => onReview?.(item.title)}>
                      <AIIconWrapper fill="color.gradient.action.default">
                        <IconSparklesMedium aria-hidden="true" style={{ width: 14, height: 14 }} />
                      </AIIconWrapper>
                      <span style={{ background: `linear-gradient(133deg, ${token('color.purple.70')} 7%, ${token('color.blue.60')} 133%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Review
                      </span>
                    </ReviewButton>
                  </UrgentCard>
                ))}
              </Col>
              )}

              {/* Readiness summary */}
              <Card padding="dimensions.spacing.300" width="100%">
                <Row alignItems="center" gridGap="dimensions.spacing.500" flexWrap="wrap">
                  <Col flex={1} style={{ minWidth: 180 }}>
                    <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Today's readiness
                    </Text>
                    <Text fontSize="T300" fontWeight="bold" color="color.neutral.90" style={{ marginTop: 2 }}>
                      Wednesday, June 11
                    </Text>
                  </Col>
                  <Col>
                    <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Total
                    </Text>
                    <Text fontSize="T200" fontWeight="bold" color="color.neutral.90" style={{ marginTop: 2 }}>{timelineCandidates.length}</Text>
                  </Col>
                  <Col>
                    <Row alignItems="center" gridGap="dimensions.spacing.100">
                      <ReadinessDot status="ready" />
                      <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Ready
                      </Text>
                    </Row>
                    <Text fontSize="T200" fontWeight="bold" color="color.green.70" style={{ marginTop: 2 }}>{readyCt}</Text>
                  </Col>
                  <Col>
                    <Row alignItems="center" gridGap="dimensions.spacing.100">
                      <ReadinessDot status="partial" />
                      <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Partial
                      </Text>
                    </Row>
                    <Text fontSize="T200" fontWeight="bold" color="color.orange.70" style={{ marginTop: 2 }}>{partialCt}</Text>
                  </Col>
                  <Col>
                    <Row alignItems="center" gridGap="dimensions.spacing.100">
                      <ReadinessDot status="blocked" />
                      <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Blocked
                      </Text>
                    </Row>
                    <Text fontSize="T200" fontWeight="bold" color="color.red.70" style={{ marginTop: 2 }}>{blockedCt}</Text>
                  </Col>
                </Row>
              </Card>

              {/* Timeline grouped by time */}
              <Col gridGap="dimensions.spacing.300">
                {Object.entries(timeGroups).map(([time, candidates]) => (
                  <Col key={time} gridGap="dimensions.spacing.200">
                    <TimeGroupLabel>
                      <IconClockSmall aria-hidden="true" color={token('color.neutral.60')} />
                      <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">{time}</Text>
                      <Text variant="label-xs" color="color.neutral.60">
                        {candidates.length} candidate{candidates.length > 1 ? 's' : ''}
                      </Text>
                    </TimeGroupLabel>
                    {candidates.map((candidate) => (
                      <TimelineRow
                        key={candidate.id}
                        readiness={candidate.status}
                        onClick={() => setSelectedCandidate(candidate)}
                        aria-label={`${candidate.name} — ${readinessColors[candidate.status].label}`}
                      >
                        <Row alignItems="center" gridGap="dimensions.spacing.200" style={{ minWidth: 140 }}>
                          <ReadinessDot status={candidate.status} />
                          <Col>
                            <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">{candidate.name}</Text>
                            <Text variant="label-xs" color="color.neutral.60">{readinessColors[candidate.status].label}</Text>
                          </Col>
                        </Row>
                        <Col style={{ minWidth: 0 }}>
                          <Row alignItems="center" gridGap="dimensions.spacing.200" flexWrap="wrap">
                            <TypeBadge type={candidate.type}>{candidate.typeLabel}</TypeBadge>
                            <Text fontSize="T100" color="color.neutral.70" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {candidate.statusDetail}
                            </Text>
                          </Row>
                        </Col>
                        <Row alignItems="center" gridGap="dimensions.spacing.200">
                          <Text variant="label-xs" color="color.neutral.60">
                            {candidate.tasks.filter(t => t.complete).length}/{candidate.tasks.length}
                          </Text>
                          <IconChevronRightSmall aria-hidden="true" color={token('color.neutral.60')} />
                        </Row>
                      </TimelineRow>
                    ))}
                  </Col>
                ))}
              </Col>
            </Col>

            {/* Walk-in sidebar */}
            <Col style={{ width: 300, flexShrink: 0, borderLeft: `1px solid ${token('color.border.primary')}`, background: token('color.surface.bg-raised'), padding: token('dimensions.spacing.400'), overflow: 'auto' }} gridGap="dimensions.spacing.300">
              <Col>
                <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Walk-in queue · {mockWalkIns.length}
                </Text>
                <Text fontSize="T100" color="color.neutral.70" style={{ marginTop: 4 }}>
                  Candidates without a booked slot.
                </Text>
              </Col>
              <Col gridGap="dimensions.spacing.200">
                {mockWalkIns.map((w) => (
                  <WalkInCard key={w.id}>
                    <Row justifyContent="space-between" alignItems="center">
                      <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">{w.name}</Text>
                      <Text variant="label-xs" color="color.neutral.60">{w.time}</Text>
                    </Row>
                    <Text fontSize="T100" color="color.neutral.70">{w.reason}</Text>
                    <Row gridGap="dimensions.spacing.100" flexWrap="wrap">
                      <SmallActionBtn>Assign slot</SmallActionBtn>
                      <SmallActionBtn>Book future</SmallActionBtn>
                    </Row>
                  </WalkInCard>
                ))}
              </Col>
              <Button variant={ButtonVariant.Tertiary} style={{ alignSelf: 'flex-start' }}>
                <Row alignItems="center" gridGap="dimensions.spacing.100">
                  <IconPlusSmall aria-hidden="true" />
                  <span>Log walk-in</span>
                </Row>
              </Button>
            </Col>
          </Row>
        </TabPanel>

        <TabPanel value="venues">
          <Col padding="dimensions.spacing.400">
            <Text fontSize="T200" color="color.neutral.60">
              Venue configuration and capacity management will appear here.
            </Text>
          </Col>
        </TabPanel>
      </TabSwitcher>

      {/* Detail panel for selected candidate */}
      {selectedCandidate && (
        <DetailPanel>
          <Row
            padding="dimensions.spacing.300"
            borderBottom={`1px solid ${token('color.border.primary')}`}
            alignItems="center"
            justifyContent="space-between"
          >
            <Col>
              <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">{selectedCandidate.name}</Text>
              <Row alignItems="center" gridGap="dimensions.spacing.100">
                <ReadinessDot status={selectedCandidate.status} />
                <Text variant="label-xs" color="color.neutral.70">{readinessColors[selectedCandidate.status].label}</Text>
              </Row>
            </Col>
            <button
              onClick={() => setSelectedCandidate(null)}
              aria-label="Close detail"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: token('dimensions.spacing.200'), borderRadius: 100, color: token('color.neutral.70') }}
            >
              <IconChevronRightSmall aria-hidden="true" />
            </button>
          </Row>

          <Col flex={1} padding="dimensions.spacing.400" gridGap="dimensions.spacing.400" style={{ overflowY: 'auto' }}>
            {/* Appointment info */}
            <Card padding="dimensions.spacing.300">
              <Col gridGap="dimensions.spacing.200">
                <Row alignItems="center" gridGap="dimensions.spacing.200">
                  <IconCalendarSmall aria-hidden="true" color={token('color.neutral.60')} />
                  <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
                    {selectedCandidate.appointmentTime} — {selectedCandidate.typeLabel}
                  </Text>
                </Row>
                <Text fontSize="T100" color="color.neutral.70">{selectedCandidate.statusDetail}</Text>
              </Col>
            </Card>

            {/* Task checklist */}
            <Col gridGap="dimensions.spacing.200">
              <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Pre-appointment tasks
              </Text>
              {selectedCandidate.tasks.map((task, i) => (
                <Row key={i} alignItems="center" gridGap="dimensions.spacing.200">
                  <TaskCheck complete={task.complete}>
                    {task.complete ? '\u2713' : ''}
                  </TaskCheck>
                  <Text fontSize="T100" color={task.complete ? 'color.neutral.70' : 'color.neutral.90'} style={{ textDecoration: task.complete ? 'line-through' : 'none' }}>
                    {task.label}
                  </Text>
                </Row>
              ))}
            </Col>

            {/* Auto-reminder log */}
            <Col gridGap="dimensions.spacing.200">
              <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Auto-reminders (system-sent)
              </Text>
              {selectedCandidate.autoReminders.map((r, i) => (
                <Row key={i} alignItems="flex-start" gridGap="dimensions.spacing.200">
                  <Text variant="label-xs" color="color.neutral.60" style={{ flexShrink: 0, marginTop: 2 }}>
                    {i === 0 ? '48h' : i === 1 ? '24h' : '2h'}
                  </Text>
                  <Text fontSize="T100" color="color.neutral.70">{r}</Text>
                </Row>
              ))}
            </Col>

            {/* Recruiter actions */}
            <Col gridGap="dimensions.spacing.200">
              <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Recruiter actions
              </Text>
              <Row gridGap="dimensions.spacing.200" flexWrap="wrap">
                <ActionBtn>Reschedule</ActionBtn>
                <ActionBtn>Cancel</ActionBtn>
                <ActionBtn>Mark no-show</ActionBtn>
                <ActionBtn>Send manual reminder</ActionBtn>
              </Row>
            </Col>
          </Col>
        </DetailPanel>
      )}
    </Col>
  );
};
