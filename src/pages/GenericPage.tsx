import { Col, View } from '@amzn/stencil-react-components/layout';
import { H1 } from '@amzn/stencil-react-components/text';

interface GenericPageProps {
  title: string;
}

export const GenericPage = ({ title }: GenericPageProps) => {
  return (
    <Col flex={1} backgroundColor="color.surface.bg-default">
      <View padding="dimensions.spacing.400">
        <H1>{title}</H1>
      </View>
    </Col>
  );
};
