import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Component, inject } from '@angular/core';
import { ToasterContainerComponent } from './toaster-container.component';
import { ToasterService, type ToastTone } from './toaster.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'demo-toaster',
  standalone: true,
  imports: [ToasterContainerComponent, ButtonComponent],
  template: `
    <div style="display:flex;gap:12px;flex-wrap:wrap;padding:32px;">
      <ds-button (clicked)="show('success')">Show Success</ds-button>
      <ds-button (clicked)="show('info')">Show Info</ds-button>
      <ds-button (clicked)="show('warning')">Show Warning</ds-button>
      <ds-button (clicked)="show('error')">Show Error</ds-button>
    </div>
    <ds-toaster-container />
  `,
})
class DemoToasterHost {
  private readonly toaster = inject(ToasterService);
  show(tone: ToastTone) {
    this.toaster.show('This is the content displayed', {
      title: 'Title',
      tone,
      actionLabel: 'Action',
      duration: 5000,
    });
  }
}

const meta: Meta<DemoToasterHost> = {
  title: 'Design System/Feedback/Toaster',
  component: DemoToasterHost,
  decorators: [moduleMetadata({ imports: [DemoToasterHost] })],
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<DemoToasterHost>;

export const Playground: Story = {
  render: () => ({ template: `<demo-toaster />` }),
};
