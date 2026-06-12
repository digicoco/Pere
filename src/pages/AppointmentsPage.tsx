import { useState } from 'react';
import { Col, Row, View } from '@amzn/stencil-react-components/layout';
import { H1, Text } from '@amzn/stencil-react-components/text';
import { Button, ButtonVariant } from '@amzn/stencil-react-components/button';
import { Card } from '@amzn/stencil-react-components/card';
import { TabBar, TabSwitcher, TabPanel, useTabs } from '@amzn/stencil-react-components/tabs';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import styled from '@emotion/styled';
import IconChevronLeftSmall from '@amzn/stencil-react-icons/icons/icon-chevron-left-small';
import IconChevronRightSmall from '@amzn/stencil-react-icons/icons/icon-chevron-right-small';
import IconChevronDownSmall from '@amzn/stencil-react-icons/icons/icon-chevron-down-small';
import IconPlusSmall from '@amzn/stencil-react-icons/icons/icon-plus-small';

type AppointmentType = 'nhe' | 'drug-test' | 'interview';

interface Appointment {
  id: string;
  time: string;
  duration: string;
  type: AppointmentType;
  typeLabel: string;
  title: string;
  location: string;
  reserved: string;
  fill: number;
}

interface WalkIn {
  id: string;
  name: string;
  time: string;
  reason: string;
}

const typeColors: Record<AppointmentType, { bg: string; text: string; bar: string }> = {
  nhe: { bg: 'rgba(0, 168, 144, 0.16)', text: token('color.green.70'), bar: token('color.green.70') },
  'drug-test': { bg: 'rgba(255, 132, 0, 0.14)', text: token('color.orange.70'), bar: token('color.orange.70') },
  interview: { bg: 'rgba(98, 0, 234, 0.14)', text: token('color.purple.70'), bar: token('color.purple.70') },
};

const mockAppointments: Appointment[] = [
  { id: '1', time: '9:00 AM - 10:30 AM', duration: '90 min', type: 'nhe', typeLabel: 'New Hire Event', title: 'NHE - MNL1 in person', location: 'MNL1 - Manila · 1 of 8 reserved', reserved: '1/8', fill: 13 },
  { id: '2', time: '9:00 AM - 9:30 AM', duration: '30 min', type: 'drug-test', typeLabel: 'Drug test', title: 'Drug test - onsite lab', location: 'Quest Diagnostics - Manila · 1 of 1 reserved', reserved: '1/1', fill: 100 },
  { id: '3', time: '10:00 AM - 10:20 AM', duration: '20 min', type: 'interview', typeLabel: 'Interview', title: 'Phone screen - recruiter', location: 'Virtual · 1 of 1 reserved', reserved: '1/1', fill: 100 },
  { id: '4', time: '10:00 AM - 10:30 AM', duration: '30 min', type: 'drug-test', typeLabel: 'Drug test', title: 'Drug test - onsite lab', location: 'Quest Diagnostics - Manila · 1 of 1 reserved', reserved: '1/1', fill: 100 },
  { id: '5', time: '11:00 AM - 1:00 PM', duration: '120 min', type: 'nhe', typeLabel: 'New Hire Event', title: 'NHE - group session', location: 'MNL1 - Manila · 3 of 24 reserved', reserved: '3/24', fill: 13 },
  { id: '6', time: '11:00 AM - 11:30 AM', duration: '30 min', type: 'drug-test', typeLabel: 'Drug test', title: 'Drug test - onsite lab', location: 'Quest Diagnostics - Manila · 1 of 1 reserved', reserved: '1/1', fill: 100 },
  { id: '7', time: '1:00 PM - 2:30 PM', duration: '90 min', type: 'nhe', typeLabel: 'New Hire Event', title: 'NHE - MNL1 in person', location: 'MNL1 - Manila · 1 of 8 reserved', reserved: '1/8', fill: 13 },
  { id: '8', time: '2:00 PM - 2:20 PM', duration: '20 min', type: 'interview', typeLabel: 'Interview', title: 'Phone screen - recruiter', location: 'Virtual · 1 of 1 reserved', reserved: '1/1', fill: 100 },
  { id: '9', time: '3:00 PM - 3:20 PM', duration: '20 min', type: 'interview', typeLabel: 'Interview', title: 'Phone screen - recruiter', location: 'Virtual · 1 of 1 reserved', reserved: '1/1', fill: 100 },
];

const mockWalkIns: WalkIn[] = [
  { id: '1', name: 'Felix Walsh', time: '08:42', reason: 'PHA today if possible' },
  { id: '2', name: 'Anya Petrov', time: '09:05', reason: 'Lost paperwork, needs help' },
  { id: '3', name: 'Tariq Aziz', time: '09:18', reason: 'Reschedule drug test' },
];

const SlotCard = styled('button')({
  background: 'transparent',
  border: `1px solid ${token('color.border.primary')}`,
  borderRadius: token('dimensions.border.radius.200'),
  width: '100%',
  textAlign: 'left',
  cursor: 'pointer',
  padding: `${token('dimensions.spacing.250')} ${token('dimensions.spacing.300')}`,
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gap: token('dimensions.spacing.300'),
  alignItems: 'center',
  fontFamily: 'inherit',
  '&:hover': {
    backgroundColor: token('color.surface.bg-muted'),
  },
});

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

const FillBadge = styled('span')<{ fill: number }>(({ fill }) => ({
  fontSize: 11,
  fontWeight: 700,
  color: fill >= 80 ? token('color.green.70') : token('color.red.70'),
  background: fill >= 80 ? 'rgba(0, 168, 144, 0.1)' : 'rgba(218, 55, 51, 0.1)',
  padding: '2px 8px',
  borderRadius: 100,
  whiteSpace: 'nowrap' as const,
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

export const AppointmentsPage = () => {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  const tabs = [
    { label: 'Today at venue', value: 'today' },
    { label: 'Venues', value: 'venues' },
  ];

  const { tabBarProps, tabSwitcherProps } = useTabs({ tabs, defaultTab: 'today' });

  return (
    <Col flex={1} backgroundColor="color.surface.bg-default" style={{ minHeight: '100%' }}>
      {/* Header */}
      <View padding="dimensions.spacing.400" backgroundColor="color.surface.bg-raised" borderBottom={`1px solid ${token('color.border.primary')}`}>
        <Col>
          <H1>Appointments</H1>
        </Col>
      </View>

      {/* Tab bar */}
      <View padding={['0', 'dimensions.spacing.400']} borderBottom={`1px solid ${token('color.border.primary')}`}>
        <TabBar {...tabBarProps} />
      </View>

      {/* Date nav + view toggle below tabs */}
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
        <TabPanel value="today">
          <Col flex={1} style={{ minHeight: 0 }}>
            {/* Description */}
            <View padding={['dimensions.spacing.200', 'dimensions.spacing.400', '0']}>
              <Text fontSize="T200" color="color.neutral.70">
                Today's roster, walk-ins, and the rest of the week — all the appointment time slots for the site you're standing in.
              </Text>
            </View>
            {/* Content */}
            <Row flex={1} style={{ minHeight: 0, overflow: 'hidden' }}>
              {/* Main schedule area */}
              <Col flex={1} style={{ overflow: 'auto', padding: token('dimensions.spacing.400') }}>
                {/* Stats card */}
                <Card padding="dimensions.spacing.300" width="100%" style={{ marginBottom: token('dimensions.spacing.400') }}>
                  <Row alignItems="center" gridGap="dimensions.spacing.500" flexWrap="wrap">
                    <Col flex={1} style={{ minWidth: 180 }}>
                      <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Roster
                      </Text>
                      <Text fontSize="T300" fontWeight="bold" color="color.neutral.90" style={{ marginTop: 2 }}>
                        Wednesday, June 11
                      </Text>
                    </Col>
                    <Col>
                      <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Appointments
                      </Text>
                      <Text fontSize="T200" fontWeight="bold" color="color.neutral.90" style={{ marginTop: 2 }}>9</Text>
                    </Col>
                    <Col>
                      <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Reserved
                      </Text>
                      <Text fontSize="T200" fontWeight="bold" color="color.neutral.90" style={{ marginTop: 2 }}>11 / 46</Text>
                    </Col>
                    <Col>
                      <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Fill
                      </Text>
                      <Text fontSize="T200" fontWeight="bold" color="color.red.70" style={{ marginTop: 2 }}>24%</Text>
                    </Col>
                  </Row>
                </Card>

                {/* Appointment slots */}
                <Col gridGap="dimensions.spacing.200">
                  {mockAppointments.map((apt) => (
                    <SlotCard key={apt.id}>
                      <Row alignItems="center" gridGap="dimensions.spacing.200" style={{ minWidth: 130 }}>
                        <span style={{ width: 4, height: 36, background: typeColors[apt.type].bar, borderRadius: 4 }} />
                        <Col>
                          <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">{apt.time}</Text>
                          <Text variant="label-xs" color="color.neutral.60">{apt.duration}</Text>
                        </Col>
                      </Row>
                      <Col style={{ minWidth: 0 }}>
                        <Row alignItems="center" gridGap="dimensions.spacing.200" flexWrap="wrap">
                          <TypeBadge type={apt.type}>{apt.typeLabel}</TypeBadge>
                          <Text fontSize="T200" fontWeight="medium" color="color.neutral.90">{apt.title}</Text>
                        </Row>
                        <Text fontSize="T100" color="color.neutral.70" style={{ marginTop: 2 }}>{apt.location}</Text>
                      </Col>
                      <Row alignItems="center" gridGap="dimensions.spacing.200">
                        <FillBadge fill={apt.fill}>{apt.fill}%</FillBadge>
                        <IconChevronDownSmall aria-hidden="true" color={token('color.neutral.60')} />
                      </Row>
                    </SlotCard>
                  ))}
                </Col>
              </Col>

              {/* Walk-in sidebar */}
              <Col style={{ width: 320, flexShrink: 0, borderLeft: `1px solid ${token('color.border.primary')}`, background: token('color.surface.bg-raised'), padding: token('dimensions.spacing.400'), overflow: 'auto' }} gridGap="dimensions.spacing.300">
                <Col>
                  <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Walk-in queue · {mockWalkIns.length}
                  </Text>
                  <Text fontSize="T100" color="color.neutral.70" style={{ marginTop: 4 }}>
                    Candidates who showed up without a booked slot. Triage to a free slot today, send home with a future booking, or escalate.
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
          </Col>
        </TabPanel>

        <TabPanel value="venues">
          <Col padding="dimensions.spacing.400">
            <Text fontSize="T200" color="color.neutral.60">
              Venue configuration and capacity management will appear here.
            </Text>
          </Col>
        </TabPanel>
      </TabSwitcher>
    </Col>
  );
};
