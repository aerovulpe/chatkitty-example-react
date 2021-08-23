import { GetUsersSucceededResult, User } from 'chatkitty';
import React, { ReactElement, useEffect, useState } from 'react';

import kitty from '../chatkitty';
import { ChatAppContext as ChatAppContextType } from '../contexts';

const initialValues: ChatAppContextType = {
  login: () => {},
  currentUser: null,
  users: [],
  logout: () => {},
};

export const ChatAppContext = React.createContext(initialValues);

interface Props {
  children: ReactElement;
}

const ChatAppContextProvider: React.FC<Props> = (props: Props) => {
  const [currentUser, setCurrentUser] = useState(initialValues.currentUser);
  const [users, setUsers] = useState<User[]>(initialValues.users);

  useEffect(() => {
    kitty.onCurrentUserChanged((user) => {
      setCurrentUser(user);
    });
  }, []);

  const login = async (username: string) => {
    await kitty.startSession({ username: username });

    kitty.getUsers({ filter: { online: true } }).then((result) => {
      setUsers((result as GetUsersSucceededResult).paginator.items);
    });

    kitty.onUserPresenceChanged(async () => {
      setUsers(
        (
          (await kitty.getUsers({
            filter: { online: true },
          })) as GetUsersSucceededResult
        ).paginator.items
      );
    });
  };

  const logout = async () => {
    await kitty.endSession();
  };

  return (
    <ChatAppContext.Provider
      value={{
        currentUser,
        users,
        setUsers,
        login,
        logout,
      }}
    >
      {props.children}
    </ChatAppContext.Provider>
  );
};

export default ChatAppContextProvider;
