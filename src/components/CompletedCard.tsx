import { Row, Col, View } from '@amzn/stencil-react-components/layout';
import { Text } from '@amzn/stencil-react-components/text';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import styled from '@emotion/styled';
import IconCheckCircleFillExtraSmall from '@amzn/stencil-react-icons/icons/icon-check-circle-fill-extra-small';
import IconExternalLinkExtraSmall from '@amzn/stencil-react-icons/icons/icon-external-link-extra-small';
import { ActionItem } from './ActionCard';

const CompletedCardWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  backgroundColor: token('color.status.success-bg'),
  border: `1px solid ${token('color.green.70')}`,
  borderRadius: token('dimensions.border.radius.200'),
  overflow: 'hidden',
});

interface CompletedCardProps {
  item: ActionItem;
  completedDate: string;
}

export const CompletedCard = ({ item, completedDate }: CompletedCardProps) => {
  return (
    <CompletedCardWrapper>
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
          <View
            backgroundColor="color.fill.vibrant.green"
            padding="dimensions.spacing.200"
            borderRadius="dimensions.border.radius.100"
            display="flex"
            alignItems="center"
            justifyContent="center"
            width={32}
            height={32}
          >
            <IconCheckCircleFillExtraSmall aria-hidden="true" color="white" />
          </View>
          <Col gridGap="dimensions.spacing.100" flex={1}>
            <Row gridGap="dimensions.spacing.100" alignItems="center">
              <Text fontSize="T200" color="color.neutral.90">
                {item.title}
              </Text>
              {item.hasExternalLink && (
                <IconExternalLinkExtraSmall aria-hidden="true" />
              )}
            </Row>
            <Row gridGap="dimensions.spacing.100" alignItems="center">
              <Text fontSize="T50" fontWeight="medium" color="color.neutral.70">
                {completedDate}
              </Text>
              {item.secondaryText && (
                <>
                  <View
                    width={2}
                    height={2}
                    borderRadius="50%"
                    backgroundColor="color.neutral.50"
                  />
                  <Text fontSize="T50" fontWeight="medium" color="color.neutral.70">
                    {item.secondaryText}
                  </Text>
                </>
              )}
            </Row>
          </Col>
        </Row>
      </Row>
    </CompletedCardWrapper>
  );
};
