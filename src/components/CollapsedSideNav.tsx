import { Col, View } from '@amzn/stencil-react-components/layout';
import { Button, ButtonVariant } from '@amzn/stencil-react-components/button';
import IconAppsSmall from '@amzn/stencil-react-icons/icons/icon-apps-small';
import IconCalendarSmall from '@amzn/stencil-react-icons/icons/icon-calendar-small';
import IconClauseSmall from '@amzn/stencil-react-icons/icons/icon-clause-small';
import IconBusinessCardSmall from '@amzn/stencil-react-icons/icons/icon-business-card-small';
import IconBuildingsSmall from '@amzn/stencil-react-icons/icons/icon-buildings-small';

export const CollapsedSideNav = () => {
  return (
    <View
      backgroundColor="color.surface.bg-default"
      width={69}
      minHeight="100vh"
      borderRight="1px solid var(--st-dt-color-border-primary)"
    >
      <Col alignItems="center" gridGap="dimensions.spacing.100" padding="dimensions.spacing.200">
        <Button
          variant={ButtonVariant.Tertiary}
          icon={<IconAppsSmall title="Copilot" />}
          aria-label="Copilot"
        />
        <Button
          variant={ButtonVariant.Tertiary}
          icon={<IconBusinessCardSmall title="Candidates" />}
          aria-label="Candidates"
        />
        <Button
          variant={ButtonVariant.Tertiary}
          icon={<IconBuildingsSmall title="Requisitions" />}
          aria-label="Requisitions"
        />
        <Button
          variant={ButtonVariant.Tertiary}
          icon={<IconClauseSmall title="Documents" />}
          aria-label="Documents"
        />
        <Button
          variant={ButtonVariant.Tertiary}
          icon={<IconCalendarSmall title="Calendar" />}
          aria-label="Calendar"
        />
      </Col>
    </View>
  );
};
