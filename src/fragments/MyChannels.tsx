import React, { useContext, useEffect } from 'react';

import { ChatAppContext } from '../providers/ChatAppProvider';
import {
  FlexRow,
  Heading,
  HeadingVariants,
  Icon,
  Icons,
  ScrollView,
} from '../ui-kit/components';
import { usePaginator } from '../ui-kit/hooks';

import MyChannelListItem from './MyChannelListItem';

const MyChannels: React.FC = () => {
  const {
    joinedChannelsPaginator,
    onJoinedChannel,
    loading,
    currentUser,
    showChat,
    showJoinChannel,
  } = useContext(ChatAppContext);

  const {
    items: channels,
    append,
    containerRef,
    boundaryRef,
  } = usePaginator({
    paginator: () => joinedChannelsPaginator(),
    onInitialPageFetched: (items) => {
      if (items) {
        showChat(items[0]);
      }
    },
    dependencies: [currentUser],
  });

  useEffect(() => {
    return onJoinedChannel((channel) => {
      append([channel]);
    });
  }, [currentUser]);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <>
      <FlexRow justifyContent="space-between" mx={6} marginBottom={1}>
        <Heading variant={HeadingVariants.INVERSE}>Channels</Heading>
        <Icon
          icon={Icons.Add}
          color={'onPrimary'}
          onClick={() => {
            showJoinChannel();
          }}
          title="Join channel"
          clickable
        />
      </FlexRow>

      <ScrollView ref={containerRef}>
        {channels.map((channel) => (
          <MyChannelListItem key={channel.id} channel={channel} />
        ))}
        <div ref={boundaryRef} />
      </ScrollView>
    </>
  );
};

export default MyChannels;
