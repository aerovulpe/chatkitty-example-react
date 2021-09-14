import { Channel } from 'chatkitty';
import React, { useContext, useEffect, useState } from 'react';

import { ChatAppContext } from '../providers/ChatAppProvider';
import { JoinedChannelListItemView } from '../ui-kit/components/chat/channel/joined-channel-list-item-view';

interface MyChannelListItemProps {
  channel: Channel;
}

const MyChannelListItem: React.FC<MyChannelListItemProps> = ({
  channel,
}: MyChannelListItemProps) => {
  const {
    channel: selectedChannel,
    channelDisplayName,
    channelDisplayPicture,
    channelUnreadMessagesCount,
    showChat,
  } = useContext(ChatAppContext);

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    channelUnreadMessagesCount(channel).then((count) =>
      setUnreadMessagesCount(count)
    );
  }, [channel]);

  return (
    <JoinedChannelListItemView
      id={channel.id}
      name={channelDisplayName(channel)}
      displayPicture={channelDisplayPicture(channel)}
      onLeave={() => {
        // TODO
      }}
      selected={channel.id === selectedChannel?.id}
      key={channel.id}
      unreadMessageCount={unreadMessagesCount}
      onClick={() => showChat(channel)}
    />
  );
};

export default MyChannelListItem;
