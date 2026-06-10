import { Col, Row } from '@amzn/stencil-react-components/layout';
import { Text } from '@amzn/stencil-react-components/text';
import { Badge, BadgeType } from '@amzn/stencil-react-components/badge';
import { ActionCard, ActionItem } from './ActionCard';

interface ActionColumnProps {
  title: string;
  count: number;
  items: ActionItem[];
  selectedItems: Set<string>;
  onSelect: (id: string) => void;
  onItemClick: (id: string) => void;
}

export const ActionColumn = ({
  title,
  count,
  items,
  selectedItems,
  onSelect,
  onItemClick,
}: ActionColumnProps) => {
  return (
    <Col gridGap="dimensions.spacing.300" minWidth={350} flex={1}>
      <Row alignItems="center" gridGap="dimensions.spacing.200">
        <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
          {title}
        </Text>
        <Badge type={BadgeType.Neutral} value={count} />
      </Row>
      <Col gridGap="dimensions.spacing.200" role="list" aria-label={`${title} actions`}>
        {items.map((item) => (
          <ActionCard
            key={item.id}
            item={item}
            isSelected={selectedItems.has(item.id)}
            onSelect={onSelect}
            onClick={onItemClick}
          />
        ))}
      </Col>
    </Col>
  );
};
