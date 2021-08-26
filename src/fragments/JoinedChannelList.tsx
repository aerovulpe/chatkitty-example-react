import React, { useContext } from 'react';

import { ChatAppContext } from '../providers/ChatAppProvider';
import {
  FlexRow,
  Heading,
  HeadingVariants,
  Icon,
  Icons,
  ScrollView,
} from '../ui-kit/components';
import { usePaginator } from '../ui-kit/hooks/usePaginator';

import DetailedChannel from './DetailedChannel';

const JoinedChannelList: React.FC = () => {
  const { joinedChannels, loading, currentUser } = useContext(ChatAppContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  const {
    containerRef,
    elementRef,
    items: channels,
  } = usePaginator(() => joinedChannels(), [currentUser]);

  return (
    <>
      <FlexRow justifyContent="space-between" mx={6} marginBottom={1}>
        <Heading variant={HeadingVariants.INVERSE}>Channels</Heading>
        <Icon
          icon={Icons.Add}
          color={'onPrimary'}
          onClick={() => {
            // TODO
          }}
          title="Join channel"
          clickable
        />
      </FlexRow>

      <ScrollView ref={containerRef}>
        {channels.map((channel) => (
          <DetailedChannel key={channel.id} channel={channel} />
        ))}
        <div ref={elementRef} />
      </ScrollView>
    </>
  );
};

export default JoinedChannelList;
