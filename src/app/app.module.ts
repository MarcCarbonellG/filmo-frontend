import { NgModule, PLATFORM_ID } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { localStorageSync } from 'ngrx-store-localstorage';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { authInterceptor } from './auth/interceptors/auth.interceptor';
import { ListModule } from './list/list.module';
import { MovieModule } from './movie/movie.module';
import { HomeComponent } from './pages/home/home.component';
import { SharedModule } from './shared/shared.module';
import { reducers } from './store';
import { UserModule } from './user/user.module';

export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  const isBrowser = typeof window !== 'undefined' && !!window.localStorage;

  if (isBrowser) {
    return localStorageSync({
      keys: ['user'],
      rehydrate: true,
    })(reducer);
  }

  return reducer;
}

const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    SharedModule,
    MovieModule,
    ListModule,
    UserModule,
    BrowserAnimationsModule,
    CarouselModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: authInterceptor,
      multi: true,
    },
    { provide: PLATFORM_ID, useValue: PLATFORM_ID },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
