import { useState } from 'react';
import { Col, Row, View } from '@amzn/stencil-react-components/layout';
import { Text } from '@amzn/stencil-react-components/text';
import { AIIconWrapper } from '@amzn/stencil-react-components/ai';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import { NavPage } from '../App';
import styled from '@emotion/styled';
import IconSparklesSmall from '@amzn/stencil-react-icons/icons/icon-sparkles-small';
import IconLeftPanelOpenSmall from '@amzn/stencil-react-icons/icons/icon-left-panel-open-small';
import IconLeftPanelCloseSmall from '@amzn/stencil-react-icons/icons/icon-left-panel-close-small';
import IconLeftAlignmentSmall from '@amzn/stencil-react-icons/icons/icon-left-alignment-small';
import IconPeopleSmall from '@amzn/stencil-react-icons/icons/icon-people-small';
import IconFolderSmall from '@amzn/stencil-react-icons/icons/icon-folder-small';
import IconClauseSmall from '@amzn/stencil-react-icons/icons/icon-clause-small';
import IconJobsSmall from '@amzn/stencil-react-icons/icons/icon-jobs-small';
import IconClockSmall from '@amzn/stencil-react-icons/icons/icon-clock-small';
import IconCalendarSmall from '@amzn/stencil-react-icons/icons/icon-calendar-small';
import IconChipSmall from '@amzn/stencil-react-icons/icons/icon-chip-small';
import IconRuleSmall from '@amzn/stencil-react-icons/icons/icon-rule-small';

const NavItemWrapper = styled('div')({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  '&:hover .nav-tooltip': {
    opacity: 1,
    pointerEvents: 'auto',
    transform: 'translateX(0)',
  },
});

const NavItem = styled('button')<{ isActive?: boolean }>(({ isActive }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: `${token('dimensions.spacing.200')} ${token('dimensions.spacing.100')}`,
  border: 'none',
  borderRadius: token('dimensions.border.radius.100'),
  backgroundColor: isActive ? token('color.surface.bg-muted') : 'transparent',
  cursor: 'pointer',
  color: token('color.neutral.90'),
  gap: token('dimensions.spacing.100'),
  transition: 'background-color 150ms ease',
  '&:hover': {
    backgroundColor: token('color.action.utility.bg-hover'),
  },
  '&:active': {
    backgroundColor: token('color.action.utility.bg-pressed'),
  },
}));

const Tooltip = styled('div')({
  position: 'absolute',
  left: '100%',
  marginLeft: token('dimensions.spacing.200'),
  padding: token('dimensions.spacing.200'),
  backgroundColor: token('color.surface.bg-default'),
  border: `1px solid ${token('color.border.primary')}`,
  borderRadius: token('dimensions.border.radius.200'),
  boxShadow: `0px 1px 10px ${token('color.gradient.elevation')}`,
  whiteSpace: 'nowrap',
  fontSize: 14,
  color: token('color.neutral.90'),
  opacity: 0,
  pointerEvents: 'none',
  transform: 'translateX(-4px)',
  transition: 'opacity 150ms ease, transform 150ms ease',
  zIndex: 100,
});

const ExpandedPanel = styled('div')<{ isOpen: boolean }>(({ isOpen }) => ({
  position: 'fixed',
  top: 63,
  left: 88,
  width: 275,
  bottom: 0,
  backgroundColor: token('color.surface.bg-default'),
  borderRight: `1px solid ${token('color.border.primary')}`,
  boxShadow: `4px 0 16px ${token('color.gradient.elevation')}`,
  zIndex: 50,
  transform: isOpen ? 'translateX(0)' : 'translateX(-275px)',
  transition: 'transform 200ms ease',
  overflowY: 'auto',
}));

const ExpandedNavItem = styled('button')<{ isActive?: boolean }>(({ isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: token('dimensions.spacing.200'),
  width: '100%',
  height: 48,
  padding: `0 ${token('dimensions.spacing.300')}`,
  border: 'none',
  borderRadius: token('dimensions.border.radius.100'),
  backgroundColor: isActive ? token('color.surface.bg-muted') : 'transparent',
  cursor: 'pointer',
  color: token('color.neutral.90'),
  fontSize: 16,
  textAlign: 'left',
  transition: 'background-color 150ms ease',
  '&:hover': {
    backgroundColor: token('color.action.utility.bg-hover'),
  },
}));

const Overlay = styled('div')<{ isOpen: boolean }>(({ isOpen }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'transparent',
  zIndex: 49,
  display: isOpen ? 'block' : 'none',
}));

interface NavButtonProps {
  label: string;
  isActive?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavButton = ({ label, isActive, children, onClick }: NavButtonProps) => (
  <NavItemWrapper>
    <NavItem isActive={isActive} aria-label={label} onClick={onClick}>
      {children}
      <Text variant="label-xs" color="color.neutral.90" textAlign="center">
        {label}
      </Text>
    </NavItem>
  </NavItemWrapper>
);

export const CollapsedSideNav = ({ activePage, onNavigate }: { activePage: NavPage; onNavigate: (page: NavPage) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNav = (page: NavPage) => {
    onNavigate(page);
    setIsExpanded(false);
  };

  return (
    <>
      <View
        backgroundColor="color.surface.bg-default"
        width={88}
        height="100%"
        borderRight={`1px solid ${token('color.border.primary')}`}
        style={{ position: 'fixed', top: 63, left: 0, bottom: 0, zIndex: 60 }}
      >
        <Col padding="dimensions.spacing.200" gridGap="dimensions.spacing.50">
          <NavItemWrapper>
            <NavItem onClick={() => setIsExpanded(!isExpanded)} aria-label={isExpanded ? 'Close menu' : 'Open menu'}>
              {isExpanded
                ? <IconLeftPanelCloseSmall aria-hidden="true" />
                : <IconLeftPanelOpenSmall aria-hidden="true" />
              }
            </NavItem>
            {!isExpanded && <Tooltip className="nav-tooltip">Open menu</Tooltip>}
          </NavItemWrapper>
          {!isExpanded && (
            <>
              <NavButton label="Copilot" isActive={activePage === 'copilot'} onClick={() => handleNav('copilot')}>
                <AIIconWrapper>
                  <IconSparklesSmall aria-hidden="true" />
                </AIIconWrapper>
              </NavButton>
              <NavButton label="Insights" isActive={activePage === 'insights'} onClick={() => handleNav('insights')}>
                <View style={{ transform: 'rotate(-90deg)' }}>
                  <IconLeftAlignmentSmall aria-hidden="true" />
                </View>
              </NavButton>
              <NavButton label="People" isActive={activePage === 'people'} onClick={() => handleNav('people')}>
                <IconPeopleSmall aria-hidden="true" />
              </NavButton>
              <NavButton label="Labor orders" isActive={activePage === 'labor-orders'} onClick={() => handleNav('labor-orders')}>
                <IconFolderSmall aria-hidden="true" />
              </NavButton>
              <NavButton label="Applications" isActive={activePage === 'applications'} onClick={() => handleNav('applications')}>
                <IconClauseSmall aria-hidden="true" />
              </NavButton>
              <NavButton label="Jobs" isActive={activePage === 'jobs' || activePage === 'schedules'} onClick={() => handleNav('jobs')}>
                <IconJobsSmall aria-hidden="true" />
              </NavButton>
              <NavButton label="Appointments" isActive={activePage === 'appointments'} onClick={() => handleNav('appointments')}>
                <IconCalendarSmall aria-hidden="true" />
              </NavButton>
              <NavButton label="Agents" isActive={activePage === 'agents'} onClick={() => handleNav('agents')}>
                <IconChipSmall aria-hidden="true" />
              </NavButton>
              <NavButton label="Workflows" isActive={activePage === 'workflows'} onClick={() => handleNav('workflows')}>
                <IconRuleSmall aria-hidden="true" />
              </NavButton>
            </>
          )}
        </Col>
      </View>

      <Overlay isOpen={isExpanded} onClick={() => setIsExpanded(false)} />

      <ExpandedPanel isOpen={isExpanded}>
        <Col padding="dimensions.spacing.200">
          <Row
            alignItems="center"
            justifyContent="space-between"
            padding={['dimensions.spacing.200', 'dimensions.spacing.300']}
            height={48}
          >
            <Text fontSize="T300" fontWeight="bold" color="color.neutral.90">
              Menu
            </Text>
          </Row>

          <ExpandedNavItem isActive={activePage === 'copilot'} onClick={() => handleNav('copilot')}>
            <AIIconWrapper>
              <IconSparklesSmall aria-hidden="true" />
            </AIIconWrapper>
            Copilot
          </ExpandedNavItem>
          <ExpandedNavItem isActive={activePage === 'insights'} onClick={() => handleNav('insights')}>
            <View style={{ transform: 'rotate(-90deg)' }}>
              <IconLeftAlignmentSmall aria-hidden="true" />
            </View>
            Insights
          </ExpandedNavItem>
          <ExpandedNavItem isActive={activePage === 'people'} onClick={() => handleNav('people')}>
            <IconPeopleSmall aria-hidden="true" />
            People
          </ExpandedNavItem>
          <ExpandedNavItem isActive={activePage === 'labor-orders'} onClick={() => handleNav('labor-orders')}>
            <IconFolderSmall aria-hidden="true" />
            Labor orders
          </ExpandedNavItem>
          <ExpandedNavItem isActive={activePage === 'applications'} onClick={() => handleNav('applications')}>
            <IconClauseSmall aria-hidden="true" />
            Applications
          </ExpandedNavItem>
          <ExpandedNavItem isActive={activePage === 'jobs' || activePage === 'schedules'} onClick={() => handleNav('jobs')}>
            <IconJobsSmall aria-hidden="true" />
            Jobs
          </ExpandedNavItem>
          <ExpandedNavItem isActive={activePage === 'appointments'} onClick={() => handleNav('appointments')}>
            <IconCalendarSmall aria-hidden="true" />
            Appointments
          </ExpandedNavItem>
          <ExpandedNavItem isActive={activePage === 'agents'} onClick={() => handleNav('agents')}>
            <IconChipSmall aria-hidden="true" />
            Agents
          </ExpandedNavItem>
          <ExpandedNavItem isActive={activePage === 'workflows'} onClick={() => handleNav('workflows')}>
            <IconRuleSmall aria-hidden="true" />
            Workflows
          </ExpandedNavItem>
        </Col>
      </ExpandedPanel>
    </>
  );
};
