import { Col, Row } from '@amzn/stencil-react-components/layout';
import { Text } from '@amzn/stencil-react-components/text';
import { Badge, BadgeType } from '@amzn/stencil-react-components/badge';
import { ActionCard, ActionItem } from './ActionCard';

interface ActionColumnProps {
  title: string;
  count: number;
  items: ActionItem[];
  selectedId: string | null;
  onItemClick: (id: string) => void;
  onOpenAgent?: () => void;
}

export const ActionColumn = ({
  title,
  count,
  items,
  selectedId,
  onItemClick,
  onOpenAgent,
}: ActionColumnProps) => {
  return (
    <Col gridGap="dimensions.spacing.200" minWidth={350} flex={1}>
      <Row alignItems="center" gridGap="dimensions.spacing.200">
        <Text fontSize="T100" fontWeight="bold" color="color.neutral.70">
          {title}
        </Text>
        <Badge type={BadgeType.Neutral} value={count} />
      </Row>
      <Col gridGap="dimensions.spacing.200" role="list" aria-label={`${title} actions`}>
        {items.map((item) => (
          <ActionCard
            key={item.id}
            item={item}
            isSelected={selectedId === item.id}
            onClick={onItemClick}
            onOpenAgent={onOpenAgent}
          />
        ))}
      </Col>
    </Col>
  );
};
