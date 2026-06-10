import { useState } from 'react';
import { Row, Col, View } from '@amzn/stencil-react-components/layout';
import { Text } from '@amzn/stencil-react-components/text';
import { Checkbox } from '@amzn/stencil-react-components/checkbox';
import { Card } from '@amzn/stencil-react-components/card';
import { Chip, ChipSize } from '@amzn/stencil-react-components/chip';
import IconChevronRightSmall from '@amzn/stencil-react-icons/icons/icon-chevron-right-small';

export interface ActionItem {
  id: string;
  title: string;
  agent: string;
  priority?: 'high' | 'medium' | 'low';
  dueLabel?: string;
}

interface ActionCardProps {
  item: ActionItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onClick: (id: string) => void;
}

export const ActionCard = ({ item, isSelected, onSelect, onClick }: ActionCardProps) => {
  return (
    <Card padding="dimensions.spacing.300" width="100%">
      <Row alignItems="center" gridGap="dimensions.spacing.300" width="100%">
        <View onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <Checkbox
            checked={isSelected}
            onChange={() => onSelect(item.id)}
            aria-label={`Select ${item.title}`}
          />
        </View>
        <Col
          flex={1}
          gridGap="dimensions.spacing.100"
          onClick={() => onClick(item.id)}
          style={{ cursor: 'pointer' }}
        >
          <Text fontSize="T200" fontWeight="medium" color="color.neutral.90">
            {item.title}
          </Text>
          <Row gridGap="dimensions.spacing.200" alignItems="center">
            <Text fontSize="T100" color="color.neutral.60">
              {item.agent}
            </Text>
            {item.dueLabel && (
              <Chip size={ChipSize.ExtraSmall}>{item.dueLabel}</Chip>
            )}
          </Row>
        </Col>
        <View
          onClick={() => onClick(item.id)}
          style={{ cursor: 'pointer' }}
          color="color.neutral.50"
        >
          <IconChevronRightSmall aria-hidden="true" />
        </View>
      </Row>
    </Card>
  );
};
