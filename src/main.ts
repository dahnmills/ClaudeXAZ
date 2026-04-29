import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(appRoutes, withHashLocation())],
}).catch((err) => console.error(err));
