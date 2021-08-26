import { Channel, isUserMessage } from 'chatkitty';
import React, { UIEventHandler, useContext } from 'react';
import { ThemeContext } from 'styled-components';

import { ChatAppContext } from '../providers/ChatAppProvider';
import { FlexColumn, ScrollView } from '../ui-kit/components';
import { Avatar, AvatarVariants } from '../ui-kit/components/chat';
import { ImageAvatar } from '../ui-kit/components/chat/avatar/image-avatar';
import { usePaginator } from '../ui-kit/hooks/usePaginator';
import { getUniqueColor } from '../ui-kit/utilities';

import MessageListItem from './MessageListItem';

interface ChatMessageListProps {
  channel: Channel;
}

type ScrollElement = { scrollTop: number } & Element;

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  channel,
}: ChatMessageListProps) => {
  const theme = useContext(ThemeContext);

  const { channelMessages } = useContext(ChatAppContext);

  const {
    containerRef,
    elementRef,
    items: messages,
  } = usePaginator(() => channelMessages(channel), [channel]);

  const handleScroll: UIEventHandler<ScrollElement> = (e) => {
    const scrollPosition = (e.target as ScrollElement).scrollTop;

    if (scrollPosition !== 0) {
      // TODO
    }
  };

  return (
    <ScrollView ref={containerRef} onScroll={handleScroll}>
      <FlexColumn minHeight="100%" flexGrow={1} paddingBottom="1">
        {/* This moves the list of messages to the bottom, since there's a bug with flex-end scroll */}
        <FlexColumn flex="1 1 auto"></FlexColumn>

        <div ref={elementRef} />
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
      </FlexColumn>
    </ScrollView>
  );
};

export default ChatMessageList;
