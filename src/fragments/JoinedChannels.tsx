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

import DetailedChannel from './DetailedChannel';

const JoinedChannels: React.FC = () => {
  const { joinedChannels: channels, loading } = useContext(ChatAppContext);

  if (loading) {
    return <div>Loading...</div>;
  }

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

      <ScrollView>
        {channels.map((channel) => (
          <DetailedChannel key={channel.id} channel={channel} />
        ))}
        <div />
      </ScrollView>
    </>
  );
};

export default JoinedChannels;
