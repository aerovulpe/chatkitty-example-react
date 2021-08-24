import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';

import { ChatAppContext } from '../providers/ChatAppProvider';
import {
  Drawer,
  FlexColumn,
  FlexRow,
  Heading,
  HeadingVariants,
  Icon,
  Icons,
  StyledBox,
} from '../ui-kit/components';
import { useMediaQuery } from '../ui-kit/hooks';

import CurrentUserStatus from './CurrentUserStatus';
import JoinedChannels from './JoinedChannels';

const Menu: React.FC = () => {
  const theme = useContext(ThemeContext);
  const isMedium = useMediaQuery(theme.mediaQueries.medium);

  const { layout, hideView } = useContext(ChatAppContext);

  return (
    <Drawer
      open={layout.menu || isMedium}
      background={theme.backgrounds.primary}
    >
      <StyledBox
        position="absolute"
        right="0"
        padding="6"
        display={['block', 'none']}
      >
        <Icon
          onClick={() => hideView('Menu')}
          icon={Icons.Cross}
          title="Close channels"
          color={theme.colors.onPrimary}
          clickable
        />
      </StyledBox>

      <StyledBox padding={6}>
        <FlexRow>
          <Icon icon={Icons.Logo} title="PubNub" />
          <StyledBox paddingLeft={4}>
            <FlexColumn minHeight={1}>
              <Heading variant={HeadingVariants.INVERSE}>
                {theme.custom.companyName}
              </Heading>
              <CurrentUserStatus />
            </FlexColumn>
          </StyledBox>
        </FlexRow>
      </StyledBox>

      <JoinedChannels />
    </Drawer>
  );
};

export default Menu;
