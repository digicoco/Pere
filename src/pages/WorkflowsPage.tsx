import { useState, useRef } from 'react';
import { Col, Row, View } from '@amzn/stencil-react-components/layout';
import { H1, Text } from '@amzn/stencil-react-components/text';
import { Button, ButtonVariant } from '@amzn/stencil-react-components/button';
import { CreateFlowPage } from './CreateFlowPage';
import { Card } from '@amzn/stencil-react-components/card';
import { Badge } from '@amzn/stencil-react-components/badge';
import { TabBar, TabSwitcher, TabPanel, useTabs } from '@amzn/stencil-react-components/tabs';
import { SearchField } from '@amzn/stencil-react-components/search';
import { FilterChip, FilterList, FilterPopover } from '@amzn/stencil-react-components/filtering';
import { PopoverController, PopoverPosition } from '@amzn/stencil-react-components/popover';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import styled from '@emotion/styled';
import IconMoreVerticalSmall from '@amzn/stencil-react-icons/icons/icon-more-vertical-small';
import IconAppsSmall from '@amzn/stencil-react-icons/icons/icon-apps-small';
import IconBulletedListSmall from '@amzn/stencil-react-icons/icons/icon-bulleted-list-small';

interface Flow {
  id: string;
  title: string;
  description: string;
  owner: string;
  users: number;
  runs: number;
  updated: string;
}

const mockFlows: Flow[] = [
  { id: '1', title: 'Felix - Filter Executive Leadership Inbox Expert', description: 'Processes Outlook emails and Slack messages to categorize and summarize communications into Operations, Safety, People, Reports, Process...', owner: 'Dhanveer Dhaliwal', users: 4, runs: 83, updated: 'Just now' },
  { id: '2', title: 'Recovery and Writeoff Rate Callouts Report Compiler', description: 'Automatically compiles weekly chat agent responses and sends comprehensive reports via email', owner: 'Javier Segura', users: 4, runs: 8, updated: '3 minutes ago' },
  { id: '3', title: 'Random Quote Slack Messenger', description: 'Generate inspirational random quotes and automatically send them via Slack messages to boost team morale', owner: 'Mudit Singh Bisht', users: 2, runs: 3, updated: '24 minutes ago' },
  { id: '4', title: 'Expansions Flash Report Generator', description: 'Automated bi-weekly Flash Report generator for AEE SysDev Expansion team. Generates executive summary, Firefly and ACS design/implementation...', owner: 'Shivam Sharma', users: 26, runs: 217, updated: '36 minutes ago' },
  { id: '5', title: 'Page 0 Insights Generator', description: "A quick example of Amazon Quick Flows' capabilities", owner: 'Thithiksha J', users: 40, runs: 314, updated: '47 minutes ago' },
  { id: '6', title: 'AI Tool Request Review Flow Copy2', description: 'Processes AI tool requests by collecting submission details, comparing against existing tools using AI Tool Registry agent, and posting review results to...', owner: 'Jose Jimenez', users: 4, runs: 100, updated: '52 minutes ago' },
  { id: '7', title: 'Q-GAP Agent Metrics Analyzer', description: 'Analyze Q-GAP submissions to extract agent IDs and retrieve comprehensive weekly metrics data from QuickSight dashboards', owner: 'Aidan Grealish', users: 2, runs: 18, updated: '1 hour ago' },
  { id: '8', title: '1:1 Dashboard Insights Report', description: 'Generate comprehensive weekly reports with insights and tables from multiple dashboards and automatically send to email recipients', owner: 'Noel Quirke', users: 12, runs: 13, updated: '1 hour ago' },
  { id: '9', title: 'APEX Asana Roadmap Wiki Sync', description: 'Automatically synchronizes APEX project roadmap data from Asana to company wiki for centralized documentation', owner: 'Rimi Chatterjee', users: 4, runs: 18, updated: '1 hour ago' },
];

const FlowCardGrid = styled('div')<{ viewMode?: 'grid' | 'list' }>(({ viewMode }) => ({
  display: 'grid',
  gridTemplateColumns: viewMode === 'list' ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))',
  gap: token('dimensions.spacing.300'),
}));

const MoreButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  borderRadius: token('dimensions.border.radius.100'),
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  color: token('color.neutral.70'),
  flexShrink: 0,
  '&:hover': {
    backgroundColor: token('color.surface.bg-muted'),
    color: token('color.neutral.90'),
  },
});

const ViewToggle = styled('button')<{ isActive?: boolean }>(({ isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: token('dimensions.border.radius.100'),
  border: `1px solid ${isActive ? token('color.action.primary.bg-default') : token('color.border.primary')}`,
  background: isActive ? token('color.action.utility.bg-hover') : 'transparent',
  cursor: 'pointer',
  color: isActive ? token('color.action.primary.bg-default') : token('color.neutral.70'),
}));

const MenuList = styled('ul')({
  listStyle: 'none',
  margin: 0,
  padding: `${token('dimensions.spacing.200')} 0`,
  minWidth: 160,
});

const MenuItem = styled('li')({
  padding: `${token('dimensions.spacing.200')} ${token('dimensions.spacing.300')}`,
  fontSize: 14,
  color: token('color.text.primary'),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: token('color.surface.bg-muted'),
  },
});

export const WorkflowsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateFlow, setShowCreateFlow] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const tabs = [
    { label: 'Flow library', value: 'library' },
    { label: 'Triggers', value: 'triggers' },
    { label: 'Pending approval', value: 'pending' },
  ];

  const { tabBarProps, tabSwitcherProps } = useTabs({ tabs, defaultTab: 'library' });

  if (showCreateFlow) {
    return <CreateFlowPage onBack={() => setShowCreateFlow(false)} />;
  }

  return (
    <Col flex={1} backgroundColor="color.surface.bg-default">
      <View padding={['dimensions.spacing.400', 'dimensions.spacing.400', 'dimensions.spacing.200']}>
        <H1>Workflows</H1>
      </View>
      <Row
        alignItems="center"
        justifyContent="space-between"
        padding={['dimensions.spacing.200', 'dimensions.spacing.400', 'dimensions.spacing.300']}
      >
        <Row alignItems="center" gridGap="dimensions.spacing.300">
          <TabBar {...tabBarProps} />
          <Badge type="primary" value={0} />
        </Row>
        <Button variant={ButtonVariant.Primary} onClick={() => setShowCreateFlow(true)}>
          Create flow
        </Button>
      </Row>

      <TabSwitcher {...tabSwitcherProps}>
        <TabPanel value="library">
          <Col padding={['0', 'dimensions.spacing.400', 'dimensions.spacing.400']} gridGap="dimensions.spacing.300">
            <Row alignItems="center" justifyContent="space-between" gridGap="dimensions.spacing.300">
              <Row gridGap="dimensions.spacing.200" alignItems="center" flex={1}>
                <SearchField
                  query={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search"
                  width={200}
                />
                <FilterPopover triggerComponent={<FilterChip>Show: All flows</FilterChip>}>
                  <FilterList
                    options={[
                      { label: 'All flows', value: 'all' },
                      { label: 'My flows', value: 'mine' },
                      { label: 'Shared with me', value: 'shared' },
                    ]}
                    titleText="Show"
                  />
                </FilterPopover>
                <FilterPopover triggerComponent={<FilterChip>Sort: Last updated (most recent)</FilterChip>}>
                  <FilterList
                    options={[
                      { label: 'Last updated (most recent)', value: 'updated-desc' },
                      { label: 'Last updated (oldest)', value: 'updated-asc' },
                      { label: 'Name (A-Z)', value: 'name-asc' },
                      { label: 'Most runs', value: 'runs' },
                    ]}
                    titleText="Sort by"
                  />
                </FilterPopover>
              </Row>
              <Row gridGap="dimensions.spacing.100">
                <ViewToggle isActive={viewMode === 'grid'} onClick={() => setViewMode('grid')} aria-label="Grid view">
                  <IconAppsSmall aria-hidden="true" />
                </ViewToggle>
                <ViewToggle isActive={viewMode === 'list'} onClick={() => setViewMode('list')} aria-label="List view">
                  <IconBulletedListSmall aria-hidden="true" />
                </ViewToggle>
              </Row>
            </Row>

            <FlowCardGrid viewMode={viewMode}>
              {mockFlows.map((flow) => (
                <Card key={flow.id} padding="dimensions.spacing.300" flexDirection="column">
                  <Col gridGap="dimensions.spacing.200" flex={1}>
                    <Row alignItems="flex-start" justifyContent="space-between" gridGap="dimensions.spacing.200">
                      <Text fontSize="T200" fontWeight="bold" color="color.neutral.90" style={{ lineHeight: 1.4 }}>
                        {flow.title}
                      </Text>
                      <MoreButton
                        aria-label={`Actions for ${flow.title}`}
                        ref={(el: HTMLButtonElement | null) => { menuRefs.current[flow.id] = el; }}
                        onClick={() => setOpenMenuId(openMenuId === flow.id ? null : flow.id)}
                      >
                        <IconMoreVerticalSmall aria-hidden="true" />
                      </MoreButton>
                      <PopoverController
                        target={menuRefs.current[flow.id]}
                        isOpen={openMenuId === flow.id}
                        close={() => setOpenMenuId(null)}
                        position={PopoverPosition.BottomTrailing}
                        shouldFocusOnOpen={true}
                      >
                        <MenuList role="menu">
                          <MenuItem role="menuitem" onClick={() => setOpenMenuId(null)}>
                            Edit flow
                          </MenuItem>
                          <MenuItem role="menuitem" onClick={() => setOpenMenuId(null)}>
                            Delete flow
                          </MenuItem>
                        </MenuList>
                      </PopoverController>
                    </Row>
                    <Text fontSize="T100" color="color.neutral.70" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {flow.description}
                    </Text>
                  </Col>
                  <Col gridGap="dimensions.spacing.100" style={{ marginTop: token('dimensions.spacing.300') }}>
                    <Text variant="label-xs" color="color.neutral.70">
                      Owner: {flow.owner}
                    </Text>
                    <Row alignItems="center" justifyContent="space-between">
                      <Text variant="label-xs" color="color.neutral.60">
                        {flow.users} users · {flow.runs} runs
                      </Text>
                      <Text variant="label-xs" color="color.neutral.60">
                        Updated: {flow.updated}
                      </Text>
                    </Row>
                  </Col>
                </Card>
              ))}
            </FlowCardGrid>
          </Col>
        </TabPanel>

        <TabPanel value="triggers">
          <Col padding="dimensions.spacing.400">
            <Text fontSize="T200" color="color.neutral.60">
              Configured triggers for your flows will appear here.
            </Text>
          </Col>
        </TabPanel>

        <TabPanel value="pending">
          <Col padding="dimensions.spacing.400">
            <Text fontSize="T200" color="color.neutral.60">
              Flows pending your approval will appear here.
            </Text>
          </Col>
        </TabPanel>
      </TabSwitcher>
    </Col>
  );
};
