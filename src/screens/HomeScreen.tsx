import React from 'react';

import Chat from '../fragments/Chat';
import JoinChannelDialog from '../fragments/JoinChannelDialog';
import Menu from '../fragments/Menu';
import { FlexRow } from '../ui-kit/components';

const HomeScreen: React.FC = () => {
  return (
    <FlexRow height="100%">
      <Menu />
      <Chat />
      <JoinChannelDialog />
    </FlexRow>
  );
};

export default HomeScreen;
