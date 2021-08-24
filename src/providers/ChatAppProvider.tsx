import ChatKitty, {
  Channel,
  ChatSession,
  CurrentUser,
  GetChannelsSucceededResult,
  GetCountSucceedResult,
  GetUsersSucceededResult,
  isDirectChannel,
  StartedChatSessionResult,
  succeeded,
  User,
} from 'chatkitty';
import React, { ReactElement, useEffect, useState } from 'react';

import ChatKittyConfiguration from '../configuration/chatkitty';
import { LayoutState, View } from '../navigation';

const kitty = ChatKitty.getInstance(ChatKittyConfiguration.API_KEY);

interface ChatAppContext {
  login: (username: string) => void;
  currentUser: CurrentUser | null;
  online: boolean;
  users: User[];
  joinedChannels: Channel[];
  channelDisplayName: (channel: Channel) => string;
  channelDisplayPicture: (channel: Channel) => string | undefined;
  channelUnreadMessagesCount: (channel: Channel) => Promise<number>;
  startChatSession: (channel: Channel) => void;
  chatSession: ChatSession | null;
  loading: boolean;
  layout: LayoutState;
  showView: (view: View) => void;
  hideView: (view: View) => void;
  logout: () => void;
}

const initialValues: ChatAppContext = {
  login: () => {},
  currentUser: null,
  online: false,
  users: [],
  joinedChannels: [],
  channelDisplayName: () => '',
  channelDisplayPicture: () => undefined,
  channelUnreadMessagesCount: () => Promise.prototype,
  startChatSession: () => {},
  chatSession: null,
  loading: false,
  layout: { menu: false, chat: false },
  showView: () => {},
  hideView: () => {},
  logout: () => {},
};

export const ChatAppContext = React.createContext(initialValues);

interface ChatAppContextProviderProps {
  children: ReactElement | JSX.Element[] | null;
}

const ChatAppContextProvider: React.FC<ChatAppContextProviderProps> = ({
  children,
}: ChatAppContextProviderProps) => {
  const [currentUser, setCurrentUser] = useState(initialValues.currentUser);
  const [online, setOnline] = useState(initialValues.online);
  const [users, setUsers] = useState(initialValues.users);
  const [joinedChannels, setJoinedChannels] = useState(
    initialValues.joinedChannels
  );
  const [chatSession, setChatSession] = useState(initialValues.chatSession);
  const [loading, setLoading] = useState(initialValues.loading);
  const [layout, setLayout] = useState(initialValues.layout);

  const views: Set<View> = new Set();

  const getLayout = (): LayoutState => {
    return {
      menu: views.has('Menu'),
      chat: views.has('Chat'),
    };
  };

  const showView = (view: View) => {
    views.add(view);

    setLayout(getLayout());
  };

  const hideView = (view: View) => {
    views.delete(view);

    setLayout(getLayout());
  };

  useEffect(() => {
    kitty.onCurrentUserChanged((user) => {
      setCurrentUser(user);
    });

    kitty.onCurrentUserOnline(() => {
      setOnline(true);
    });

    kitty.onCurrentUserOffline(() => {
      setOnline(false);
    });
  }, []);

  const login = async (username: string) => {
    setLoading(true);

    await kitty.startSession({ username: username });

    const getUsers = await kitty.getUsers();

    if (succeeded<GetUsersSucceededResult>(getUsers)) {
      setUsers(getUsers.paginator.items);
    }

    kitty.onUserPresenceChanged((user) => {
      setUsers([...users, user]);
    });

    const getJoinedChannels = await kitty.getChannels({
      filter: { joined: true },
    });

    if (succeeded<GetChannelsSucceededResult>(getJoinedChannels)) {
      setJoinedChannels(getJoinedChannels.paginator.items);
    }

    kitty.onChannelJoined((channel) => {
      setJoinedChannels([...joinedChannels, channel]);
    });

    setLoading(false);
  };

  const channelDisplayName = (channel: Channel): string => {
    if (isDirectChannel(channel)) {
      return channel.members
        .filter((member) => member.id !== currentUser?.id)
        .map((member) => member.displayName)
        .join(', ');
    } else {
      return channel.name;
    }
  };

  const channelDisplayPicture = (channel: Channel): string | undefined => {
    if (isDirectChannel(channel) && channel.members.length === 2) {
      return channel.members
        .filter((member) => member.id !== currentUser?.id)
        .map((member) => member.displayPictureUrl)[0];
    } else {
      return undefined;
    }
  };

  const startChatSession = (channel: Channel): void => {
    chatSession?.end();

    const startChatSession = kitty.startChatSession({ channel });

    if (succeeded<StartedChatSessionResult>(startChatSession)) {
      setChatSession(startChatSession.session);

      showView('Chat');
      hideView('Menu');
    }
  };

  const channelUnreadMessagesCount = async (channel: Channel) => {
    const getUnreadMessagesCount = await kitty.getUnreadMessagesCount({
      channel,
    });

    if (succeeded<GetCountSucceedResult>(getUnreadMessagesCount)) {
      return getUnreadMessagesCount.count;
    } else {
      return 0;
    }
  };

  const logout = async () => {
    await kitty.endSession();
  };

  return (
    <ChatAppContext.Provider
      value={{
        currentUser,
        online,
        users,
        joinedChannels,
        channelDisplayName,
        channelDisplayPicture,
        channelUnreadMessagesCount,
        startChatSession,
        chatSession,
        loading,
        layout,
        showView,
        hideView,
        login,
        logout,
      }}
    >
      {children}
    </ChatAppContext.Provider>
  );
};

export default ChatAppContextProvider;
