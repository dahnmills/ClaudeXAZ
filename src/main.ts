import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';

// Le routeur lit le hash : une URL tapée sans (/prototype) tombait sur l'accueil.
// On la réécrit en /#/prototype avant le démarrage, sans recharger la page.
const { pathname, search, hash } = window.location;
if (!hash && pathname !== '/') {
  window.history.replaceState(null, '', `/#${pathname}${search}`);
}

bootstrapApplication(AppComponent, {
  providers: [provideRouter(appRoutes, withHashLocation())],
}).catch((err) => console.error(err));
