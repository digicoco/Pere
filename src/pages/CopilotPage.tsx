import { useState } from 'react';
import { Col, Row, View, Spacer } from '@amzn/stencil-react-components/layout';
import { H2 } from '@amzn/stencil-react-components/text';
import { TabBar, TabSwitcher, TabPanel, useTabs } from '@amzn/stencil-react-components/tabs';
import { Pagination } from '@amzn/stencil-react-components/pagination';
import { CopilotHeader } from '../components/CopilotHeader';
import { FilterToolbar } from '../components/FilterToolbar';
import { ActionColumn } from '../components/ActionColumn';
import { PromptCard } from '../components/PromptCard';
import { BulkActionBar } from '../components/BulkActionBar';
import { dueSoonActions } from '../data/mockActions';

export const CopilotPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const tabs = [
    { label: 'Actions', value: 'actions' },
    { label: 'History', value: 'history' },
  ];

  const { tabBarProps, tabSwitcherProps } = useTabs({
    tabs,
    defaultTab: 'actions',
  });

  const handleSelect = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleItemClick = (id: string) => {
    console.log('Open action:', id);
  };

  const handleBulkComplete = () => {
    setSelectedItems(new Set());
  };

  const handleBulkDismiss = () => {
    setSelectedItems(new Set());
  };

  const handleClearSelection = () => {
    setSelectedItems(new Set());
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

            <BulkActionBar
              selectedCount={selectedItems.size}
              onComplete={handleBulkComplete}
              onDismiss={handleBulkDismiss}
              onClearSelection={handleClearSelection}
            />

            <Row gridGap="dimensions.spacing.400" flexWrap="wrap" alignItems="flex-start">
              <ActionColumn
                title="Due soon"
                count={dueSoonActions.length}
                items={dueSoonActions}
                selectedItems={selectedItems}
                onSelect={handleSelect}
                onItemClick={handleItemClick}
              />

              <Col gridGap="dimensions.spacing.300" flex={1} minWidth={300}>
                <PromptCard />
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
          <Col padding="dimensions.spacing.400">
            <Row>
              <View padding="dimensions.spacing.400">
                <H2>No history yet</H2>
              </View>
            </Row>
          </Col>
        </TabPanel>
      </TabSwitcher>
    </Col>
  );
};
