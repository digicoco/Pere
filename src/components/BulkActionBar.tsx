import { Row } from '@amzn/stencil-react-components/layout';
import { Text } from '@amzn/stencil-react-components/text';
import { Button, ButtonVariant } from '@amzn/stencil-react-components/button';

interface BulkActionBarProps {
  selectedCount: number;
  onComplete: () => void;
  onDismiss: () => void;
  onClearSelection: () => void;
}

export const BulkActionBar = ({
  selectedCount,
  onComplete,
  onDismiss,
  onClearSelection,
}: BulkActionBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <Row
      alignItems="center"
      gridGap="dimensions.spacing.300"
      padding="dimensions.spacing.300"
      backgroundColor="color.status.info-bg"
      borderRadius="dimensions.border.radius.200"
    >
      <Text fontSize="T200" fontWeight="medium" color="color.neutral.90">
        {selectedCount} {selectedCount === 1 ? 'action' : 'actions'} selected
      </Text>
      <Row gridGap="dimensions.spacing.200" flex={1} justifyContent="flex-end">
        <Button variant={ButtonVariant.Tertiary} onClick={onClearSelection}>
          Clear
        </Button>
        <Button variant={ButtonVariant.Tertiary} onClick={onDismiss}>
          Dismiss
        </Button>
        <Button variant={ButtonVariant.Primary} onClick={onComplete}>
          Complete
        </Button>
      </Row>
    </Row>
  );
};
