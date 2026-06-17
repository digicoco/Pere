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
  zIndex: 1,
});

const HeroImage = styled('img')({
  height: '100%',
  objectFit: 'contain',
  objectPosition: 'bottom right',
});

export const CopilotHeader = () => {
  return (
    <View padding="dimensions.spacing.400">
      <Col gridGap="dimensions.spacing.300">
        <H1>Copilot</H1>
        <HeroBanner>
        <Col
          padding={['dimensions.spacing.400', 'dimensions.spacing.400']}
          gridGap="dimensions.spacing.200"
          maxWidth="60%"
          style={{ position: 'relative', zIndex: 2 }}
        >
          <Text fontSize="T300" fontWeight="bold" color="color.neutral.90">
            Your agents have been working hard so you don't have to.
          </Text>
          <Text fontSize="T100" color="color.neutral.70">
            4 active jobs, 147 candidates in pipeline. 12 appointments today, 6 offers to extend.
            Complete your actions from the digest below, or go to agents to configure automation.
          </Text>
        </Col>
        <IllustrationContainer>
          <HeroImage
            src="./hero-illustration.png"
            alt=""
            role="presentation"
          />
        </IllustrationContainer>
      </HeroBanner>
      </Col>
    </View>
  );
};
