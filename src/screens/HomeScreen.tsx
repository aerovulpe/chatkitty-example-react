import React from 'react';

import Chat from '../fragments/Chat';
import Menu from '../fragments/Menu';
import { FlexRow } from '../ui-kit/components';

const HomeScreen: React.FC = () => {
  return (
    <FlexRow height="100%">
      <Menu />
      <Chat />
    </FlexRow>
  );
};

export default HomeScreen;
