import { Message as ChatKittyMessage, isUserMessage } from 'chatkitty';
import moment from 'moment';
import React, { ReactElement } from 'react';
import {
  FlexColumn,
  FlexRow,
  Heading,
  Label,
  LabelSizes,
  StyledBox,
} from 'react-chat-ui-kit';
import { useHover } from 'react-chat-ui-kit';

import Message from './Message';

interface MessageListItemProps {
  message: ChatKittyMessage;
  avatar: ReactElement;
}

const MessageListItem = ({ message, avatar }: MessageListItemProps) => {
  const sender: { displayName: string } = isUserMessage(message)
    ? message.user
    : {
        displayName: 'ChatKitty',
      };

  const [isHovering, hoverProps] = useHover({ mouseEnterDelayMS: 0 });

  return (
    <FlexRow
      py="1"
      px={[5, 6]}
      alignItems="flex-start"
      bg={isHovering ? 'backgrounds.contentHover' : ''}
      {...hoverProps}
    >
      {avatar}
      <FlexColumn marginLeft="5" flexGrow={1}>
        <FlexRow marginBottom="1">
          <StyledBox marginRight="3">
            <Heading>{sender.displayName}</Heading>
          </StyledBox>
          <Label size={LabelSizes.SMALL}>
            {moment(message.createdTime).fromNow()}
          </Label>
        </FlexRow>

        <Message message={message}></Message>
      </FlexColumn>
    </FlexRow>
  );
};

export default MessageListItem;
