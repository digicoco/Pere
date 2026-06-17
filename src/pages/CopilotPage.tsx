import { useState } from 'react';
import { Col, Row, View, Spacer } from '@amzn/stencil-react-components/layout';
import { H2, H3, Text } from '@amzn/stencil-react-components/text';
import { TabBar, TabSwitcher, TabPanel, useTabs } from '@amzn/stencil-react-components/tabs';
import { Pagination } from '@amzn/stencil-react-components/pagination';
import { SearchField } from '@amzn/stencil-react-components/search';
import { FilterChip, FilterList, FilterPopover } from '@amzn/stencil-react-components/filtering';
import { CopilotHeader } from '../components/CopilotHeader';
import { FilterToolbar } from '../components/FilterToolbar';
import { ActionColumn } from '../components/ActionColumn';
import { PromptCard } from '../components/PromptCard';
import { AllCompleteCard } from '../components/AllCompleteCard';
import { SinglePromptPanel } from '../components/SinglePromptPanel';
import { MultiPromptPanel } from '../components/MultiPromptPanel';
import { CompletedCard } from '../components/CompletedCard';
import { ActionItem } from '../components/ActionCard';
import { dueSoonActions as initialActions } from '../data/mockActions';

interface CompletedAction {
  item: ActionItem;
  completedDate: string;
}

export const CopilotPage = ({ onOpenPhotoGrid }: { onOpenPhotoGrid?: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [actions, setActions] = useState<ActionItem[]>(initialActions);
  const [completedActions, setCompletedActions] = useState<CompletedAction[]>([]);

  const tabs = [
    { label: 'Actions', value: 'actions' },
    { label: 'History', value: 'history' },
  ];

  const { tabBarProps, tabSwitcherProps } = useTabs({
    tabs,
    defaultTab: 'actions',
  });

  const handleItemClick = (id: string) => {
    setSelectedActionId((prev) => (prev === id ? null : id));
  };

  const handleComplete = (id: string) => {
    const action = actions.find((a) => a.id === id);
    if (action) {
      const now = new Date();
      const dateStr = `Completed ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      setCompletedActions((prev) => [{ item: action, completedDate: dateStr }, ...prev]);

      const remainingActions = actions.filter((a) => a.id !== id);
      setActions(remainingActions);

      // Auto-advance to next action in list
      if (remainingActions.length > 0) {
        const currentIndex = actions.findIndex((a) => a.id === id);
        const nextIndex = Math.min(currentIndex, remainingActions.length - 1);
        setSelectedActionId(remainingActions[nextIndex].id);
      } else {
        setSelectedActionId(null);
      }
    }
  };

  const selectedAction = actions.find((a) => a.id === selectedActionId) || null;

  const mockSubPrompts = [
    {
      id: 'sub-1',
      title: 'Badge Photo: Maria Santos',
      description: 'Confidence score 62%. Background not uniform — appears to be taken in a dimly lit room. Face + neck visible.',
      tags: ['IVV-Low', 'PHA-Batch'],
    },
    {
      id: 'sub-2',
      title: 'Badge Photo: Juan Reyes',
      description: 'Confidence score 58%. Partial face occlusion detected — candidate wearing cap. Real-time capture confirmed.',
      tags: ['IVV-Low', 'PHA-Batch'],
    },
    {
      id: 'sub-3',
      title: 'Badge Photo: Ana Cruz',
      description: 'Confidence score 65%. Image slightly blurry. White background confirmed. Full face visible.',
      tags: ['IVV-Low', 'PHA-Batch'],
    },
  ];

  const renderDetailPanel = () => {
    // All tasks complete
    if (actions.length === 0) return <AllCompleteCard />;

    // No selection - show default prompt
    if (!selectedAction) return <PromptCard />;

    if (selectedAction.iconType === 'approval') {
      return (
        <MultiPromptPanel
          item={selectedAction}
          subPrompts={mockSubPrompts}
          onApproveAll={handleComplete}
          onApproveOne={(subId) => console.log('Approved sub:', subId)}
          onOpenPhotoGrid={onOpenPhotoGrid}
        />
      );
    }

    return (
      <SinglePromptPanel
        item={selectedAction}
        onComplete={handleComplete}
      />
    );
  };

  return (
    <Col flex={1} backgroundColor="color.surface.bg-default">
      <CopilotHeader />

      <View padding={[0, 'dimensions.spacing.400']}>
        <Row alignItems="center" gridGap="dimensions.spacing.300">
          <H2>Digest</H2>
          <TabBar {...tabBarProps} />
        </Row>
      </View>

      <TabSwitcher {...tabSwitcherProps}>
        <TabPanel value="actions">
          <Col padding="dimensions.spacing.400" gridGap="dimensions.spacing.400" flex={1}>
            <FilterToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            <Row gridGap="dimensions.spacing.400" flexWrap="wrap" alignItems="flex-start">
              <ActionColumn
                title="Due soon"
                count={actions.length}
                items={actions}
                selectedId={selectedActionId}
                onItemClick={handleItemClick}
              />

              <Col gridGap="dimensions.spacing.300" flex={1} minWidth={300}>
                {renderDetailPanel()}
              </Col>
            </Row>

            <Spacer flex={1} />

            <Row justifyContent="flex-start" alignItems="center">
              <Pagination
                numberOfPages={5}
                onPageSelect={setCurrentPage}
                selectedPage={currentPage}
              />
            </Row>
          </Col>
        </TabPanel>

        <TabPanel value="history">
          <Col padding="dimensions.spacing.400" gridGap="dimensions.spacing.400">
            <Row gridGap="dimensions.spacing.300" alignItems="center" flexWrap="wrap">
              <SearchField
                query={historySearchQuery}
                onChange={setHistorySearchQuery}
                placeholder="Search history"
                width={300}
              />
              <FilterPopover triggerComponent={<FilterChip>For</FilterChip>}>
                <FilterList
                  options={[
                    { label: 'Me', value: 'me' },
                    { label: 'My team', value: 'team' },
                  ]}
                  titleText="Filter by assignee"
                />
              </FilterPopover>
              <FilterPopover triggerComponent={<FilterChip>Completed date</FilterChip>}>
                <FilterList
                  options={[
                    { label: 'Today', value: 'today' },
                    { label: 'This week', value: 'week' },
                    { label: 'This month', value: 'month' },
                  ]}
                  titleText="Filter by date"
                />
              </FilterPopover>
              <FilterPopover triggerComponent={<FilterChip>Type</FilterChip>}>
                <FilterList
                  options={[
                    { label: 'Approval', value: 'approval' },
                    { label: 'Review', value: 'review' },
                    { label: 'Response', value: 'response' },
                    { label: 'Task', value: 'task' },
                  ]}
                  titleText="Filter by type"
                />
              </FilterPopover>
            </Row>

            <Col gridGap="dimensions.spacing.200">
              <H3>Completed</H3>
              {completedActions.length === 0 ? (
                <View padding="dimensions.spacing.400">
                  <Text fontSize="T200" color="color.neutral.60">
                    No completed actions yet. Complete actions from the Actions tab to see them here.
                  </Text>
                </View>
              ) : (
                <Col gridGap="dimensions.spacing.200" role="list" aria-label="Completed actions">
                  {completedActions.map((ca, index) => (
                    <CompletedCard
                      key={`${ca.item.id}-${index}`}
                      item={ca.item}
                      completedDate={ca.completedDate}
                    />
                  ))}
                </Col>
              )}
            </Col>
          </Col>
        </TabPanel>
      </TabSwitcher>
    </Col>
  );
};
