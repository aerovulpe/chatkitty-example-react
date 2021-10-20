import React from 'react';
import { FlexRow } from 'react-chat-ui-kit';

import Chat from '../fragments/Chat';
import JoinChannelDialog from '../fragments/JoinChannelDialog';
import Menu from '../fragments/Menu';

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
