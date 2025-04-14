import { createAction, props } from '@ngrx/store';
import { User } from '../../auth/models/user.interface';

export const setUser = createAction('[User] Set User', props<{ user: User }>());

export const clearUser = createAction('[User] Clear User');
