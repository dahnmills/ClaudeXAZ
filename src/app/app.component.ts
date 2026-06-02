import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterContainerComponent } from './shared/ui/toaster/toaster-container.component';
import { InspectorComponent } from './shared/inspector/inspector.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToasterContainerComponent, InspectorComponent],
  template: `<router-outlet /><ds-toaster-container /><app-inspector />`,
})
export class AppComponent {}
