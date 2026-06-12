import { useState } from 'react';
import { Col, Row, View } from '@amzn/stencil-react-components/layout';
import { H1, Text } from '@amzn/stencil-react-components/text';
import { Table, TableSpacing } from '@amzn/stencil-react-components/table';
import { SearchField } from '@amzn/stencil-react-components/search';
import { FilterChip, FilterList, FilterPopover } from '@amzn/stencil-react-components/filtering';
import { Button, ButtonVariant } from '@amzn/stencil-react-components/button';
import { Pagination } from '@amzn/stencil-react-components/pagination';
import { AIIconWrapper } from '@amzn/stencil-react-components/ai';
import IconSparklesMedium from '@amzn/stencil-react-icons/icons/icon-sparkles-medium';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import styled from '@emotion/styled';

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

export const laborOrderSuggestionsList = [
  { title: '2 venues missing appointment slots — Manila-BGC has 0 for tomorrow', metadata: 'Critical · Cebu-IT: 3 remaining Thu-Fri' },
  { title: 'MNL1 Regular Full-Time projected to miss headcount by 14%', metadata: 'Urgent · 0/180 filled · Start Jun 4' },
  { title: '4 labor orders in Error status need resolution', metadata: 'Blocking · LO-PH-0000213, LO-PH-0000228, +2' },
];

const mockLaborOrders = [
  { id: 'LO-PH-0100002', site: 'MNL1', employmentType: 'Regular', scheduleType: 'Full-Time', startDate: '2026-06-04', headcount: 180, filled: '0 / 180', lastModified: '2026-05-27', status: 'Posted' },
  { id: 'LO-PH-0100003', site: 'MNL1', employmentType: 'Regular', scheduleType: 'Full-Time', startDate: '2026-06-11', headcount: 120, filled: '0 / 120', lastModified: '2026-05-26', status: 'At risk' },
  { id: 'LO-PH-0100004', site: 'CEB1', employmentType: 'Regular', scheduleType: 'Full-Time', startDate: '2026-06-11', headcount: 100, filled: '0 / 100', lastModified: '2026-05-27', status: 'Posted' },
  { id: 'LO-PH-0000201', site: 'CEB1', employmentType: 'Seasonal', scheduleType: 'Part-Time', startDate: '2026-06-07', headcount: 37, filled: '0 / 37', lastModified: '2026-05-24', status: 'Unposted' },
  { id: 'LO-PH-0000204', site: 'MNL1', employmentType: 'Seasonal', scheduleType: 'Full-Time', startDate: '2026-06-28', headcount: 88, filled: '0 / 88', lastModified: '2026-05-15', status: 'Filled' },
  { id: 'LO-PH-0000207', site: 'CEB1', employmentType: 'Seasonal', scheduleType: 'Part-Time', startDate: '2026-07-19', headcount: 139, filled: '0 / 139', lastModified: '2026-05-06', status: 'At risk' },
  { id: 'LO-PH-0000210', site: 'MNL1', employmentType: 'Seasonal', scheduleType: 'Full-Time', startDate: '2026-06-10', headcount: 190, filled: '0 / 190', lastModified: '2026-05-27', status: 'Posted' },
  { id: 'LO-PH-0000213', site: 'CEB1', employmentType: 'Seasonal', scheduleType: 'Part-Time', startDate: '2026-07-01', headcount: 61, filled: '0 / 61', lastModified: '2026-05-18', status: 'Error' },
  { id: 'LO-PH-0000216', site: 'MNL1', employmentType: 'Seasonal', scheduleType: 'Full-Time', startDate: '2026-07-22', headcount: 112, filled: '0 / 112', lastModified: '2026-05-09', status: 'Unposted' },
  { id: 'LO-PH-0000219', site: 'CEB1', employmentType: 'Seasonal', scheduleType: 'Part-Time', startDate: '2026-06-13', headcount: 163, filled: '0 / 163', lastModified: '2026-04-30', status: 'Filled' },
];

const columns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Site', accessor: 'site' },
  { header: 'Employment type', accessor: 'employmentType' },
  { header: 'Schedule type', accessor: 'scheduleType' },
  { header: 'Start date', accessor: 'startDate' },
  { header: 'Headcount', accessor: 'headcount' },
  { header: 'Filled / Demand', accessor: 'filled' },
  { header: 'Last modified', accessor: 'lastModified' },
  { header: 'Status', accessor: 'status' },
];

export const LaborOrdersPage = ({ onReview, completedTasks }: { onReview?: (msg: string) => void; completedTasks?: Set<string> }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSuggestions = laborOrderSuggestionsList.filter(s => !completedTasks?.has(s.title));

  return (
    <Col flex={1} backgroundColor="color.surface.bg-default" style={{ minWidth: 0, overflow: 'hidden' }}>
      <View padding={['dimensions.spacing.400', 'dimensions.spacing.400', 'dimensions.spacing.200']}>
        <Row alignItems="center" justifyContent="space-between">
          <Col>
            <H1>Labor orders</H1>
            <Text fontSize="T200" color="color.neutral.70">
              <Text fontWeight="bold" color="color.neutral.90">50</Text> labor orders
            </Text>
          </Col>
          <Button variant={ButtonVariant.Primary}>Create labor order</Button>
        </Row>
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
            <Button variant={ButtonVariant.Tertiary}>
              View all ({filteredSuggestions.length})
            </Button>
          </Row>
          <Row gridGap="dimensions.spacing.300" flexWrap="wrap">
            {filteredSuggestions.map((suggestion, i) => (
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
            placeholder="Search by LO ID, site, role, or shift"
            width={360}
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
                { label: 'At risk', value: 'at-risk' },
                { label: 'Error', value: 'error' },
              ]}
              titleText="Select status"
            />
          </FilterPopover>
        </Row>
      </View>

      <View padding={['0', 'dimensions.spacing.400']} flex={1} style={{ minWidth: 0 }}>
        <FullWidthTableWrapper>
          <Table
            aria-label="Labor orders"
            columns={columns}
            data={mockLaborOrders}
            spacing={TableSpacing.Reduced}
            shouldScrollHorizontally={false}
          />
        </FullWidthTableWrapper>
      </View>

      <Row padding="dimensions.spacing.300" justifyContent="center" alignItems="center" gridGap="dimensions.spacing.300">
        <Pagination
          numberOfPages={3}
          onPageSelect={setCurrentPage}
          selectedPage={currentPage}
        />
        <Text fontSize="T100" color="color.neutral.60">
          Showing 20 of 50
        </Text>
      </Row>
    </Col>
  );
};
