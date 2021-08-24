import React, { useContext } from 'react';

import { ChatAppContext } from '../providers/ChatAppProvider';
import {
  FlexColumn,
  Heading,
  HeadingSizes,
  StyledBox,
} from '../ui-kit/components';

import ChatHeader from './ChatHeader';

const Chat: React.FC = () => {
  const { chatSession: session } = useContext(ChatAppContext);

  if (!session) {
    return (
      <StyledBox margin="auto">
        <Heading size={HeadingSizes.HUGE}>Select channel</Heading>
      </StyledBox>
    );
  }

  return (
    <FlexColumn
      height="100%"
      width="100%"
      position={['fixed', 'static']}
      bg="backgrounds.content"
      borderRight="light"
    >
      <ChatHeader session={session} />
    </FlexColumn>
  );
};

export default Chat;
