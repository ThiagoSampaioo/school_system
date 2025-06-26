import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { KeycloakService } from './app/core/keycloak.service';
import { TokenInterceptor } from './app/core/token.interceptor';
import { ToastrModule } from 'ngx-toastr';


KeycloakService.init().then(() => {
  bootstrapApplication(App, {
    providers: [
      provideRouter(routes),
      importProvidersFrom(BrowserAnimationsModule, HttpClientModule, ToastrModule.forRoot()),
      {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
      }
    ]
  });
}).catch(err => {
  console.error('Error during Keycloak initialization:', err);
  alert('Failed to initialize Keycloak. Please check the console for details.');
});
