import { Channel, isUserMessage } from 'chatkitty';
import React, { useContext, useEffect, useRef } from 'react';
import { ThemeContext } from 'styled-components';

import { ChatAppContext } from '../providers/ChatAppProvider';
import { FlexColumn, ScrollView } from '../ui-kit/components';
import { Avatar, AvatarVariants } from '../ui-kit/components/chat';
import { ImageAvatar } from '../ui-kit/components/chat/avatar/image-avatar';
import { usePaginator } from '../ui-kit/hooks';
import { getUniqueColor } from '../ui-kit/utilities';

import MessageListItem from './MessageListItem';

interface ChatMessagesProps {
  channel: Channel;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  channel,
}: ChatMessagesProps) => {
  const theme = useContext(ThemeContext);

  const { messages, messagesPaginator, appendToMessages } =
    useContext(ChatAppContext);

  const { containerRef, boundaryRef } = usePaginator({
    paginator: () => {
      if (!channel) {
        return;
      }

      return messagesPaginator(channel);
    },
    onPageFetched: (items) => {
      appendToMessages(items);
    },
    dependencies: [channel],
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollView ref={containerRef}>
      <FlexColumn
        minHeight="100%"
        flexGrow={1}
        paddingBottom="1"
        flexDirection="column-reverse"
      >
        <div ref={messagesEndRef} />
        {messages.map((message) => (
          <MessageListItem
            message={message}
            key={message.id}
            avatar={
              isUserMessage(message) ? (
                <ImageAvatar image={message.user.displayPictureUrl} />
              ) : (
                <Avatar
                  variant={AvatarVariants.ROUND}
                  bg={getUniqueColor('system', theme.colors.avatars)}
                >
                  ChatKitty
                </Avatar>
              )
            }
          />
        ))}
        <div ref={boundaryRef} />
        {/* This moves the list of messages to the bottom, since there's a bug with flex-end scroll */}
        <FlexColumn flex="1 1 auto"></FlexColumn>
      </FlexColumn>
    </ScrollView>
  );
};

export default ChatMessages;
