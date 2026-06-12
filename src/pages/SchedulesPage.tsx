import { useState } from 'react';
import { Col, Row, View } from '@amzn/stencil-react-components/layout';
import { H1, Text } from '@amzn/stencil-react-components/text';
import { Button, ButtonVariant } from '@amzn/stencil-react-components/button';
import { Card } from '@amzn/stencil-react-components/card';
import { Table, TableSpacing } from '@amzn/stencil-react-components/table';
import { SearchField } from '@amzn/stencil-react-components/search';
import { FilterChip, FilterList, FilterPopover } from '@amzn/stencil-react-components/filtering';
import { Pagination } from '@amzn/stencil-react-components/pagination';
import { TabBar, TabSwitcher, TabPanel, useTabs } from '@amzn/stencil-react-components/tabs';
import { AIIconWrapper } from '@amzn/stencil-react-components/ai';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import styled from '@emotion/styled';
import IconSparklesMedium from '@amzn/stencil-react-icons/icons/icon-sparkles-medium';
import IconPlusSmall from '@amzn/stencil-react-icons/icons/icon-plus-small';

const AiSuggestionCard = styled('div')({
  background: `linear-gradient(257deg, rgba(215, 235, 251, 0.2) 22%, rgba(229, 200, 247, 0.2) 128%)`,
  border: `1px solid ${token('color.border.primary')}`,
  borderRadius: 16,
  flex: '1 1 360px',
  minWidth: 320,
  display: 'flex',
  alignItems: 'flex-start',
  gap: token('dimensions.spacing.250'),
  padding: `${token('dimensions.spacing.250')} ${token('dimensions.spacing.300')}`,
});

const FullWidthTableWrapper = styled('div')({
  width: '100%',
  overflowX: 'auto',
  '& > div': {
    width: '100%',
    display: 'block',
  },
  '& table': {
    width: '100%',
  },
});

const ShowSchedulesLink = styled('button')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  border: 'none',
  background: `linear-gradient(133deg, ${token('color.purple.70')} 7%, ${token('color.blue.60')} 133%)`,
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: 13,
  fontWeight: 500,
  padding: 0,
  marginTop: 4,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

const IconCircle = styled('div')<{ bg: string }>(({ bg }) => ({
  width: 30,
  height: 30,
  borderRadius: '50%',
  backgroundColor: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

interface ScheduleSuggestion {
  iconBg: string;
  title: string;
  description: string;
}

const scheduleSuggestions: ScheduleSuggestion[] = [
  {
    iconBg: 'rgba(218, 55, 51, 0.1)',
    title: '11 schedules won\'t make start date',
    description: '256 starts short across the book · soonest start in 0d. At current pace these miss demand.',
  },
  {
    iconBg: 'rgba(86, 92, 215, 0.1)',
    title: '8 under-filling schedules cluster at MNL1',
    description: 'Shared root cause: overnight shift + base pay ~$0.50 below the MNL1 geo-cluster median. Peer sites fill 22% faster.',
  },
  {
    iconBg: 'rgba(0, 168, 144, 0.12)',
    title: '19 candidates ready to hire across 9 schedules',
    description: 'Start-date confirmed, not yet moved to hired. Fastest win on the board — one bulk action clears it.',
  },
  {
    iconBg: 'rgba(255, 153, 0, 0.14)',
    title: '2 schedules showing an anomaly',
    description: 'Apply rate on MNL1 cratered -47% WoW — and a funnel ratio swung >30pp elsewhere.',
  },
  {
    iconBg: 'rgba(218, 55, 51, 0.1)',
    title: '1 schedule with data defects',
    description: '2 blocking issues — pay-source mismatch, missing venue. These corrupt fill projection and block clean hire until fixed.',
  },
];

const mockSchedules = [
  { scheduleId: 'shift-mnl1-na-night', site: 'MNL1', role: 'CS Associate', employmentType: 'Regular', scheduleType: 'Full-Time', hireDate: '2026-06-04', hc: 45, filledDemand: '12 / 45', startDateFilled: '27%', status: 'Posted' },
  { scheduleId: 'shift-mnl1-eu-day', site: 'MNL1', role: 'CS Associate', employmentType: 'Regular', scheduleType: 'Full-Time', hireDate: '2026-06-11', hc: 30, filledDemand: '8 / 30', startDateFilled: '27%', status: 'Posted' },
  { scheduleId: 'shift-mnl1-weekend', site: 'MNL1', role: 'CS Associate', employmentType: 'Regular', scheduleType: 'Part-Time', hireDate: '2026-06-11', hc: 20, filledDemand: '5 / 20', startDateFilled: '25%', status: 'Posted' },
  { scheduleId: 'shift-ceb1-na-night', site: 'CEB1', role: 'CS Associate', employmentType: 'Regular', scheduleType: 'Full-Time', hireDate: '2026-06-07', hc: 35, filledDemand: '10 / 35', startDateFilled: '29%', status: 'Posted' },
  { scheduleId: 'shift-mnl1-na-mid', site: 'MNL1', role: 'CS Associate', employmentType: 'Seasonal', scheduleType: 'Full-Time', hireDate: '2026-06-28', hc: 60, filledDemand: '18 / 60', startDateFilled: '30%', status: 'Posted' },
  { scheduleId: 'shift-mnl1-na-day', site: 'MNL1', role: 'CS Associate', employmentType: 'Regular', scheduleType: 'Full-Time', hireDate: '2026-06-10', hc: 40, filledDemand: '14 / 40', startDateFilled: '35%', status: 'Posted' },
  { scheduleId: 'shift-mnl1-ph-domestic', site: 'MNL1', role: 'CS Associate', employmentType: 'Regular', scheduleType: 'Full-Time', hireDate: '2026-07-01', hc: 25, filledDemand: '7 / 25', startDateFilled: '28%', status: 'Posted' },
  { scheduleId: 'shift-mnl1-na-early', site: 'MNL1', role: 'CS Associate', employmentType: 'Seasonal', scheduleType: 'Part-Time', hireDate: '2026-07-22', hc: 50, filledDemand: '22 / 50', startDateFilled: '44%', status: 'Posted' },
  { scheduleId: 'shift-mnl1-apac-day', site: 'MNL1', role: 'CS Associate', employmentType: 'Regular', scheduleType: 'Full-Time', hireDate: '2026-06-13', hc: 28, filledDemand: '9 / 28', startDateFilled: '32%', status: 'Posted' },
  { scheduleId: 'shift-mnl1-twilight', site: 'MNL1', role: 'CS Associate', employmentType: 'Seasonal', scheduleType: 'Full-Time', hireDate: '2026-06-18', hc: 55, filledDemand: '20 / 55', startDateFilled: '36%', status: 'Posted' },
  { scheduleId: 'shift-ceb1-eu-day', site: 'CEB1', role: 'CS Associate', employmentType: 'Regular', scheduleType: 'Full-Time', hireDate: '2026-06-11', hc: 32, filledDemand: '11 / 32', startDateFilled: '34%', status: 'Posted' },
  { scheduleId: 'shift-ceb1-weekend', site: 'CEB1', role: 'CS Associate', employmentType: 'Regular', scheduleType: 'Part-Time', hireDate: '2026-06-14', hc: 18, filledDemand: '6 / 18', startDateFilled: '33%', status: 'Posted' },
  { scheduleId: 'shift-ceb1-ph-day', site: 'CEB1', role: 'CS Associate', employmentType: 'Regular', scheduleType: 'Full-Time', hireDate: '2026-06-20', hc: 22, filledDemand: '8 / 22', startDateFilled: '36%', status: 'Posted' },
  { scheduleId: 'shift-mnl1-eu-night', site: 'MNL1', role: 'CS Associate', employmentType: 'Seasonal', scheduleType: 'Full-Time', hireDate: '2026-07-05', hc: 38, filledDemand: '15 / 38', startDateFilled: '39%', status: 'Posted' },
];

const columns = [
  { header: 'Schedule ID', accessor: 'scheduleId' },
  { header: 'Site', accessor: 'site' },
  { header: 'Role', accessor: 'role' },
  { header: 'Employment type', accessor: 'employmentType' },
  { header: 'Schedule type', accessor: 'scheduleType' },
  { header: 'Hire date', accessor: 'hireDate' },
  { header: 'HC', accessor: 'hc' },
  { header: 'Filled / Demand', accessor: 'filledDemand' },
  { header: 'Start-date filled', accessor: 'startDateFilled' },
  { header: 'Status', accessor: 'status' },
];

export const SchedulesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const tabs = [
    { label: 'All schedules', value: 'all' },
    { label: 'Schedule health', value: 'health' },
  ];

  const { tabBarProps, tabSwitcherProps } = useTabs({ tabs, defaultTab: 'all' });

  return (
    <Col flex={1} backgroundColor="color.surface.bg-default" style={{ minWidth: 0, overflow: 'hidden' }}>
      {/* Page Header */}
      <View padding={['dimensions.spacing.400', 'dimensions.spacing.400', 'dimensions.spacing.200']}>
        <Row alignItems="flex-end" justifyContent="space-between">
          <Col>
            <H1>Schedules</H1>
            <Text fontSize="T200" color="color.neutral.70">
              <Text fontWeight="bold" color="color.neutral.90">14</Text> schedules
            </Text>
          </Col>
          <Button variant={ButtonVariant.Primary}>
            Create new schedule
          </Button>
        </Row>
      </View>

      {/* Copilot Suggests Section */}
      <View padding={['dimensions.spacing.300', 'dimensions.spacing.400', 'dimensions.spacing.300']}>
        <Col gridGap="dimensions.spacing.250">
          <Row alignItems="center" gridGap="dimensions.spacing.200">
            <AIIconWrapper fill="color.gradient.action.default">
              <IconSparklesMedium aria-hidden="true" />
            </AIIconWrapper>
            <Col gridGap="dimensions.spacing.50">
              <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
                Copilot suggests where to look
              </Text>
              <Text fontSize="T100" color="color.neutral.70">
                5 patterns across your book
              </Text>
            </Col>
          </Row>
          <Row gridGap="dimensions.spacing.300" flexWrap="wrap">
            {scheduleSuggestions.map((suggestion, i) => (
              <AiSuggestionCard key={i}>
                <IconCircle bg={suggestion.iconBg}>
                  <AIIconWrapper fill="color.gradient.action.default">
                    <IconSparklesMedium aria-hidden="true" style={{ width: 16, height: 16 }} />
                  </AIIconWrapper>
                </IconCircle>
                <Col flex={1} gridGap="dimensions.spacing.50" style={{ minWidth: 0 }}>
                  <Text fontSize="T100" fontWeight="bold" color="color.neutral.90">
                    {suggestion.title}
                  </Text>
                  <Text fontSize="T50" color="color.neutral.70">
                    {suggestion.description}
                  </Text>
                  <ShowSchedulesLink>
                    Show these schedules
                  </ShowSchedulesLink>
                </Col>
              </AiSuggestionCard>
            ))}
          </Row>
        </Col>
      </View>

      {/* Tab Bar */}
      <View padding={['0', 'dimensions.spacing.400']} borderBottom={`1px solid ${token('color.border.primary')}`}>
        <TabBar {...tabBarProps} />
      </View>

      <TabSwitcher {...tabSwitcherProps}>
        <TabPanel value="all">
      {/* Filter Bar */}
      <View padding={['dimensions.spacing.200', 'dimensions.spacing.400', 'dimensions.spacing.300']}>
        <Row gridGap="dimensions.spacing.200" alignItems="center" flexWrap="wrap">
          <SearchField
            query={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by schedule ID, site, or role..."
            width={380}
          />
          <FilterPopover triggerComponent={<FilterChip>Site</FilterChip>}>
            <FilterList
              options={[
                { label: 'MNL1', value: 'mnl1' },
                { label: 'CEB1', value: 'ceb1' },
              ]}
              titleText="Select site"
            />
          </FilterPopover>
          <FilterPopover triggerComponent={<FilterChip>Role</FilterChip>}>
            <FilterList
              options={[
                { label: 'CS Associate', value: 'cs-associate' },
              ]}
              titleText="Select role"
            />
          </FilterPopover>
          <FilterPopover triggerComponent={<FilterChip>Schedule type</FilterChip>}>
            <FilterList
              options={[
                { label: 'Full-Time', value: 'full-time' },
                { label: 'Part-Time', value: 'part-time' },
              ]}
              titleText="Select schedule type"
            />
          </FilterPopover>
          <FilterPopover triggerComponent={<FilterChip>Employment type</FilterChip>}>
            <FilterList
              options={[
                { label: 'Regular', value: 'regular' },
                { label: 'Seasonal', value: 'seasonal' },
              ]}
              titleText="Select employment type"
            />
          </FilterPopover>
          <FilterPopover triggerComponent={<FilterChip>Status</FilterChip>}>
            <FilterList
              options={[
                { label: 'Posted', value: 'posted' },
                { label: 'Unposted', value: 'unposted' },
                { label: 'Filled', value: 'filled' },
              ]}
              titleText="Select status"
            />
          </FilterPopover>
        </Row>
      </View>

      {/* Data Table */}
      <View padding={['0', 'dimensions.spacing.400']} flex={1} style={{ minWidth: 0 }}>
        <FullWidthTableWrapper>
          <Table
            aria-label="Schedules"
            columns={columns}
            data={mockSchedules}
            spacing={TableSpacing.Reduced}
            shouldScrollHorizontally={false}
          />
        </FullWidthTableWrapper>
      </View>

      {/* Pagination */}
      <Row padding="dimensions.spacing.300" justifyContent="center" alignItems="center" gridGap="dimensions.spacing.300">
        <Pagination
          numberOfPages={1}
          onPageSelect={setCurrentPage}
          selectedPage={currentPage}
        />
        <Text fontSize="T100" color="color.neutral.60">
          Showing 14 of 14
        </Text>
      </Row>
        </TabPanel>

        <TabPanel value="health">
          <Col flex={1}>
            {/* Schedule Health Header */}
            <View padding="dimensions.spacing.400" backgroundColor="color.surface.bg-raised" borderBottom={`1px solid ${token('color.border.primary')}`}>
              <Row alignItems="flex-end" justifyContent="space-between" flexWrap="wrap" gridGap="dimensions.spacing.400">
                <Col>
                  <Text fontSize="T300" fontWeight="bold" color="color.neutral.90">Schedule Operations</Text>
                  <Text fontSize="T200" color="color.neutral.70" style={{ marginTop: token('dimensions.spacing.200'), maxWidth: 600 }}>
                    Every schedule, with posting status + reason. Pere auto-heals what it can; this surface defaults to "needs human" so you only see what's actually blocked.
                  </Text>
                </Col>
                <Row gridGap="dimensions.spacing.300">
                  <Col>
                    <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>Posted</Text>
                    <Text fontSize="T200" fontWeight="bold" color="color.green.70" style={{ marginTop: 2 }}>3</Text>
                  </Col>
                  <Col>
                    <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>Filled</Text>
                    <Text fontSize="T200" fontWeight="bold" color="color.neutral.90" style={{ marginTop: 2 }}>0</Text>
                  </Col>
                  <Col>
                    <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>Auto-healed 24h</Text>
                    <Text fontSize="T200" fontWeight="bold" color="color.green.70" style={{ marginTop: 2 }}>1</Text>
                  </Col>
                  <Col>
                    <Text variant="label-xs" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>Needs human</Text>
                    <Text fontSize="T200" fontWeight="bold" color="color.red.70" style={{ marginTop: 2 }}>1</Text>
                  </Col>
                </Row>
              </Row>
              <Row gridGap="dimensions.spacing.200" style={{ marginTop: token('dimensions.spacing.400') }} alignItems="center" flexWrap="wrap">
                <Button variant={ButtonVariant.Primary}>
                  Needs human only
                </Button>
                <SearchField
                  query=""
                  onChange={() => {}}
                  placeholder="Search by schedule id or site..."
                  width={260}
                />
                <FilterPopover triggerComponent={<FilterChip>Posting status</FilterChip>}>
                  <FilterList
                    options={[
                      { label: 'Posted', value: 'posted' },
                      { label: 'Unposted', value: 'unposted' },
                    ]}
                    titleText="Posting status"
                  />
                </FilterPopover>
                <FilterPopover triggerComponent={<FilterChip>Reason</FilterChip>}>
                  <FilterList
                    options={[
                      { label: 'NHE unavailable', value: 'nhe' },
                      { label: 'Pay mismatch', value: 'pay' },
                      { label: 'Missing venue', value: 'venue' },
                    ]}
                    titleText="Reason"
                  />
                </FilterPopover>
                <Text variant="label-xs" color="color.neutral.60" style={{ marginLeft: 'auto' }}>1 of 4 in scope</Text>
              </Row>
            </View>

            {/* Schedule Health Cards */}
            <View padding="dimensions.spacing.400">
              <Col gridGap="dimensions.spacing.200">
                <Card padding="dimensions.spacing.400" isElevated={true} borderRadius="dimensions.border.radius.200" style={{ border: `1px solid rgba(218, 55, 51, 0.30)` }}>
                  <Col gridGap="dimensions.spacing.300">
                    <Row justifyContent="space-between" alignItems="flex-start" gridGap="dimensions.spacing.300">
                      <Col flex={1} style={{ minWidth: 0 }}>
                        <Row alignItems="center" gridGap="dimensions.spacing.200" flexWrap="wrap">
                          <Text variant="label-xs" color="color.neutral.60" style={{ fontFamily: 'monospace' }}>sch-mnl1-weekend-w26</Text>
                          <span style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(218, 55, 51, 0.1)', color: token('color.red.70'), padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>unposted</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: token('color.surface.bg-muted'), color: token('color.neutral.70'), padding: '2px 8px', borderRadius: 100, fontSize: 11, fontWeight: 500, letterSpacing: '0.04em' }}>NHE unavailable</span>
                          <span style={{ fontSize: 11, fontWeight: 700, background: token('color.neutral.05'), color: token('color.neutral.70'), padding: '2px 6px', borderRadius: 4, letterSpacing: '0.04em' }}>PH</span>
                        </Row>
                        <Text fontSize="T200" fontWeight="bold" color="color.neutral.90" style={{ marginTop: 6 }}>MNL1 · bc-cs</Text>
                        <Text fontSize="T100" color="color.neutral.70" style={{ marginTop: 4 }}>Hire-start 2026-07-01 · Hire-by 2026-06-28 (16d to go) · LO lo-mnl1-cs-q3</Text>
                      </Col>
                      <Button variant={ButtonVariant.Tertiary}>
                        120 applicants
                      </Button>
                    </Row>

                    {/* Auto-heal failed banner */}
                    <View backgroundColor="color.red.05" border={`1px solid rgba(218, 55, 51, 0.20)`} borderRadius="dimensions.border.radius.200" padding="dimensions.spacing.300">
                      <Col gridGap="dimensions.spacing.100">
                        <Text variant="label-xs" fontWeight="bold" color="color.red.70" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          Auto-heal failed · needs human
                        </Text>
                        <Text fontSize="T100" color="color.neutral.90">
                          <strong>What Pere did:</strong> Tried 2x rebooks; weekend agent supply exhausted
                        </Text>
                        <Text fontSize="T100" color="color.neutral.70">
                          NHE_UNAVAILABLE persists
                        </Text>
                        <Row gridGap="dimensions.spacing.100" style={{ marginTop: 4 }} flexWrap="wrap">
                          <Button variant={ButtonVariant.Primary}>
                            Pere · resolve now
                          </Button>
                          <Button variant={ButtonVariant.Tertiary}>
                            See attempt details
                          </Button>
                          <Button variant={ButtonVariant.Tertiary}>
                            Snooze 24h
                          </Button>
                        </Row>
                      </Col>
                    </View>

                    {/* Progress bar */}
                    <Col gridGap="dimensions.spacing.100">
                      <Row justifyContent="space-between" alignItems="baseline">
                        <Text fontSize="T100" color="color.neutral.70">
                          Reserved <Text fontWeight="bold" color="color.neutral.90">8</Text> of 30
                          <Text color="color.neutral.60" style={{ marginLeft: 8 }}>· projected fill at hire-by <Text fontWeight="bold" color="color.red.70">20%</Text></Text>
                        </Text>
                        <Text variant="label-xs" color="color.neutral.60">27% reserved</Text>
                      </Row>
                      <div style={{ height: 8, borderRadius: 100, background: token('color.neutral.05'), overflow: 'hidden', display: 'flex' }}>
                        <div style={{ width: '27%', height: '100%', background: token('color.teal.70') }} />
                      </div>
                    </Col>
                  </Col>
                </Card>
              </Col>
            </View>
          </Col>
        </TabPanel>
      </TabSwitcher>
    </Col>
  );
};
