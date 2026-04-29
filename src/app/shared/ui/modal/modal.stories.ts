import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { signal } from '@angular/core';
import { ModalComponent } from './modal.component';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

const meta: Meta<ModalComponent> = {
  title: 'Design System/Modal',
  component: ModalComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [ButtonComponent, IconComponent] }),
  ],
  argTypes: {
    size:            { control: 'select', options: ['small', 'medium', 'large', 'xlarge'] },
    title:           { control: 'text' },
    footer:          { control: 'boolean' },
    showBack:        { control: 'boolean' },
    backLabel:       { control: 'text' },
    closeOnBackdrop: { control: 'boolean' },
    closeOnEscape:   { control: 'boolean' },
    contentHeight:   { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<ModalComponent>;

export const Medium: Story = {
  args: {
    size:            'medium',
    title:           'Title',
    showBack:        true,
    backLabel:       'Back',
    closeOnBackdrop: true,
    closeOnEscape:   true,
    contentHeight:   '460px',
  },
  render: (args) => ({
    props: { ...args, isOpen: signal(true) },
    template: `
      <ds-button type="primary" (clicked)="isOpen.set(true)">Open modal</ds-button>

      <ds-modal
        [open]="isOpen()"
        [size]="size"
        [title]="title"
        [showBack]="showBack"
        [backLabel]="backLabel"
        [closeOnBackdrop]="closeOnBackdrop"
        [closeOnEscape]="closeOnEscape"
        [contentHeight]="contentHeight"
        (closed)="isOpen.set(false)"
      >
        <p>The credit policy gives buyers up to 60 days to settle invoices. Review the terms below before confirming.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

        <div slot="actions">
          <ds-button type="tertiary" (clicked)="isOpen.set(false)">Cancel</ds-button>
          <ds-button type="secondary">Save draft</ds-button>
          <ds-button type="primary" (clicked)="isOpen.set(false)">Confirm</ds-button>
        </div>
      </ds-modal>
    `,
  }),
};

export const WithoutFooter: Story = {
  name: 'Without footer',
  args: { size: 'medium', title: 'Read-only details', footer: false, contentHeight: '460px' },
  render: (args) => ({
    props: { ...args, isOpen: signal(true) },
    template: `
      <ds-button type="primary" (clicked)="isOpen.set(true)">Open modal</ds-button>

      <ds-modal
        [open]="isOpen()"
        [size]="size"
        [title]="title"
        [footer]="footer"
        [contentHeight]="contentHeight"
        (closed)="isOpen.set(false)"
      >
        <p>This modal has no footer — close via the X button, the backdrop, or Escape.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </ds-modal>
    `,
  }),
};

export const Small: Story = {
  args: { size: 'small', title: 'Confirm action', showBack: false, contentHeight: '200px' },
  render: (args) => ({
    props: { ...args, isOpen: signal(true) },
    template: `
      <ds-button type="primary" (clicked)="isOpen.set(true)">Open small modal</ds-button>

      <ds-modal
        [open]="isOpen()"
        [size]="size"
        [title]="title"
        [showBack]="showBack"
        [contentHeight]="contentHeight"
        (closed)="isOpen.set(false)"
      >
        <p>Are you sure you want to proceed?</p>

        <div slot="actions">
          <ds-button type="secondary" (clicked)="isOpen.set(false)">Cancel</ds-button>
          <ds-button type="primary" (clicked)="isOpen.set(false)">OK</ds-button>
        </div>
      </ds-modal>
    `,
  }),
};

export const Large: Story = {
  args: { size: 'large', title: 'Buyer details', showBack: true, contentHeight: '500px' },
  render: (args) => ({
    props: { ...args, isOpen: signal(true) },
    template: `
      <ds-button type="primary" (clicked)="isOpen.set(true)">Open large modal</ds-button>

      <ds-modal
        [open]="isOpen()"
        [size]="size"
        [title]="title"
        [showBack]="showBack"
        [contentHeight]="contentHeight"
        (closed)="isOpen.set(false)"
        (backClicked)="isOpen.set(false)"
      >
        <p>Full buyer details here. Use this size for complex forms or rich data displays.</p>
        @for (n of [].constructor(8); track $index) {
          <p>Section {{ $index + 1 }} — Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        }

        <div slot="actions">
          <ds-button type="primary" (clicked)="isOpen.set(false)">Done</ds-button>
        </div>
      </ds-modal>
    `,
  }),
};

export const XLarge: Story = {
  name: 'XLarge',
  args: { size: 'xlarge', title: 'Wide modal', showBack: false, contentHeight: '500px' },
  render: (args) => ({
    props: { ...args, isOpen: signal(true) },
    template: `
      <ds-button type="primary" (clicked)="isOpen.set(true)">Open xlarge modal</ds-button>

      <ds-modal
        [open]="isOpen()"
        [size]="size"
        [title]="title"
        [showBack]="showBack"
        [contentHeight]="contentHeight"
        (closed)="isOpen.set(false)"
      >
        <p>For very wide content layouts.</p>

        <div slot="actions">
          <ds-button type="primary" (clicked)="isOpen.set(false)">Close</ds-button>
        </div>
      </ds-modal>
    `,
  }),
};
