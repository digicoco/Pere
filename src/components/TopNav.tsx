import { useState } from 'react';
import { Row, View } from '@amzn/stencil-react-components/layout';
import { Text } from '@amzn/stencil-react-components/text';
import { SearchField } from '@amzn/stencil-react-components/search';
import { Avatar } from '@amzn/stencil-react-components/avatar';
import { FilterChip } from '@amzn/stencil-react-components/filtering';
import { token } from '@amzn/stencil-design-tokens/js/web/utils';
import styled from '@emotion/styled';
import IconMenuSmall from '@amzn/stencil-react-icons/icons/icon-menu-small';
import IconSparklesSmall from '@amzn/stencil-react-icons/icons/icon-sparkles-small';
import IconNotificationSmall from '@amzn/stencil-react-icons/icons/icon-notification-small';

const NavIconButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  padding: token('dimensions.spacing.200'),
  border: 'none',
  borderRadius: token('dimensions.border.radius.100'),
  backgroundColor: 'transparent',
  cursor: 'pointer',
  color: token('color.neutral.90'),
  '&:hover': {
    backgroundColor: token('color.action.utility.bg-hover'),
  },
});

const HeaderBar = styled('header')({
  display: 'flex',
  alignItems: 'center',
  gap: token('dimensions.spacing.300'),
  padding: `${token('dimensions.spacing.100')} ${token('dimensions.spacing.500')}`,
  backgroundColor: token('color.surface.bg-default'),
  boxShadow: `0px 0px 10px ${token('color.gradient.elevation')}`,
  position: 'sticky',
  top: 0,
  zIndex: 100,
  width: '100%',
  height: 63,
});

const AiIngressBadge = styled('div')({
  width: 32,
  height: 32,
  borderRadius: '100px',
  background: `linear-gradient(133deg, ${token('color.purple.70')} 7%, ${token('color.blue.60')} 133%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
});

export const TopNav = ({ onChatToggle }: { onChatToggle?: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <HeaderBar>
      <Row alignItems="center" gridGap="dimensions.spacing.200" style={{ flexShrink: 0 }}>
        <Text fontSize="T300" fontWeight="bold" color="color.neutral.90">
          Unified Hiring Portal
        </Text>
        <FilterChip>Philippines</FilterChip>
      </Row>

      <View flex={1} style={{ maxWidth: 500, margin: '0 auto' }}>
        <SearchField
          query={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search or ask anything"
        />
      </View>

      <Row alignItems="center" gridGap="dimensions.spacing.300" style={{ flexShrink: 0 }}>
        <FilterChip>Admin</FilterChip>
        <AiIngressBadge onClick={onChatToggle}>
          <IconSparklesSmall aria-hidden="true" color="white" />
        </AiIngressBadge>
        <View style={{ position: 'relative', cursor: 'pointer' }}>
          <IconNotificationSmall title="Notifications" />
        </View>
        <Avatar username="digicoco" fullName="Digicoco" showFullName={false} showUsername={false} />
      </Row>
    </HeaderBar>
  );
};
