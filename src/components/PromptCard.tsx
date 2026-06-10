import { Row, Col, View } from '@amzn/stencil-react-components/layout';
import { Text } from '@amzn/stencil-react-components/text';
import { Card } from '@amzn/stencil-react-components/card';
import { AIIconWrapper } from '@amzn/stencil-react-components/ai';
import IconSparklesMedium from '@amzn/stencil-react-icons/icons/icon-sparkles-medium';

export const PromptCard = () => {
  return (
    <Card padding="dimensions.spacing.300" width="100%">
      <Row alignItems="center" gridGap="dimensions.spacing.300">
        <View
          backgroundColor="color.fill.muted.blue"
          padding="dimensions.spacing.200"
          borderRadius="dimensions.border.radius.200"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <AIIconWrapper>
            <IconSparklesMedium aria-hidden="true" />
          </AIIconWrapper>
        </View>
        <Col gridGap="dimensions.spacing.100">
          <Text fontSize="T200" fontWeight="medium" color="color.neutral.90">
            Get started with your To Do list
          </Text>
          <Text fontSize="T100" color="color.neutral.60">
            Click through your agent's task list.
          </Text>
        </Col>
      </Row>
    </Card>
  );
};
