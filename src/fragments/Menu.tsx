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
import MyChannels from './MyChannels';

const Menu: React.FC = () => {
  const theme = useContext(ThemeContext);
  const isMedium = useMediaQuery(theme.mediaQueries.medium);

  const { layout, hideMenu } = useContext(ChatAppContext);

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
          onClick={() => hideMenu()}
          icon={Icons.Cross}
          title="Close channels"
          color={theme.colors.onPrimary}
          clickable
        />
      </StyledBox>

      <StyledBox padding={6}>
        <FlexRow>
          <Icon
            icon={Icons.Logo}
            title="ChatKitty"
            style={{ height: 61, width: 61 }}
          />
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

      <MyChannels />
    </Drawer>
  );
};

export default Menu;
