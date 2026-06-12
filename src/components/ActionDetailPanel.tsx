import { Col, Row, View } from '@amzn/stencil-react-components/layout';
import { Text, H3 } from '@amzn/stencil-react-components/text';
import { Button, ButtonVariant } from '@amzn/stencil-react-components/button';
import { Card } from '@amzn/stencil-react-components/card';
import { StatusIndicator, Status } from '@amzn/stencil-react-components/status-indicator';
import { ActionItem, ActionStatus } from './ActionCard';
import IconExternalLinkExtraSmall from '@amzn/stencil-react-icons/icons/icon-external-link-extra-small';

const statusMap: Record<ActionStatus, typeof Status[keyof typeof Status]> = {
  critical: Status.Negative,
  warning: Status.Warning,
  info: Status.Information,
};

const statusLabelMap: Record<ActionStatus, string> = {
  critical: 'Needs immediate action',
  warning: 'Needs attention',
  info: 'For your review',
};

interface ActionDetailPanelProps {
  item: ActionItem;
  onComplete: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const ActionDetailPanel = ({ item, onComplete, onDismiss }: ActionDetailPanelProps) => {
  return (
    <Card padding="dimensions.spacing.400" width="100%">
      <Col gridGap="dimensions.spacing.300">
        <StatusIndicator
          status={statusMap[item.status]}
          messageText={statusLabelMap[item.status]}
        />

        <H3>{item.title}</H3>

        <Col gridGap="dimensions.spacing.200">
          <Row gridGap="dimensions.spacing.100" alignItems="center">
            <Text fontSize="T100" color="color.neutral.70">
              {item.subtitle}
            </Text>
            {item.secondaryText && (
              <>
                <View
                  width={2}
                  height={2}
                  borderRadius="50%"
                  backgroundColor="color.neutral.50"
                />
                <Text fontSize="T100" color="color.neutral.70">
                  {item.secondaryText}
                </Text>
              </>
            )}
          </Row>

          {item.hasExternalLink && (
            <Row gridGap="dimensions.spacing.100" alignItems="center">
              <Text fontSize="T100" color="color.blue.70" fontWeight="medium">
                Open in source
              </Text>
              <IconExternalLinkExtraSmall aria-hidden="true" />
            </Row>
          )}
        </Col>

        <View padding={['dimensions.spacing.300', '0', '0', '0']}>
          <Row gridGap="dimensions.spacing.200">
            <Button variant={ButtonVariant.Primary} onClick={() => onComplete(item.id)}>
              Complete
            </Button>
            <Button variant={ButtonVariant.Tertiary} onClick={() => onDismiss(item.id)}>
              Dismiss
            </Button>
          </Row>
        </View>
      </Col>
    </Card>
  );
};
