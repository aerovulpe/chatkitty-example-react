import { Message as ChatKittyMessage, isTextMessage } from 'chatkitty';
import invariant from 'invariant';
import React from 'react';
import { TextMessage } from 'react-chat-ui-kit';

type MessageProps = {
  message: ChatKittyMessage;
};

const Message: React.FC<MessageProps> = ({ message }: MessageProps) => {
  if (isTextMessage(message)) {
    return <TextMessage text={message.body} />;
  }

  return invariant(
    false,
    `No component available for displaying message of type "${message.type}"`
  );
};

export default Message;
