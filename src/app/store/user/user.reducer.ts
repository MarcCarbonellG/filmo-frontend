import { createReducer, on } from '@ngrx/store';
import { User } from '../../auth/models/user.interface';
import { clearUser, setUser } from './user.actions';

export interface UserState {
  user: User | null;
}

export const initialState: UserState = {
  user: null,
};

export const userReducer = createReducer(
  initialState,
  on(setUser, (state, { user }) => ({
    ...state,
    user,
  })),
  on(clearUser, (state) => ({
    ...state,
    user: null,
  }))
);
