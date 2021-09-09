import ChatKitty, {
  Channel,
  ChatKittyPaginator,
  ChatSession,
  CurrentUser,
  GetChannelsSucceededResult,
  GetCountSucceedResult,
  GetMessagesSucceededResult,
  GetUsersSucceededResult,
  isDirectChannel,
  Message,
  StartedChatSessionResult,
  succeeded,
  User,
} from 'chatkitty';
import React, { ReactElement, useEffect, useState } from 'react';

import { SentMessageResult } from '../../../chatkitty-js/src';
import ChatKittyConfiguration from '../configuration/chatkitty';
import {
  isTextMessageDraft,
  MessageDraft,
  MessageDraftType,
  TextMessageDraft,
} from '../models/message-draft';
import { LayoutState, View } from '../navigation';

const kitty = ChatKitty.getInstance(ChatKittyConfiguration.API_KEY);

interface ChatAppContext {
  login: (username: string) => void;
  currentUser: CurrentUser | null;
  online: boolean;
  users: () => Promise<ChatKittyPaginator<User> | null>;
  joinedChannels: () => Promise<ChatKittyPaginator<Channel> | null>;
  channelDisplayName: (channel: Channel) => string;
  channelDisplayPicture: (channel: Channel) => string | undefined;
  channelUnreadMessagesCount: (channel: Channel) => Promise<number>;
  channelMessages: (
    channel: Channel
  ) => Promise<ChatKittyPaginator<Message> | null>;
  startChatSession: (channel: Channel) => void;
  chatSession: ChatSession | null;
  messageDraft: TextMessageDraft;
  updateMessageDraft: (draft: TextMessageDraft) => void;
  discardMessageDraft: () => void;
  sendMessageDraft: (draft: MessageDraft) => void;
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
  users: () => Promise.prototype,
  joinedChannels: () => Promise.prototype,
  channelDisplayName: () => '',
  channelDisplayPicture: () => undefined,
  channelUnreadMessagesCount: () => Promise.prototype,
  channelMessages: () => Promise.prototype,
  startChatSession: () => {},
  chatSession: null,
  messageDraft: {
    type: MessageDraftType.Text,
    text: '',
  },
  updateMessageDraft: () => {},
  discardMessageDraft: () => {},
  sendMessageDraft: () => {},
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
  const [chatSession, setChatSession] = useState(initialValues.chatSession);
  const [messageDraft, setMessageDraft] = useState(initialValues.messageDraft);
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

    setLoading(false);
  };

  const users = async () => {
    const result = await kitty.getUsers();

    if (succeeded<GetUsersSucceededResult>(result)) {
      return result.paginator;
    } else {
      return null;
    }
  };

  const joinedChannels = async () => {
    const result = await kitty.getChannels({
      filter: { joined: true },
    });

    if (succeeded<GetChannelsSucceededResult>(result)) {
      return result.paginator;
    } else {
      return null;
    }
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

    const result = kitty.startChatSession({ channel });

    if (succeeded<StartedChatSessionResult>(result)) {
      setChatSession(result.session);

      showView('Chat');
      hideView('Menu');
    }
  };

  const channelUnreadMessagesCount = async (channel: Channel) => {
    const result = await kitty.getUnreadMessagesCount({
      channel,
    });

    if (succeeded<GetCountSucceedResult>(result)) {
      return result.count;
    } else {
      return 0;
    }
  };

  const channelMessages = async (channel: Channel) => {
    const result = await kitty.getMessages({
      channel,
    });

    if (succeeded<GetMessagesSucceededResult>(result)) {
      return result.paginator;
    } else {
      return null;
    }
  };

  const updateMessageDraft = async (draft: TextMessageDraft) => {
    if (chatSession) {
      const channel = chatSession.channel;

      await kitty.sendKeystrokes({ channel, keys: draft.text });

      setMessageDraft(draft);
    }
  };

  const discardMessageDraft = () => {
    setMessageDraft(initialValues.messageDraft);
  };

  const sendMessageDraft = async (draft: MessageDraft) => {
    if (!chatSession) {
      return;
    }

    const channel = chatSession.channel;

    if (isTextMessageDraft(draft)) {
      await kitty.sendMessage({
        channel: channel,
        body: draft.text,
      });

      discardMessageDraft();
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
        channelMessages,
        startChatSession,
        messageDraft,
        updateMessageDraft,
        discardMessageDraft,
        sendMessageDraft,
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
