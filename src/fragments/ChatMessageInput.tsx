import { IGif } from '@giphy/js-types';
import React, { useContext, useRef } from 'react';
import { ThemeContext } from 'styled-components';

import { Channel } from '../../../chatkitty-js';
import {
  isDraftModified,
  MessageDraftType,
  newTextMessageDraft,
  TextMessageDraft,
} from '../models/message-draft';
import { ChatAppContext } from '../providers/ChatAppProvider';
import {
  FlexRow,
  Icon,
  Icons,
  StyledBox,
  Textarea,
} from '../ui-kit/components';
import { useMediaQuery } from '../ui-kit/hooks';

import EmojiInput from './EmojiInput';
import EmojiSuggestion from './EmojiSuggestion';
import GiphyInput from './GiphyInput';

const autoExpand = (el: HTMLTextAreaElement) => {
  setTimeout(function () {
    el.style.cssText = 'height:auto; padding:0';
    el.style.cssText = 'height:' + el.scrollHeight + 'px';
  }, 0);
};

interface ChatMessageInputProps {
  channel: Channel;
}

const ChatMessageInput: React.FC<ChatMessageInputProps> = ({
  channel,
}: ChatMessageInputProps) => {
  const theme = useContext(ThemeContext);
  const touch = useMediaQuery(theme.mediaQueries.touch);

  const {
    messageDraft: draft,
    updateMessageDraft,
    sendMessageDraft,
  } = useContext(ChatAppContext);

  const text = draft.text;
  const textareaRef = useRef<HTMLTextAreaElement>(
    document.createElement('textarea')
  );

  const textChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateMessageDraft(newTextMessageDraft(draft, e.target.value));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !(e.shiftKey || touch)) {
      const newDraft = newTextMessageDraft(draft, text);

      if (isDraftModified(newDraft)) {
        sendMessageDraft(newDraft);
      }

      e.preventDefault();
    }

    autoExpand(e.target as HTMLTextAreaElement);
  };

  const emojiInserted = (messageWithEmoji: string) => {
    updateMessageDraft(newTextMessageDraft(draft, messageWithEmoji));

    textareaRef.current.focus();
  };

  const sendGif = (gif: IGif, query: string) => {
    sendMessageDraft({
      type: MessageDraftType.Giphy,
      query,
      gif,
    });
  };

  return (
    <StyledBox mx="6" marginBottom="3">
      <StyledBox border="dark" borderRadius="messageEditor" position="relative">
        <FlexRow padding="2">
          <FlexRow flexGrow={1}>
            <Textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={textChanged}
              onKeyPress={handleKeyPress}
              placeholder="Type Message"
            />
          </FlexRow>

          {process.env.REACT_CHAT_APP_GIPHY_API_KEY && (
            <GiphyInput onSelected={sendGif} />
          )}

          <StyledBox marginLeft="1">
            <EmojiInput value={text} onSelection={emojiInserted} />
            <EmojiSuggestion value={text} onSelection={emojiInserted} />
          </StyledBox>

          {touch && (
            <StyledBox
              bg="active"
              color="onPrimary"
              padding="1"
              margin={-1}
              marginLeft="1"
              borderRadius="light"
              onClick={() => isDraftModified(draft) && sendMessageDraft(draft)}
            >
              <Icon icon={Icons.Send} title="Send Message" />
            </StyledBox>
          )}
        </FlexRow>
      </StyledBox>
    </StyledBox>
  );
};

export default ChatMessageInput;
