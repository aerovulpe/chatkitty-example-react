import React, { useContext } from 'react';

import { ChatAppContext } from '../providers/ChatAppProvider';
import {
  FlexColumn,
  Heading,
  HeadingSizes,
  StyledBox,
} from '../ui-kit/components';

import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';

const Chat: React.FC = () => {
  const { chatSession: session } = useContext(ChatAppContext);

  if (!session) {
    return (
      <StyledBox margin="auto">
        <Heading size={HeadingSizes.HUGE}>Select channel</Heading>
      </StyledBox>
    );
  }

  const channel = session.channel;

  return (
    <FlexColumn
      height="100%"
      width="100%"
      position={['fixed', 'static']}
      bg="backgrounds.content"
      borderRight="light"
    >
      <ChatHeader channel={channel} />
      <ChatMessageList channel={channel} />
    </FlexColumn>
  );
};

export default Chat;
