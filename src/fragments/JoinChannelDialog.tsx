import React, { useContext } from 'react';

import { ChatAppContext } from '../providers/ChatAppProvider';
import {
  FlexRow,
  Heading,
  HeadingSizes,
  Icon,
  Icons,
  Modal,
  ScrollView,
} from '../ui-kit/components';
import { JoinableChannelListItemView } from '../ui-kit/components/chat';
import { usePaginator } from '../ui-kit/hooks';

const JoinChannelDialog: React.FC = () => {
  const { layout, hideJoinChannel, joinableChannelsPaginator, currentUser } =
    useContext(ChatAppContext);

  const {
    containerRef,
    boundaryRef,
    items: channels,
  } = usePaginator({
    paginator: () => joinableChannelsPaginator(),
    dependencies: [currentUser],
  });

  return (
    <Modal open={layout.joinChannel}>
      <FlexRow
        justifyContent="space-between"
        px={[3, 0]}
        paddingBottom={8}
        paddingTop={[8, 0]}
      >
        <Heading size={HeadingSizes.BIG}>Join a Channel</Heading>
        <Icon
          onClick={hideJoinChannel}
          color={'normalText'}
          icon={Icons.Cross}
          title="Close"
          clickable
        />
      </FlexRow>

      <ScrollView ref={containerRef}>
        {channels.map((channel) => {
          const properties = channel.properties as { description: string };

          return (
            <JoinableChannelListItemView
              key={channel.id}
              onClick={() => {
                // TODO
              }}
              name={channel.name}
              description={properties.description}
            />
          );
        })}
        <div ref={boundaryRef} />
      </ScrollView>
    </Modal>
  );
};

export default JoinChannelDialog;
