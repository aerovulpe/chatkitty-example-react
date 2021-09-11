import React, { useContext, useEffect } from 'react';

import { ChatAppContext } from '../providers/ChatAppProvider';
import {
  FlexColumn,
  Heading,
  HeadingSizes,
  StyledBox,
} from '../ui-kit/components';
import { usePaginator } from '../ui-kit/hooks';

import ChatHeader from './ChatHeader';
import ChatMessageInput from './ChatMessageInput';
import ChatMessages from './ChatMessages';

const Chat: React.FC = () => {
  const { channel, channelMessages, startChatSession } =
    useContext(ChatAppContext);

  if (!channel) {
    return (
      <StyledBox margin="auto">
        <Heading size={HeadingSizes.HUGE}>Select channel</Heading>
      </StyledBox>
    );
  }

  const {
    items: messages,
    prepend,
    containerRef,
    boundaryRef,
  } = usePaginator(() => channelMessages(channel), [channel]);

  useEffect(() => {
    const session = startChatSession(channel, (message) => {
      prepend([message]);
    });

    return session?.end;
  }, [channel]);

  return (
    <FlexColumn
      height="100%"
      width="100%"
      position={['fixed', 'static']}
      bg="backgrounds.content"
      borderRight="light"
    >
      <ChatHeader channel={channel} />
      <ChatMessages
        messages={messages}
        containerRef={containerRef}
        boundaryRef={boundaryRef}
      />
      <ChatMessageInput channel={channel} />
    </FlexColumn>
  );
};

export default Chat;
