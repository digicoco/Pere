import { useState } from 'react';
import { Col, Row } from '@amzn/stencil-react-components/layout';
import { H1, H2, Text } from '@amzn/stencil-react-components/text';
import { Button, ButtonVariant } from '@amzn/stencil-react-components/button';
import { Card } from '@amzn/stencil-react-components/card';
import { FilterChip, FilterList, FilterPopover } from '@amzn/stencil-react-components/filtering';
import { AIIconWrapper } from '@amzn/stencil-react-components/ai';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import styled from '@emotion/styled';
import IconSparklesMedium from '@amzn/stencil-react-icons/icons/icon-sparkles-medium';

// --- Styled Components ---

const PageGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: '248px 1fr',
  minHeight: 'calc(100vh - 56px)',
});

const Sidebar = styled('aside')({
  width: 248,
  borderRight: `1px solid ${token('color.border.primary')}`,
  background: token('color.surface.bg-raised'),
  padding: `${token('dimensions.spacing.300')} ${token('dimensions.spacing.200')}`,
  display: 'flex',
  flexDirection: 'column',
  gap: token('dimensions.spacing.300'),
  position: 'sticky',
  top: 56,
  height: 'calc(100vh - 56px)',
  overflowY: 'auto',
});

const AIGradientButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  gap: token('dimensions.spacing.100'),
  padding: `${token('dimensions.spacing.100')} ${token('dimensions.spacing.200')}`,
  border: 'none',
  borderRadius: token('dimensions.border.radius.200'),
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
  color: '#ffffff',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  width: '100%',
  justifyContent: 'center',
  '&:hover': {
    opacity: 0.9,
  },
});

const NavItem = styled('button')<{ active?: boolean }>(({ active }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  padding: `${token('dimensions.spacing.100')} ${token('dimensions.spacing.200')}`,
  border: 'none',
  borderRadius: token('dimensions.border.radius.200'),
  background: active ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
  color: active ? token('color.neutral.90') : token('color.neutral.70'),
  fontSize: 14,
  fontWeight: active ? 600 : 400,
  cursor: 'pointer',
  textAlign: 'left' as const,
  fontFamily: 'inherit',
  '&:hover': {
    background: active ? 'rgba(99, 102, 241, 0.08)' : token('color.neutral.05'),
  },
}));

const SectionLabel = styled('div')({
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.5px',
  textTransform: 'uppercase' as const,
  color: token('color.neutral.60'),
  padding: `${token('dimensions.spacing.100')} ${token('dimensions.spacing.200')}`,
});

const MainContent = styled('main')({
  flex: 1,
  overflowY: 'auto',
  padding: token('dimensions.spacing.400'),
  display: 'flex',
  flexDirection: 'column',
  gap: token('dimensions.spacing.300'),
});

const AIBorderButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  gap: token('dimensions.spacing.100'),
  padding: `${token('dimensions.spacing.100')} ${token('dimensions.spacing.200')}`,
  border: '2px solid transparent',
  borderRadius: token('dimensions.border.radius.200'),
  background: `linear-gradient(white, white) padding-box, linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7) border-box`,
  color: token('color.neutral.90'),
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  '&:hover': {
    opacity: 0.85,
  },
});

const StickyFilterBar = styled('div')({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  background: token('color.surface.bg-default'),
  padding: `${token('dimensions.spacing.200')} 0`,
  borderBottom: `1px solid ${token('color.border.primary')}`,
});

const FunnelRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: token('dimensions.spacing.200'),
  padding: `${token('dimensions.spacing.100')} 0`,
});

const FunnelLabel = styled('span')({
  minWidth: 140,
  fontSize: 13,
  color: token('color.neutral.70'),
});

const FunnelValue = styled('span')({
  minWidth: 60,
  fontWeight: 600,
  fontSize: 14,
  textAlign: 'right' as const,
  color: token('color.neutral.90'),
});

const FunnelBarContainer = styled('div')({
  flex: 1,
  height: 24,
  background: token('color.neutral.05'),
  borderRadius: 12,
  overflow: 'hidden',
});

const FunnelBar = styled('div')<{ width: number }>(({ width }) => ({
  height: '100%',
  width: `${width}%`,
  background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
  borderRadius: 12,
  transition: 'width 0.4s ease',
}));

const AIInsightCard = styled('div')({
  border: '2px solid transparent',
  borderRadius: token('dimensions.border.radius.200'),
  background: `linear-gradient(${token('color.surface.bg-raised')}, ${token('color.surface.bg-raised')}) padding-box, linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7) border-box`,
  padding: token('dimensions.spacing.300'),
  display: 'flex',
  flexDirection: 'column',
  gap: token('dimensions.spacing.200'),
});

const MetricGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: token('dimensions.spacing.200'),
});

const MetricCard = styled('div')({
  padding: token('dimensions.spacing.300'),
  background: token('color.surface.bg-raised'),
  border: `1px solid ${token('color.border.primary')}`,
  borderRadius: token('dimensions.border.radius.200'),
  display: 'flex',
  flexDirection: 'column',
  gap: token('dimensions.spacing.100'),
});

const RetentionRing = styled('div')<{ percentage: number; ringColor: string }>(({ percentage, ringColor }) => ({
  width: 56,
  height: 56,
  borderRadius: '50%',
  background: `conic-gradient(${ringColor} ${percentage * 3.6}deg, ${token('color.neutral.05')} 0deg)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::after': {
    content: '""',
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: token('color.surface.bg-raised'),
  },
}));

const BulletList = styled('ul')({
  margin: 0,
  paddingLeft: 20,
  listStyle: 'disc',
});

const BulletPoint = styled('li')({
  fontSize: 14,
  color: token('color.neutral.70'),
  lineHeight: 1.5,
  marginBottom: token('dimensions.spacing.100'),
});

// --- Data ---

const funnelData = [
  { label: 'Impressions', value: 48200, percent: 100 },
  { label: 'Clicks / visits', value: 19800, percent: 41 },
  { label: 'Apply started', value: 12480, percent: 26 },
  { label: 'Apply completed', value: 4120, percent: 8.5 },
  { label: 'Application created', value: 2870, percent: 6 },
];

const standardReports = [
  'Full funnel overview',
  'In-application health',
  'Demand & supply',
  'Candidate quality & effort',
];

// --- Component ---

export const InsightsPage = () => {
  const [activeReport, setActiveReport] = useState('Full funnel overview');

  return (
    <PageGrid>
      {/* Left Sidebar */}
      <Sidebar>
        <AIGradientButton>
          <IconSparklesMedium aria-hidden="true" style={{ width: 16, height: 16, color: '#ffffff' }} />
          New report with AI
        </AIGradientButton>

        <div>
          <SectionLabel>STANDARD REPORTS</SectionLabel>
          <Col gridGap="dimensions.spacing.050">
            {standardReports.map((report) => (
              <NavItem
                key={report}
                active={activeReport === report}
                onClick={() => setActiveReport(report)}
              >
                {report}
              </NavItem>
            ))}
          </Col>
        </div>

        <div>
          <SectionLabel>YOUR REPORTS</SectionLabel>
          <Text fontSize="T100" color="color.neutral.60" style={{ padding: token('dimensions.spacing.200') }}>
            Generate one with AI, or save a standard report to customize it.
          </Text>
        </div>
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        {/* Header */}
        <div>
          <Text fontSize="T100" fontWeight="bold" color="color.neutral.60" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Standard report
          </Text>
          <H1>Full funnel overview</H1>
          <Text fontSize="T200" color="color.neutral.70">
            Pre-application + in-application funnels, then demand, supply &amp; quality.
          </Text>
        </div>

        {/* Action Buttons */}
        <Row gridGap="dimensions.spacing.200" alignItems="center">
          <Button variant={ButtonVariant.Tertiary}>Save a copy</Button>
          <AIBorderButton>
            <IconSparklesMedium aria-hidden="true" style={{ width: 16, height: 16 }} />
            New with AI
          </AIBorderButton>
        </Row>

        {/* Scope Filter Bar */}
        <StickyFilterBar>
          <Row gridGap="dimensions.spacing.200" alignItems="center">
            <FilterPopover triggerComponent={<FilterChip>Country</FilterChip>}>
              <FilterList options={[{ label: 'United States', value: 'us' }, { label: 'Philippines', value: 'ph' }]} titleText="Select country" />
            </FilterPopover>
            <FilterPopover triggerComponent={<FilterChip>Line of business</FilterChip>}>
              <FilterList options={[{ label: 'Customer Service', value: 'cs' }, { label: 'Operations', value: 'ops' }]} titleText="Select LOB" />
            </FilterPopover>
            <FilterPopover triggerComponent={<FilterChip>Site</FilterChip>}>
              <FilterList options={[{ label: 'MNL1', value: 'mnl1' }, { label: 'CEB1', value: 'ceb1' }]} titleText="Select site" />
            </FilterPopover>
            <FilterPopover triggerComponent={<FilterChip>Timeframe</FilterChip>}>
              <FilterList options={[{ label: 'Last 7 days', value: '7d' }, { label: 'Last 30 days', value: '30d' }]} titleText="Select timeframe" />
            </FilterPopover>
          </Row>
        </StickyFilterBar>

        {/* Section 1: Funnel - pre-application */}
        <Card padding="dimensions.spacing.300">
          <Col gridGap="dimensions.spacing.200">
            <H2>Funnel – pre-application</H2>
            <Text fontSize="T100" color="color.neutral.70">
              From reach to application created
            </Text>
            <Col gridGap="dimensions.spacing.050">
              {funnelData.map((item) => (
                <FunnelRow key={item.label}>
                  <FunnelLabel>{item.label}</FunnelLabel>
                  <FunnelValue>{item.value.toLocaleString()}</FunnelValue>
                  <FunnelBarContainer>
                    <FunnelBar width={item.percent} />
                  </FunnelBarContainer>
                </FunnelRow>
              ))}
            </Col>
          </Col>
        </Card>

        {/* AI Insight Card */}
        <AIInsightCard>
          <Row gridGap="dimensions.spacing.100" alignItems="center">
            <AIIconWrapper fill="color.gradient.action.default">
              <IconSparklesMedium aria-hidden="true" style={{ width: 16, height: 16 }} />
            </AIIconWrapper>
            <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">Pere&apos;s read</Text>
          </Row>
          <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">
            Lead capture is healthy in all marketplaces, but the apply-start step is leaking.
          </Text>
          <BulletList>
            <BulletPoint>Impressions-to-click rate (41%) is above benchmark (35%) across all geos.</BulletPoint>
            <BulletPoint>Click-to-apply-start (63%) drops below target (70%) in 3 sites — likely a landing-page UX issue.</BulletPoint>
            <BulletPoint>Apply-start-to-complete (33%) is in line with expectations; no action needed.</BulletPoint>
          </BulletList>
        </AIInsightCard>

        {/* Section 2: Demand & Supply */}
        <Card padding="dimensions.spacing.300">
          <Col gridGap="dimensions.spacing.200">
            <H2>Demand &amp; supply</H2>
            <MetricGrid>
              <MetricCard>
                <Text fontSize="T100" color="color.neutral.70">HC demanded</Text>
                <Text fontSize="T300" fontWeight="bold" color="color.neutral.90">16,080</Text>
              </MetricCard>
              <MetricCard>
                <Text fontSize="T100" color="color.neutral.70">Schedules created</Text>
                <Text fontSize="T300" fontWeight="bold" color="color.neutral.90">369</Text>
              </MetricCard>
              <MetricCard>
                <Text fontSize="T100" color="color.neutral.70">Labor orders</Text>
                <div style={{ padding: `${token('dimensions.spacing.100')} 0` }}>
                  <svg viewBox="0 0 64 64" width="64" height="64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke={token('color.neutral.05')} strokeWidth="8" />
                    <circle
                      cx="32" cy="32" r="28"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="8"
                      strokeDasharray={`${(148 / 200) * 175.9} 175.9`}
                      strokeLinecap="round"
                      transform="rotate(-90 32 32)"
                    />
                  </svg>
                </div>
                <Text fontSize="T200" fontWeight="bold" color="color.neutral.90">148 orders</Text>
              </MetricCard>
              <MetricCard>
                <Text fontSize="T100" color="color.neutral.70">Jobs by status</Text>
                <Row gridGap="dimensions.spacing.050" alignItems="flex-end" style={{ height: 48 }}>
                  <div style={{ width: 16, height: '80%', background: '#3b82f6', borderRadius: 4 }} />
                  <div style={{ width: 16, height: '60%', background: '#6366f1', borderRadius: 4 }} />
                  <div style={{ width: 16, height: '30%', background: '#a855f7', borderRadius: 4 }} />
                  <div style={{ width: 16, height: '45%', background: '#d8b4fe', borderRadius: 4 }} />
                </Row>
                <Text fontSize="T50" color="color.neutral.60">Active / Filled / Closed / Draft</Text>
              </MetricCard>
              <MetricCard>
                <Text fontSize="T100" color="color.neutral.70">Fill rate</Text>
                <Text fontSize="T300" fontWeight="bold" color="color.neutral.90">74%</Text>
              </MetricCard>
              <MetricCard>
                <Text fontSize="T100" color="color.neutral.70">Avg. time to fill</Text>
                <Text fontSize="T300" fontWeight="bold" color="color.neutral.90">11.2 days</Text>
              </MetricCard>
            </MetricGrid>
          </Col>
        </Card>

        {/* Section 3: People & Quality */}
        <Card padding="dimensions.spacing.300">
          <Col gridGap="dimensions.spacing.200">
            <H2>People &amp; quality</H2>
            <MetricGrid>
              <MetricCard>
                <Text fontSize="T100" color="color.neutral.70">Day-1 retention</Text>
                <Row gridGap="dimensions.spacing.200" alignItems="center">
                  <RetentionRing percentage={92} ringColor="#22c55e" />
                  <Text fontSize="T300" fontWeight="bold" color="color.neutral.90">92%</Text>
                </Row>
              </MetricCard>
              <MetricCard>
                <Text fontSize="T100" color="color.neutral.70">Day-30 retention</Text>
                <Row gridGap="dimensions.spacing.200" alignItems="center">
                  <RetentionRing percentage={82} ringColor="#3b82f6" />
                  <Text fontSize="T300" fontWeight="bold" color="color.neutral.90">82%</Text>
                </Row>
              </MetricCard>
              <MetricCard>
                <Text fontSize="T100" color="color.neutral.70">Day-90 retention</Text>
                <Row gridGap="dimensions.spacing.200" alignItems="center">
                  <RetentionRing percentage={73} ringColor="#6366f1" />
                  <Text fontSize="T300" fontWeight="bold" color="color.neutral.90">73%</Text>
                </Row>
              </MetricCard>
              <MetricCard>
                <Text fontSize="T100" color="color.neutral.70">PHA duration</Text>
                <Text fontSize="T300" fontWeight="bold" color="color.neutral.90">4.6 days</Text>
              </MetricCard>
              <MetricCard>
                <Text fontSize="T100" color="color.neutral.70">No-show rate</Text>
                <Text fontSize="T300" fontWeight="bold" color="color.neutral.90">25.7%</Text>
              </MetricCard>
              <MetricCard>
                <Text fontSize="T100" color="color.neutral.70">Offer acceptance</Text>
                <Text fontSize="T300" fontWeight="bold" color="color.neutral.90">88.3%</Text>
              </MetricCard>
            </MetricGrid>
          </Col>
        </Card>
      </MainContent>
    </PageGrid>
  );
};
