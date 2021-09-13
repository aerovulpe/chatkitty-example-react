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

  const {
    items: messages,
    prepend,
    containerRef,
    boundaryRef,
  } = usePaginator(() => {
    if (!channel) {
      return;
    }

    return channelMessages(channel);
  }, [channel]);

  useEffect(() => {
    if (!channel) {
      return;
    }

    const session = startChatSession(channel, (message) => {
      prepend([message]);
    });

    if (!session) {
      return;
    }

    return session.end;
  }, [channel]);

  return channel ? (
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
  ) : (
    <StyledBox margin="auto">
      <Heading size={HeadingSizes.HUGE}>Select channel</Heading>
    </StyledBox>
  );
};

export default Chat;
