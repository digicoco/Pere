import { useState, useRef } from 'react';
import { Col, Row, View } from '@amzn/stencil-react-components/layout';
import { H1, Text } from '@amzn/stencil-react-components/text';
import { Button, ButtonVariant } from '@amzn/stencil-react-components/button';
import { Card } from '@amzn/stencil-react-components/card';
import { Chip, ChipSize } from '@amzn/stencil-react-components/chip';
import { TabBar, TabSwitcher, TabPanel, useTabs } from '@amzn/stencil-react-components/tabs';
import { SearchField } from '@amzn/stencil-react-components/search';
import { FilterChip, FilterList, FilterPopover } from '@amzn/stencil-react-components/filtering';
import { ToggleSwitch } from '@amzn/stencil-react-components/toggle-switch';
import { InputWrapper, LabelPosition } from '@amzn/stencil-react-components/input';
import { PopoverController, PopoverPosition } from '@amzn/stencil-react-components/popover';
import { withTooltip, TOOLTIP_POSITION } from '@amzn/stencil-react-components/tooltip';
import IconCheckCircleFillExtraSmall from '@amzn/stencil-react-icons/icons/icon-check-circle-fill-extra-small';
import IconAlertCircleExtraSmall from '@amzn/stencil-react-icons/icons/icon-alert-circle-extra-small';
import IconPauseExtraSmall from '@amzn/stencil-react-icons/icons/icon-pause-extra-small';
import IconMoreVerticalSmall from '@amzn/stencil-react-icons/icons/icon-more-vertical-small';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import styled from '@emotion/styled';
import { CreateAgentPage } from './CreateAgentPage';

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

const IconButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: token('dimensions.border.radius.100'),
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  color: token('color.neutral.70'),
  '&:hover': {
    backgroundColor: token('color.surface.bg-muted'),
    color: token('color.neutral.90'),
  },
});

const IconButtonWithTooltip = withTooltip({ position: TOOLTIP_POSITION.BOTTOM })(IconButton);

type AgentStatus = 'running' | 'error' | 'warning' | 'paused';

interface Agent {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: AgentStatus;
  lastRun: string;
  createdBy: string;
  isRunning: boolean;
}

const mockAgents: Agent[] = [
  { id: '1', title: 'Badge Photo Validator', description: 'Monitors PHA submissions and flags photos with low IVV confidence scores for recruiter review.', tags: ['PHA', 'IVV'], status: 'running', lastRun: 'Last run 2h ago', createdBy: 'System', isRunning: true },
  { id: '2', title: 'Rehire Eligibility Checker', description: 'Scans returning candidate applications and auto-resolves clear rehire cases, escalates ambiguous ones.', tags: ['Rehire', 'Compliance'], status: 'running', lastRun: 'Last run 1h ago', createdBy: 'System', isRunning: true },
  { id: '3', title: 'Document Collection Monitor', description: 'Tracks EDM uploads and alerts when gating documents are pending beyond SLA threshold.', tags: ['EDM', 'Compliance'], status: 'error', lastRun: 'Error 45m ago', createdBy: 'travwid@', isRunning: true },
  { id: '4', title: 'Appointment Slot Planner', description: 'Forecasts candidate demand and recommends slot availability across venues for next 5 business days.', tags: ['Scheduling', 'Capacity'], status: 'warning', lastRun: 'Last run 30m ago', createdBy: 'System', isRunning: true },
  { id: '5', title: 'Medical Records Follower', description: 'Sends automated follow-ups to candidates and clinics when medical results are overdue.', tags: ['Medical', 'PH-CS'], status: 'paused', lastRun: 'Paused 3d ago', createdBy: 'digicoco@', isRunning: false },
  { id: '6', title: 'No-Show Resolution Agent', description: 'Detects unresolved past appointments and suggests outcomes based on Connect session data.', tags: ['Appointments', 'Connect'], status: 'paused', lastRun: 'Paused 1w ago', createdBy: 'digicoco@', isRunning: false },
];

const statusIconMap: Record<AgentStatus, React.ReactNode> = {
  running: <IconCheckCircleFillExtraSmall aria-hidden="true" color="white" />,
  error: <IconAlertCircleExtraSmall aria-hidden="true" />,
  warning: <IconAlertCircleExtraSmall aria-hidden="true" />,
  paused: <IconPauseExtraSmall aria-hidden="true" />,
};

const statusBgMap: Record<AgentStatus, string> = {
  running: 'color.status.success-bg',
  error: 'color.status.critical-bg',
  warning: 'color.status.warning-bg',
  paused: 'color.fill.neutral.secondary',
};

export const AgentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [agents, setAgents] = useState(mockAgents);
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const tabs = [
    { label: 'All agents', value: 'all' },
    { label: 'My agents', value: 'mine' },
    { label: 'Shared', value: 'shared' },
  ];

  const { tabBarProps, tabSwitcherProps } = useTabs({ tabs, defaultTab: 'all' });

  const toggleAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRunning: !a.isRunning, status: a.isRunning ? 'paused' : 'running' } : a))
    );
  };

  if (showCreateAgent) {
    return <CreateAgentPage onBack={() => setShowCreateAgent(false)} />;
  }

  return (
    <Col flex={1} backgroundColor="color.surface.bg-default">
      <Row
        alignItems="center"
        justifyContent="space-between"
        padding={['dimensions.spacing.300', 'dimensions.spacing.400']}
        borderBottom="1px solid var(--st-dt-color-border-primary)"
      >
        <H1>Agents</H1>
        <Button variant={ButtonVariant.Primary} onClick={() => setShowCreateAgent(true)}>Create agent</Button>
      </Row>

      <Col padding="dimensions.spacing.400" gridGap="dimensions.spacing.300">
        <TabBar {...tabBarProps} />

        <TabSwitcher {...tabSwitcherProps}>
          <TabPanel value="all">
            <Col gridGap="dimensions.spacing.300">
              <Row gridGap="dimensions.spacing.300" alignItems="center" flexWrap="wrap">
                <SearchField
                  query={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search agents"
                  width={300}
                />
                <FilterPopover triggerComponent={<FilterChip>All categories</FilterChip>}>
                  <FilterList
                    options={[
                      { label: 'PHA', value: 'pha' },
                      { label: 'Compliance', value: 'compliance' },
                      { label: 'Scheduling', value: 'scheduling' },
                      { label: 'Medical', value: 'medical' },
                    ]}
                    titleText="Select category"
                  />
                </FilterPopover>
                <FilterPopover triggerComponent={<FilterChip>Any status</FilterChip>}>
                  <FilterList
                    options={[
                      { label: 'Running', value: 'running' },
                      { label: 'Paused', value: 'paused' },
                      { label: 'Error', value: 'error' },
                    ]}
                    titleText="Select status"
                  />
                </FilterPopover>
                <FilterPopover triggerComponent={<FilterChip>Any approval mode</FilterChip>}>
                  <FilterList
                    options={[
                      { label: 'Auto-approve', value: 'auto' },
                      { label: 'Manual review', value: 'manual' },
                    ]}
                    titleText="Select approval mode"
                  />
                </FilterPopover>
              </Row>

              <Col gridGap="dimensions.spacing.200">
                {agents.map((agent) => (
                  <Card key={agent.id} padding="dimensions.spacing.300" width="100%">
                    <Row alignItems="flex-start" gridGap="dimensions.spacing.300" width="100%">
                      <View
                        backgroundColor={statusBgMap[agent.status]}
                        padding="dimensions.spacing.200"
                        borderRadius="dimensions.border.radius.100"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        width={32}
                        height={32}
                        style={{ flexShrink: 0 }}
                      >
                        {statusIconMap[agent.status]}
                      </View>
                      <Col flex={1} gridGap="dimensions.spacing.100" style={{ minWidth: 0 }}>
                        <Row gridGap="dimensions.spacing.300" alignItems="center">
                          <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
                            {agent.title}
                          </Text>
                          <Row gridGap="dimensions.spacing.200">
                            {agent.tags.map((tag) => (
                              <Chip key={tag} size={ChipSize.ExtraSmall}>{tag}</Chip>
                            ))}
                          </Row>
                        </Row>
                        <Text fontSize="T100" color="color.neutral.70">
                          {agent.description}
                        </Text>
                        <Row gridGap="dimensions.spacing.100" alignItems="center">
                          <Text variant="label-xs" color="color.neutral.70">
                            {agent.lastRun}
                          </Text>
                          <View width={2} height={2} borderRadius="50%" backgroundColor="color.neutral.50" />
                          <Text variant="label-xs" color="color.neutral.70">
                            {agent.createdBy}
                          </Text>
                        </Row>
                      </Col>
                      <Row alignItems="center" gridGap="dimensions.spacing.300" style={{ flexShrink: 0 }}>
                        <InputWrapper id={`toggle-${agent.id}`} labelText={agent.isRunning ? 'Running' : 'Paused'} labelPosition={LabelPosition.Leading}>
                          {(inputProps) => (
                            <ToggleSwitch
                              {...inputProps}
                              checked={agent.isRunning}
                              onChange={() => toggleAgent(agent.id)}
                            />
                          )}
                        </InputWrapper>
                        <IconButtonWithTooltip
                          tooltipText="Actions"
                          aria-label="Actions"
                          ref={(el: HTMLButtonElement | null) => { menuRefs.current[agent.id] = el; }}
                          onClick={() => setOpenMenuId(openMenuId === agent.id ? null : agent.id)}
                        >
                          <IconMoreVerticalSmall aria-hidden="true" />
                        </IconButtonWithTooltip>
                        <PopoverController
                          target={menuRefs.current[agent.id]}
                          isOpen={openMenuId === agent.id}
                          close={() => setOpenMenuId(null)}
                          position={PopoverPosition.BottomTrailing}
                          shouldFocusOnOpen={true}
                        >
                          <MenuList role="menu">
                            <MenuItem role="menuitem" onClick={() => { setOpenMenuId(null); setShowCreateAgent(true); }}>
                              Edit agent
                            </MenuItem>
                            <MenuItem role="menuitem" onClick={() => { setOpenMenuId(null); setAgents(prev => prev.filter(a => a.id !== agent.id)); }}>
                              Delete agent
                            </MenuItem>
                          </MenuList>
                        </PopoverController>
                      </Row>
                    </Row>
                  </Card>
                ))}
              </Col>
            </Col>
          </TabPanel>

          <TabPanel value="mine">
            <Col padding="dimensions.spacing.400">
              <Text fontSize="T200" color="color.neutral.60">
                Your personal agents will appear here.
              </Text>
            </Col>
          </TabPanel>

          <TabPanel value="shared">
            <Col padding="dimensions.spacing.400">
              <Text fontSize="T200" color="color.neutral.60">
                Shared team agents will appear here.
              </Text>
            </Col>
          </TabPanel>
        </TabSwitcher>
      </Col>
    </Col>
  );
};
