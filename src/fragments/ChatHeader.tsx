import React, { useContext } from 'react';

import { ChatSession } from '../../../chatkitty-js';
import { ChatAppContext } from '../providers/ChatAppProvider';
import { FlexRow, Icon, Icons, StyledBox, Title } from '../ui-kit/components';

interface ChatHeaderProps {
  session: ChatSession;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  session,
}: ChatHeaderProps) => {
  const { channelDisplayName, showView } = useContext(ChatAppContext);

  const properties = session.channel.properties as { description: string };

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
          heading={channelDisplayName(session.channel)}
          label={properties.description}
        ></Title>
      </FlexRow>

      <StyledBox paddingTop="5" borderBottom="light"></StyledBox>
    </StyledBox>
  );
};

export default ChatHeader;
