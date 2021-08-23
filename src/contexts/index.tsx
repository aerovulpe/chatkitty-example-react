import { CurrentUser, User } from 'chatkitty';
import React from 'react';

export interface ChatAppContext {
  login: (username: string) => void;
  currentUser: CurrentUser | null;
  users: User[];
  setUsers?: React.Dispatch<React.SetStateAction<User[]>>;
  logout: () => void;
}
