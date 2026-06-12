import { useState } from 'react';
import { Col, Row, View } from '@amzn/stencil-react-components/layout';
import { H2, Text } from '@amzn/stencil-react-components/text';
import { Button, ButtonVariant } from '@amzn/stencil-react-components/button';
import { Breadcrumbs } from '@amzn/stencil-react-components/breadcrumbs';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import styled from '@emotion/styled';
import IconSparklesMedium from '@amzn/stencil-react-icons/icons/icon-sparkles-medium';
import { AIIconWrapper } from '@amzn/stencil-react-components/ai';
import { WorkflowEditorPage } from './WorkflowEditorPage';

interface CreateFlowPageProps {
  onBack: () => void;
}

const PageContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  backgroundColor: token('color.surface.bg-default'),
  height: '100%',
});

const CenteredContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 700,
  width: '100%',
  margin: '0 auto',
  padding: `${token('dimensions.spacing.500')} ${token('dimensions.spacing.400')}`,
});

const GradientHeading = styled('h2')({
  fontSize: 24,
  fontWeight: 'bold',
  textAlign: 'center',
  background: `linear-gradient(133deg, ${token('color.purple.70')} 7%, ${token('color.blue.60')} 133%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  margin: `${token('dimensions.spacing.300')} 0 ${token('dimensions.spacing.100')}`,
});

const StyledTextarea = styled('textarea')({
  width: '100%',
  minHeight: 180,
  fontFamily: 'inherit',
  fontSize: 14,
  lineHeight: 1.5,
  padding: token('dimensions.spacing.300'),
  border: `1px solid ${token('color.input.border-default')}`,
  borderRadius: token('dimensions.border.radius.200'),
  backgroundColor: token('color.input.bg-default'),
  color: token('color.text.primary'),
  resize: 'vertical',
  outline: 'none',
  '&:focus': {
    borderColor: token('color.action.primary.bg-default'),
    boxShadow: `0 0 0 1px ${token('color.action.primary.bg-default')}`,
  },
  '&::placeholder': {
    color: token('color.text.secondary'),
  },
});

const SuggestionPill = styled('button')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: token('dimensions.spacing.200'),
  border: `1px solid ${token('color.border.primary')}`,
  borderRadius: 100,
  padding: `${token('dimensions.spacing.200')} ${token('dimensions.spacing.300')}`,
  background: 'transparent',
  cursor: 'pointer',
  fontSize: 13,
  color: token('color.text.primary'),
  transition: 'background-color 0.15s ease',
  '&:hover': {
    backgroundColor: token('color.surface.bg-muted'),
  },
});

const SuggestionsGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: token('dimensions.spacing.200'),
  width: '100%',
  maxWidth: 600,
});

const SectionLabel = styled('span')({
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: token('color.text.secondary'),
  textAlign: 'center',
  marginTop: token('dimensions.spacing.500'),
  marginBottom: token('dimensions.spacing.300'),
});

export const CreateFlowPage = ({ onBack }: CreateFlowPageProps) => {
  const [textareaValue, setTextareaValue] = useState('');
  const [generatedFlowName, setGeneratedFlowName] = useState<string | null>(null);
  const characterCount = textareaValue.length;

  const handleGenerate = () => {
    if (textareaValue.trim()) {
      // Derive flow name from the prompt (first ~50 chars, title-cased)
      const name = textareaValue.trim().slice(0, 50).split(' ').slice(0, 6).join(' ');
      setGeneratedFlowName(name.charAt(0).toUpperCase() + name.slice(1));
    }
  };

  if (generatedFlowName) {
    return <WorkflowEditorPage flowName={generatedFlowName} onBack={() => setGeneratedFlowName(null)} />;
  }

  const suggestions = [
    'Summarize and act on customer feedback',
    'Draft troubleshooting tips for product documentation',
    'Automate RFP responses',
    'Combine insights from dashboards and news',
  ];

  return (
    <PageContainer>
      <View padding={['dimensions.spacing.300', 'dimensions.spacing.400']}>
        <Breadcrumbs
          aria-label="Flow creation"
          crumbs={[
            { title: 'Flows', url: '#' },
            { title: 'Create flow' },
          ]}
          onCrumbClick={(e) => {
            e.preventDefault();
            onBack();
          }}
        />
      </View>

      <CenteredContent>
        <AIIconWrapper fill="color.gradient.action.default">
          <IconSparklesMedium aria-hidden="true" />
        </AIIconWrapper>

        <GradientHeading>Create workflows for everyday tasks</GradientHeading>

        <Text
          fontSize="T200"
          color="color.text.secondary"
          textAlign="center"
          style={{ marginBottom: token('dimensions.spacing.400') }}
        >
          Tell us about your task or get started with a sample prompt.
        </Text>

        <StyledTextarea
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
          maxLength={10000}
          placeholder="Describe what you're trying to do. It may help to describe the information that you need to collect, any content you need to generate, and the services you need to connect to. Including additional context like the end goal, persona, or limitations can provide better results."
        />

        <Row
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          style={{ marginTop: token('dimensions.spacing.200') }}
        >
          <Text variant="label-xs" color="color.text.secondary">
            Character count: {characterCount} / 10000
          </Text>
          <Row gridGap="dimensions.spacing.200" alignItems="center">
            <Button variant={ButtonVariant.Tertiary}>
              Create a blank flow
            </Button>
            <Button
              variant={ButtonVariant.Secondary}
              disabled={textareaValue.trim().length === 0}
              onClick={handleGenerate}
            >
              Generate
            </Button>
          </Row>
        </Row>

        <SectionLabel>WHAT WOULD YOU LIKE TO DO TODAY?</SectionLabel>

        <SuggestionsGrid>
          {suggestions.map((suggestion) => (
            <SuggestionPill
              key={suggestion}
              onClick={() => setTextareaValue(suggestion)}
            >
              <AIIconWrapper fill="color.gradient.action.default">
                <IconSparklesMedium aria-hidden="true" style={{ width: 14, height: 14 }} />
              </AIIconWrapper>
              {suggestion}
            </SuggestionPill>
          ))}
        </SuggestionsGrid>

        <Button
          variant={ButtonVariant.Tertiary}
          style={{ marginTop: token('dimensions.spacing.300') }}
        >
          More samples
        </Button>
      </CenteredContent>
    </PageContainer>
  );
};
