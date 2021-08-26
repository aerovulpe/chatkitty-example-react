import React, { useContext } from 'react';

import { Channel } from '../../../chatkitty-js';
import { ChatAppContext } from '../providers/ChatAppProvider';
import { FlexRow, Icon, Icons, StyledBox, Title } from '../ui-kit/components';

interface ChatHeaderProps {
  channel: Channel;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  channel,
}: ChatHeaderProps) => {
  const { channelDisplayName, showView } = useContext(ChatAppContext);

  const properties = channel.properties as { description: string };

  return (
    <StyledBox px="6" paddingTop="7" bg={['backgrounds.panel', 'transparent']}>
      <FlexRow justifyContent="space-between">
        <StyledBox display={['block', 'none']} color="active" marginRight="7">
          <Icon
            icon={Icons.Back}
            onClick={() => {
              showView('Menu');
            }}
            title="Back"
            clickable
          />
        </StyledBox>

        <Title
          heading={channelDisplayName(channel)}
          label={properties.description}
        ></Title>
      </FlexRow>

      <StyledBox paddingTop="5" borderBottom="light"></StyledBox>
    </StyledBox>
  );
};

export default ChatHeader;
