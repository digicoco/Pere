import { useState } from 'react';
import { Col, Row, View } from '@amzn/stencil-react-components/layout';
import { H1, Text } from '@amzn/stencil-react-components/text';
import { Table, TableSpacing } from '@amzn/stencil-react-components/table';
import { SearchField } from '@amzn/stencil-react-components/search';
import { FilterChip, FilterList, FilterPopover } from '@amzn/stencil-react-components/filtering';
import { Button, ButtonVariant } from '@amzn/stencil-react-components/button';
import { Pagination } from '@amzn/stencil-react-components/pagination';
import { AIIconWrapper } from '@amzn/stencil-react-components/ai';
import { Card } from '@amzn/stencil-react-components/card';
import IconSparklesMedium from '@amzn/stencil-react-icons/icons/icon-sparkles-medium';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import styled from '@emotion/styled';

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

const AiSuggestionCard = styled('div')({
  background: `linear-gradient(257deg, rgba(215, 235, 251, 0.2) 22%, rgba(229, 200, 247, 0.2) 128%)`,
  border: `1px solid ${token('color.border.primary')}`,
  borderRadius: 16,
  flex: '1 1 360px',
  minWidth: 320,
  display: 'flex',
  alignItems: 'center',
  gap: token('dimensions.spacing.250'),
  padding: `${token('dimensions.spacing.250')} ${token('dimensions.spacing.300')}`,
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

interface AiSuggestion {
  title: string;
  metadata: string;
}

export const applicationSuggestions: AiSuggestion[] = [
  { title: '15 documents awaiting review — 4 are gating candidate progress', metadata: 'Urgent · 4 gating · Oldest 6h ago' },
  { title: '8 applications awaiting manual rehire eligibility approval', metadata: 'Urgent · 3 potential duplicates · Longest wait 2d' },
  { title: '9 applications missing medical check records — 4 blocking Day 1', metadata: 'Soon · 5 appointments 3+ days ago · +4 blocking' },
  { title: '12 badge photos awaiting approval — 5 low-confidence scores', metadata: 'Urgent · Oldest 3h 42m ago · PHA batch' },
  { title: '23 pre-hire appointments today — next starts in 22m', metadata: 'Now · 2 candidates missing required documents' },
  { title: '7 past appointments need status update — blocking reschedule', metadata: 'Overdue · 3 from yesterday · 4 from today' },
  { title: '2 venues missing appointment slots — Manila-BGC has 0 for tomorrow', metadata: 'Critical · Cebu-IT: 3 remaining Thu-Fri' },
  { title: '6 candidates need medical follow-up — clinics haven\'t returned results', metadata: 'Soon · 4 blocking Day 1 · Appointments 3+ days past' },
];

const mockApplications = [
  { appId: 'APP-001', scheduleId: 'sch-ph-cs-day-736', jobId: 'job-mnl1-cs-89', site: 'MNL1', hrAction: 'Pending decision', step: 'Appointment complete', candidateId: 'CAND-001', firstName: 'Maria', lastName: 'Santos', appointment: '2026-06-16', lastModified: '2026-06-16', created: '2026-06-13', country: 'PH', active: true },
  { appId: 'APP-002', scheduleId: 'sch-ph-cs-night-735', jobId: 'job-mnl1-cs-89', site: 'MNL1', hrAction: 'Pre-start in progress', step: 'BGC pending', candidateId: 'CAND-002', firstName: 'Juan', lastName: 'Dela Cruz', appointment: '2026-06-10', lastModified: '2026-06-14', created: '2026-06-08', country: 'PH', active: true },
  { appId: 'APP-003', scheduleId: 'sch-ph-cs-mid-734', jobId: 'job-ceb1-cs-89', site: 'CEB1', hrAction: 'Offer pending', step: 'Offer extended', candidateId: 'CAND-003', firstName: 'Ana', lastName: 'Reyes', appointment: '2026-06-12', lastModified: '2026-06-14', created: '2026-06-10', country: 'PH', active: true },
  { appId: 'APP-004', scheduleId: 'sch-ph-cs-day-733', jobId: 'job-mnl1-cs-89', site: 'MNL1', hrAction: 'Medical pending', step: 'Medical scheduled', candidateId: 'CAND-004', firstName: 'Paolo', lastName: 'Garcia', appointment: '2026-06-15', lastModified: '2026-06-15', created: '2026-06-05', country: 'PH', active: true },
  { appId: 'APP-005', scheduleId: 'sch-ph-cs-day-732', jobId: 'job-ceb1-cs-89', site: 'CEB1', hrAction: 'Task blocked', step: 'Badge photo rejected', candidateId: 'CAND-005', firstName: 'Carla', lastName: 'Mendoza', appointment: '--', lastModified: '2026-06-14', created: '2026-06-09', country: 'PH', active: true },
  { appId: 'APP-006', scheduleId: 'sch-ph-cs-night-731', jobId: 'job-mnl1-cs-89', site: 'MNL1', hrAction: 'No-show', step: 'Reschedule needed', candidateId: 'CAND-006', firstName: 'Ramon', lastName: 'Torres', appointment: '2026-06-16', lastModified: '2026-06-16', created: '2026-06-06', country: 'PH', active: true },
  { appId: 'APP-007', scheduleId: 'sch-ph-cs-day-730', jobId: 'job-mnl1-cs-89', site: 'MNL1', hrAction: 'Day 1 ready', step: 'Complete', candidateId: 'CAND-007', firstName: 'Sofia', lastName: 'Flores', appointment: '2026-06-09', lastModified: '2026-06-15', created: '2026-05-28', country: 'PH', active: true },
  { appId: 'APP-008', scheduleId: 'sch-ph-cs-mid-729', jobId: 'job-ceb1-cs-89', site: 'CEB1', hrAction: 'Eval pending', step: 'Under review', candidateId: 'CAND-008', firstName: 'Bea', lastName: 'Aquino', appointment: '--', lastModified: '2026-06-16', created: '2026-06-15', country: 'PH', active: true },
  { appId: 'APP-009', scheduleId: 'sch-ph-cs-day-728', jobId: 'job-mnl1-cs-89', site: 'MNL1', hrAction: 'Eval pending', step: 'Applied today', candidateId: 'CAND-009', firstName: 'Diego', lastName: 'Ignacio', appointment: '--', lastModified: '2026-06-16', created: '2026-06-16', country: 'PH', active: true },
  { appId: 'APP-010', scheduleId: 'sch-ph-cs-night-727', jobId: 'job-ceb1-cs-89', site: 'CEB1', hrAction: 'Offer accepted', step: 'Pre-start tasks', candidateId: 'CAND-010', firstName: 'Liam', lastName: 'Santos', appointment: '2026-06-07', lastModified: '2026-06-13', created: '2026-06-01', country: 'PH', active: true },
];

const columns = [
  { header: 'Application ID', accessor: 'appId' },
  { header: 'Schedule ID', accessor: 'scheduleId' },
  { header: 'Job ID', accessor: 'jobId' },
  { header: 'Site', accessor: 'site' },
  { header: 'HR action', accessor: 'hrAction' },
  { header: 'Step', accessor: 'step' },
  { header: 'Candidate ID', accessor: 'candidateId' },
  { header: 'First name', accessor: 'firstName' },
  { header: 'Last name', accessor: 'lastName' },
  { header: 'Appointment', accessor: 'appointment' },
  { header: 'Last modified', accessor: 'lastModified' },
  { header: 'Created', accessor: 'created' },
  { header: 'Country', accessor: 'country' },
];

export const ApplicationsPage = ({ onReview, completedTasks }: { onReview?: (msg: string) => void; completedTasks?: Set<string> }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  const filteredSuggestions = applicationSuggestions.filter(s => !completedTasks?.has(s.title));
  const visibleSuggestions = showAllSuggestions ? filteredSuggestions : filteredSuggestions.slice(0, 3);

  return (
    <Col flex={1} backgroundColor="color.surface.bg-default">
      <View padding={['dimensions.spacing.400', 'dimensions.spacing.400', 'dimensions.spacing.200']}>
        <H1>Applications</H1>
        <Text fontSize="T200" color="color.neutral.70">
          One row per application record. <Text fontWeight="bold" color="color.neutral.90">147</Text> applications
        </Text>
      </View>

      {filteredSuggestions.length > 0 && (
      <View padding={['dimensions.spacing.200', 'dimensions.spacing.400', 'dimensions.spacing.300']}>
        <Col gridGap="dimensions.spacing.250">
          <Row alignItems="center" justifyContent="space-between">
            <Row gridGap="dimensions.spacing.200" alignItems="center">
              <AIIconWrapper fill="color.gradient.action.default">
                <IconSparklesMedium aria-hidden="true" />
              </AIIconWrapper>
              <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
                Copilot suggests
              </Text>
            </Row>
            <Button variant={ButtonVariant.Tertiary} onClick={() => setShowAllSuggestions(!showAllSuggestions)}>
              {showAllSuggestions ? 'Show less' : `View all (${filteredSuggestions.length})`}
            </Button>
          </Row>
          <Row gridGap="dimensions.spacing.300" flexWrap="wrap">
            {visibleSuggestions.map((suggestion, i) => (
              <AiSuggestionCard key={i}>
                <AIIconWrapper fill="color.gradient.action.default">
                  <IconSparklesMedium aria-hidden="true" />
                </AIIconWrapper>
                <Col flex={1} gridGap="dimensions.spacing.100" style={{ minWidth: 0 }}>
                  <Text fontSize="T100" fontWeight="bold" color="color.neutral.90" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {suggestion.title}
                  </Text>
                  <Text variant="label-xs" color="color.neutral.70">
                    {suggestion.metadata}
                  </Text>
                </Col>
                <ReviewButton onClick={() => onReview?.(suggestion.title)}>
                  <AIIconWrapper fill="color.gradient.action.default">
                    <IconSparklesMedium aria-hidden="true" style={{ width: 14, height: 14 }} />
                  </AIIconWrapper>
                  <span style={{ background: `linear-gradient(133deg, ${token('color.purple.70')} 7%, ${token('color.blue.60')} 133%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Review
                  </span>
                </ReviewButton>
              </AiSuggestionCard>
            ))}
          </Row>
        </Col>
      </View>
      )}

      <View padding={['dimensions.spacing.200', 'dimensions.spacing.400', 'dimensions.spacing.300']}>
        <Row gridGap="dimensions.spacing.200" alignItems="center" flexWrap="wrap">
          <SearchField
            query={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by app ID, candidate ID, job ID, or name"
            width={400}
          />
          <FilterPopover triggerComponent={<FilterChip>Step</FilterChip>}>
            <FilterList
              options={[
                { label: 'Welcome', value: 'welcome' },
                { label: 'Review & submit', value: 'review' },
                { label: 'BGC', value: 'bgc' },
              ]}
              titleText="Select step"
            />
          </FilterPopover>
          <FilterPopover triggerComponent={<FilterChip>HR action</FilterChip>}>
            <FilterList
              options={[
                { label: 'Eval pending', value: 'eval-pending' },
                { label: 'Ready to hire', value: 'ready' },
                { label: 'On hold', value: 'on-hold' },
              ]}
              titleText="Select HR action"
            />
          </FilterPopover>
          <FilterPopover triggerComponent={<FilterChip>Site</FilterChip>}>
            <FilterList
              options={[
                { label: 'MNL1', value: 'mnl1' },
                { label: 'CEB1', value: 'ceb1' },
              ]}
              titleText="Select site"
            />
          </FilterPopover>
          <FilterPopover triggerComponent={<FilterChip>Country</FilterChip>}>
            <FilterList
              options={[
                { label: 'PH', value: 'ph' },
                { label: 'US', value: 'us' },
              ]}
              titleText="Select country"
            />
          </FilterPopover>
          <FilterPopover triggerComponent={<FilterChip>Status</FilterChip>}>
            <FilterList
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ]}
              titleText="Select status"
            />
          </FilterPopover>
        </Row>
      </View>

      <View padding={['0', 'dimensions.spacing.400']} flex={1} style={{ minWidth: 0 }}>
        <FullWidthTableWrapper>
          <Table
            aria-label="Applications"
            columns={columns}
            data={mockApplications}
            spacing={TableSpacing.Reduced}
            shouldScrollHorizontally={false}
          />
        </FullWidthTableWrapper>
      </View>

      <Row padding="dimensions.spacing.300" justifyContent="center" alignItems="center" gridGap="dimensions.spacing.300">
        <Pagination
          numberOfPages={8}
          onPageSelect={setCurrentPage}
          selectedPage={currentPage}
        />
        <Text fontSize="T100" color="color.neutral.60">
          Showing 20 of 147
        </Text>
      </Row>
    </Col>
  );
};
