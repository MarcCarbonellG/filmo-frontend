// store/index.ts

import { ActionReducerMap } from '@ngrx/store';
import { userReducer, UserState } from './user/user.reducer';

export interface AppState {
  user: UserState; // el mismo nombre que en la clave del metaReducer
}

export const reducers: ActionReducerMap<AppState> = {
  user: userReducer,
};
