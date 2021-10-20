import 'emoji-mart/css/emoji-mart.css';
import { EmojiData, Picker as EmojiPicker } from 'emoji-mart';
import React, { useContext } from 'react';
import { Dropdown } from 'react-chat-ui-kit';
import { Icons } from 'react-chat-ui-kit';
import { ThemeContext } from 'styled-components';

interface EmojiInputProps {
  value: string;
  onSelection(contentWithEmoji: string): void;
}

const EmojiInput: React.FC<EmojiInputProps> = ({
  value,
  onSelection,
}: EmojiInputProps) => {
  const theme = useContext(ThemeContext);

  return (
    <Dropdown
      icon={Icons.Emoji}
      right="0"
      bottom="0"
      title="Open emoji selector"
      render={(dismiss) => {
        const addEmoji = (emoji: EmojiData) => {
          if ('native' in emoji) {
            onSelection(`${value}${emoji.native}`);
            dismiss();
          }
        };
        return (
          <EmojiPicker
            emoji=""
            title=""
            native={true}
            onSelect={addEmoji}
            color={theme.colors.active}
          />
        );
      }}
    />
  );
};

export default EmojiInput;
