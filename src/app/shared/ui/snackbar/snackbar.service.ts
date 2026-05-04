import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Injectable,
  createComponent,
  inject,
} from '@angular/core';
import { SnackbarComponent, SnackbarTone } from './snackbar.component';

interface ShowOptions {
  tone?: SnackbarTone;
  icon?: string | null;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private appRef      = inject(ApplicationRef);
  private envInjector = inject(EnvironmentInjector);
  private current?: ComponentRef<SnackbarComponent>;
  private timer?: ReturnType<typeof setTimeout>;

  show(text: string, opts: ShowOptions = {}) {
    this.dismiss();
    const ref = createComponent(SnackbarComponent, { environmentInjector: this.envInjector });
    ref.setInput('text', text);
    ref.setInput('tone', opts.tone ?? 'neutral');
    ref.setInput('icon', opts.icon ?? null);
    this.appRef.attachView(ref.hostView);
    document.body.appendChild(ref.location.nativeElement as HTMLElement);
    this.current = ref;
    this.timer = setTimeout(() => this.dismiss(), opts.duration ?? 2000);
  }

  dismiss() {
    if (this.timer) { clearTimeout(this.timer); this.timer = undefined; }
    if (this.current) {
      this.appRef.detachView(this.current.hostView);
      this.current.destroy();
      this.current = undefined;
    }
  }
}
