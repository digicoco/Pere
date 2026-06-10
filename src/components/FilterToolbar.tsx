import { useState } from 'react';
import { Row } from '@amzn/stencil-react-components/layout';
import { SearchField } from '@amzn/stencil-react-components/search';
import {
  FilterChip,
  FilterList,
  FilterPopover,
} from '@amzn/stencil-react-components/filtering';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FilterToolbar = ({ searchQuery, onSearchChange }: FilterToolbarProps) => {
  const [agentFilter, setAgentFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>();

  return (
    <Row gridGap="dimensions.spacing.300" alignItems="center" flexWrap="wrap">
      <SearchField
        query={searchQuery}
        onChange={onSearchChange}
        placeholder="Search actions"
        width={300}
      />
      <FilterPopover triggerComponent={<FilterChip>Agent</FilterChip>}>
        <FilterList
          onFilterChange={setAgentFilter}
          options={[
            { label: 'Screening Agent', value: 'screening' },
            { label: 'Scheduling Agent', value: 'scheduling' },
            { label: 'Sourcing Agent', value: 'sourcing' },
            { label: 'Follow-up Agent', value: 'followup' },
          ]}
          titleText="Select an agent"
          value={agentFilter}
        />
      </FilterPopover>
      <FilterPopover triggerComponent={<FilterChip>Priority</FilterChip>}>
        <FilterList
          onFilterChange={setPriorityFilter}
          options={[
            { label: 'High', value: 'high' },
            { label: 'Medium', value: 'medium' },
            { label: 'Low', value: 'low' },
          ]}
          titleText="Select priority"
          value={priorityFilter}
        />
      </FilterPopover>
      <FilterPopover triggerComponent={<FilterChip>Status</FilterChip>}>
        <FilterList
          onFilterChange={setStatusFilter}
          options={[
            { label: 'Pending', value: 'pending' },
            { label: 'In progress', value: 'in-progress' },
            { label: 'Completed', value: 'completed' },
          ]}
          titleText="Select status"
          value={statusFilter}
        />
      </FilterPopover>
    </Row>
  );
};
