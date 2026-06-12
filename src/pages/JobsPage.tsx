import { useState } from 'react';
import { Col, Row, View } from '@amzn/stencil-react-components/layout';
import { H1, Text } from '@amzn/stencil-react-components/text';
import { Button, ButtonVariant } from '@amzn/stencil-react-components/button';
import { Table, TableSpacing } from '@amzn/stencil-react-components/table';
import { SearchField } from '@amzn/stencil-react-components/search';
import { FilterChip, FilterList, FilterPopover } from '@amzn/stencil-react-components/filtering';
import { TabBar, TabSwitcher, TabPanel, useTabs } from '@amzn/stencil-react-components/tabs';
import { Pagination } from '@amzn/stencil-react-components/pagination';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import styled from '@emotion/styled';
import IconPlusSmall from '@amzn/stencil-react-icons/icons/icon-plus-small';
import { SchedulesPage } from './SchedulesPage';

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

const mockJobs = [
  {
    id: 'job-mnl1-csa-voice',
    role: 'CS Associate — Voice (MNL1)',
    sites: 'MNL1',
    employmentType: 'Regular',
    scheduleType: 'Full-Time',
    hc: 265,
    laborDemandFilled: '154 / 265',
    startDateFilled: 157,
    startDate: '2026-06-08',
    status: 'Active',
  },
  {
    id: 'job-mnl1-csa-chat',
    role: 'CS Associate — Chat & Email (MNL1)',
    sites: 'MNL1',
    employmentType: 'Regular',
    scheduleType: 'Full-Time',
    hc: 165,
    laborDemandFilled: '77 / 165',
    startDateFilled: 84,
    startDate: '2026-06-11',
    status: 'Active',
  },
  {
    id: 'job-ceb1-csa-voice',
    role: 'CS Associate — Voice (CEB1)',
    sites: 'CEB1',
    employmentType: 'Regular',
    scheduleType: 'Full-Time',
    hc: 135,
    laborDemandFilled: '77 / 135',
    startDateFilled: 83,
    startDate: '2026-06-13',
    status: 'Active',
  },
];

const columns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Role', accessor: 'role' },
  { header: 'Sites', accessor: 'sites' },
  { header: 'Employment type', accessor: 'employmentType' },
  { header: 'Schedule type', accessor: 'scheduleType' },
  { header: 'HC', accessor: 'hc' },
  { header: 'Labor demand filled', accessor: 'laborDemandFilled' },
  { header: 'Start-date filled', accessor: 'startDateFilled' },
  { header: 'Start date', accessor: 'startDate' },
  { header: 'Status', accessor: 'status' },
];

export const JobsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const tabs = [
    { label: 'Jobs', value: 'jobs' },
    { label: 'Schedules', value: 'schedules' },
    { label: 'Schedule health', value: 'health' },
  ];

  const { tabBarProps, tabSwitcherProps } = useTabs({ tabs, defaultTab: 'jobs' });

  return (
    <Col flex={1} backgroundColor="color.surface.bg-default" style={{ minWidth: 0, overflow: 'hidden' }}>
      {/* Page Header */}
      <View padding={['dimensions.spacing.400', 'dimensions.spacing.400', 'dimensions.spacing.200']}>
        <Row alignItems="flex-end" justifyContent="space-between">
          <Col>
            <H1>Jobs</H1>
            <Text fontSize="T200" color="color.neutral.70">
              <Text fontWeight="bold" color="color.neutral.90">3</Text> jobs
            </Text>
          </Col>
          <Button variant={ButtonVariant.Primary}>
            Create new job
          </Button>
        </Row>
      </View>

      {/* Tab Bar */}
      <View padding={['0', 'dimensions.spacing.400']} borderBottom={`1px solid ${token('color.border.primary')}`}>
        <TabBar {...tabBarProps} />
      </View>

      <TabSwitcher {...tabSwitcherProps}>
        <TabPanel value="jobs">
          {/* Filter Bar */}
          <View padding={['dimensions.spacing.200', 'dimensions.spacing.400', 'dimensions.spacing.300']}>
            <Row gridGap="dimensions.spacing.200" alignItems="center" flexWrap="wrap">
              <SearchField
                query={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by job ID, role, or site..."
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
                    { label: 'Active', value: 'active' },
                    { label: 'Closed', value: 'closed' },
                    { label: 'Draft', value: 'draft' },
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
                aria-label="Jobs"
                columns={columns}
                data={mockJobs}
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
              Showing 3 of 3
            </Text>
          </Row>
        </TabPanel>

        <TabPanel value="schedules">
          <SchedulesPage />
        </TabPanel>

        <TabPanel value="health">
          <View padding="dimensions.spacing.400">
            <Text fontSize="T200" color="color.neutral.70">
              Schedule health metrics and operations dashboard will appear here.
            </Text>
          </View>
        </TabPanel>
      </TabSwitcher>
    </Col>
  );
};
