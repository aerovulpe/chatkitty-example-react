import { Channel } from 'chatkitty';
import React, { useContext } from 'react';

import { ChatAppContext } from '../providers/ChatAppProvider';
import { FlexRow, Icon, Icons, StyledBox, Title } from '../ui-kit/components';

interface ChatHeaderProps {
  channel: Channel;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  channel,
}: ChatHeaderProps) => {
  const { channelDisplayName, showMenu } = useContext(ChatAppContext);

  const properties = channel.properties as { description: string };

  return (
    <StyledBox px="6" paddingTop="7" bg={['backgrounds.panel', 'transparent']}>
      <FlexRow justifyContent="space-between">
        <StyledBox display={['block', 'none']} color="active" marginRight="7">
          <Icon
            icon={Icons.Back}
            onClick={() => {
              showMenu();
            }}
            title="Back"
            clickable
          />
        </StyledBox>

        <Title
          heading={'#' + channelDisplayName(channel)}
          headingProps={{ bold: true }}
          label={properties.description}
        />
      </FlexRow>

      <StyledBox paddingTop="5" borderBottom="light" />
    </StyledBox>
  );
};

export default ChatHeader;
