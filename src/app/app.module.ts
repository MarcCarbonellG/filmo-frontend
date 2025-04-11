import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { authInterceptor } from './auth/interceptors/auth.interceptor';
import { MovieModule } from './movie/movie.module';
import { HomeComponent } from './pages/home/home.component';
import { SharedModule } from './shared/shared.module';
import { userReducer } from './store/user/user.reducer';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    SharedModule,
    MovieModule,
    StoreModule.forRoot({ user: userReducer }),
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: authInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
