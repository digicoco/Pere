import { Col, Row, View } from '@amzn/stencil-react-components/layout';
import { H1, Text } from '@amzn/stencil-react-components/text';
import styled from '@emotion/styled';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';

const HeroBanner = styled('div')({
  position: 'relative',
  backgroundColor: token('color.fill.muted.blue'),
  borderRadius: token('dimensions.border.radius.300'),
  overflow: 'hidden',
  minHeight: 174,
  display: 'flex',
  alignItems: 'center',
});

const IllustrationContainer = styled('div')({
  position: 'absolute',
  right: 0,
  bottom: 0,
  height: '100%',
  display: 'flex',
  alignItems: 'flex-end',
});

const HeroImage = styled('img')({
  height: '140%',
  objectFit: 'contain',
  objectPosition: 'bottom right',
});

export const CopilotHeader = () => {
  return (
    <View padding="dimensions.spacing.400">
      <H1 padding={['0', '0', 'dimensions.spacing.300', '0']}>Copilot</H1>
      <HeroBanner>
        <Col
          padding={['dimensions.spacing.400', 'dimensions.spacing.400']}
          gridGap="dimensions.spacing.200"
          maxWidth="60%"
          zIndex={1}
        >
          <Text fontSize="T300" fontWeight="bold" color="color.neutral.90">
            Your agents have been working hard so you don't have to.
          </Text>
          <Text fontSize="T100" color="color.neutral.70">
            We've collected all your actions from each of your agents. Complete them as you
            please from your digest. Go to the agents page to configure or create new agents.
          </Text>
        </Col>
        <IllustrationContainer>
          <HeroImage
            src="/hero-illustration.png"
            alt=""
            role="presentation"
          />
        </IllustrationContainer>
      </HeroBanner>
    </View>
  );
};
