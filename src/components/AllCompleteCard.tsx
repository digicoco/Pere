import { Row, Col, View } from '@amzn/stencil-react-components/layout';
import { Text } from '@amzn/stencil-react-components/text';
import { AIIconWrapper } from '@amzn/stencil-react-components/ai';
import IconSparklesMedium from '@amzn/stencil-react-icons/icons/icon-sparkles-medium';
import styled from '@emotion/styled';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';

const GradientPanel = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  minHeight: 400,
  padding: token('dimensions.spacing.400'),
  borderRadius: token('dimensions.border.radius.300'),
  backgroundImage: `linear-gradient(257deg, rgba(215, 235, 251, 0.2) 22%, rgba(229, 200, 247, 0.2) 128%)`,
  width: '100%',
});

export const AllCompleteCard = () => {
  return (
    <GradientPanel>
      <Row alignItems="center" gridGap="dimensions.spacing.200">
        <View padding="dimensions.spacing.200">
          <AIIconWrapper fill="color.gradient.action.default">
            <IconSparklesMedium aria-hidden="true" />
          </AIIconWrapper>
        </View>
        <Col>
          <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
            Great job!
          </Text>
          <Text fontSize="T100" color="color.neutral.90">
            All your agent tasks are complete.
          </Text>
        </Col>
      </Row>
    </GradientPanel>
  );
};
