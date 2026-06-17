import { Row, Col, View } from '@amzn/stencil-react-components/layout';
import { Text } from '@amzn/stencil-react-components/text';
import { Card } from '@amzn/stencil-react-components/card';
import { Checkbox } from '@amzn/stencil-react-components/checkbox';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import styled from '@emotion/styled';
import IconExternalLinkExtraSmall from '@amzn/stencil-react-icons/icons/icon-external-link-extra-small';
import { withTooltip, TOOLTIP_POSITION } from '@amzn/stencil-react-components/tooltip';
import IconThumbUpExtraSmall from '@amzn/stencil-react-icons/icons/icon-thumb-up-extra-small';
import IconMessageHelpExtraSmall from '@amzn/stencil-react-icons/icons/icon-message-help-extra-small';
import IconBulletedListExtraSmall from '@amzn/stencil-react-icons/icons/icon-bulleted-list-extra-small';
import IconClauseExtraSmall from '@amzn/stencil-react-icons/icons/icon-clause-extra-small';

const OpenAgentButton = styled('button')({
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: 4,
  borderRadius: 4,
  display: 'inline-flex',
  alignItems: 'center',
  color: token('color.neutral.70'),
  '&:hover': {
    backgroundColor: token('color.surface.bg-muted'),
    color: token('color.neutral.90'),
  },
});

const OpenAgentButtonWithTooltip = withTooltip({ position: TOOLTIP_POSITION.BOTTOM })(OpenAgentButton);

export type ActionStatus = 'critical' | 'warning' | 'info';

export interface ActionItem {
  id: string;
  title: string;
  subtitle: string;
  secondaryText?: string;
  status: ActionStatus;
  iconType: 'approval' | 'review' | 'response' | 'task';
  hasExternalLink?: boolean;
}

interface ActionCardProps {
  item: ActionItem;
  isSelected: boolean;
  onClick: (id: string) => void;
  onOpenAgent?: () => void;
}

const statusBackgroundMap: Record<ActionStatus, string> = {
  critical: 'color.status.critical-bg',
  warning: 'color.status.warning-bg',
  info: 'color.status.info-bg',
};

const statusStripColorMap: Record<ActionStatus, string> = {
  critical: token('color.red.10'),
  warning: token('color.yellow.10'),
  info: token('color.blue.10'),
};

const SelectedCardWrapper = styled('div')<{ isSelected: boolean }>(({ isSelected }) => ({
  border: isSelected ? `3px solid ${token('color.blue.70')}` : `1px solid ${token('color.border.primary')}`,
  borderRadius: token('dimensions.border.radius.200'),
  overflow: 'hidden',
  display: 'flex',
  cursor: 'pointer',
  backgroundColor: token('color.surface.bg-default'),
}));

const LeftStrip = styled('div')<{ status: ActionStatus }>(({ status }) => ({
  width: 6,
  alignSelf: 'stretch',
  backgroundColor: statusStripColorMap[status],
}));

const IconForType = ({ type }: { type: ActionItem['iconType'] }) => {
  switch (type) {
    case 'approval':
      return <IconThumbUpExtraSmall aria-hidden="true" />;
    case 'review':
      return <IconClauseExtraSmall aria-hidden="true" />;
    case 'response':
      return <IconMessageHelpExtraSmall aria-hidden="true" />;
    case 'task':
      return <IconBulletedListExtraSmall aria-hidden="true" />;
  }
};

export const ActionCard = ({ item, isSelected, onClick, onOpenAgent }: ActionCardProps) => {
  return (
    <SelectedCardWrapper isSelected={isSelected} onClick={() => onClick(item.id)}>
      {isSelected && <LeftStrip status={item.status} />}
      <Row
        alignItems="center"
        padding={['0', 'dimensions.spacing.250', '0', 'dimensions.spacing.250']}
        flex={1}
      >
        <Row
          gridGap="dimensions.spacing.250"
          alignItems="center"
          flex={1}
          padding={['dimensions.spacing.250', '0']}
        >
          {isSelected ? (
            <View
              backgroundColor="color.fill.neutral.secondary"
              padding="dimensions.spacing.200"
              borderRadius="dimensions.border.radius.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              width={32}
              height={32}
            >
              <Checkbox checked={true} onChange={() => {}} aria-label={`Selected ${item.title}`} />
            </View>
          ) : (
            <View
              backgroundColor={statusBackgroundMap[item.status]}
              padding="dimensions.spacing.200"
              borderRadius="dimensions.border.radius.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              width={32}
              height={32}
            >
              <IconForType type={item.iconType} />
            </View>
          )}
          <Col gridGap="dimensions.spacing.100" flex={1}>
            <Row gridGap="dimensions.spacing.100" alignItems="center">
              <Text fontSize="T200" color="color.neutral.90">
                {item.title}
              </Text>
              {item.hasExternalLink && (
                <OpenAgentButtonWithTooltip
                  tooltipText="Open agent"
                  aria-label="Open agent"
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); onOpenAgent?.(); }}
                >
                  <IconExternalLinkExtraSmall aria-hidden="true" />
                </OpenAgentButtonWithTooltip>
              )}
            </Row>
            <Text fontSize="T50" fontWeight="medium" color="color.neutral.70">
              {item.subtitle}
            </Text>
            {item.secondaryText && (
              <Text fontSize="T50" fontWeight="medium" color="color.neutral.60">
                {item.secondaryText}
              </Text>
            )}
          </Col>
        </Row>
      </Row>
    </SelectedCardWrapper>
  );
};
