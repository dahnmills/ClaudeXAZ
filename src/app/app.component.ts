import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToasterContainerComponent } from './shared/ui/toaster/toaster-container.component';
import { InspectorComponent } from './shared/inspector/inspector.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToasterContainerComponent, InspectorComponent],
  template: `
    <router-outlet />
    <ds-toaster-container />
    @if (showInspector()) {
      <app-inspector />
    }
  `,
})
export class AppComponent {
  private router = inject(Router);

  showInspector = signal(this.inDevSandbox(this.router.url));

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.showInspector.set(this.inDevSandbox(e.urlAfterRedirects)));
  }

  private inDevSandbox(url: string): boolean {
    const path = url.split('?')[0].split('#')[0];
    if (path === '/') return false;
    return !['/review', '/user-testing', '/results'].some(
      (p) => path === p || path.startsWith(p + '/'),
    );
  }
}
