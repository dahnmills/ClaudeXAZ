import type { Meta, StoryObj } from '@storybook/angular';
import { signal } from '@angular/core';
import { CellSelectionComponent } from './cell-selection.component';

const meta: Meta<CellSelectionComponent> = {
  title: 'Design System/Data Display/Table/Cell Selection',
  component: CellSelectionComponent,
  tags: ['autodocs'],
  argTypes: {
    size:        { control: 'select', options: ['s', 'm'] },
    control:     { control: 'select', options: ['drag', 'check', 'toggle', 'drag-check', 'drag-toggle'] },
    checked:     { control: 'boolean' },
    toggleValue: { control: 'boolean' },
    disabled:    { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<CellSelectionComponent>;

export const Check: Story = {
  args: { size: 'm', control: 'check', checked: false },
  render: (args) => ({
    props: { ...args, checked: signal(args.checked) },
    template: `
      <ds-cell-selection
        [size]="size"
        [control]="control"
        [checked]="checked()"
        (checkedChange)="checked.set($event)"
      />
    `,
  }),
};

export const DragCheck: Story = {
  name: 'Drag + Check',
  args: { size: 'm', control: 'drag-check', checked: true },
  render: (args) => ({
    props: { ...args, checked: signal(args.checked) },
    template: `
      <ds-cell-selection
        [size]="size"
        [control]="control"
        [checked]="checked()"
        (checkedChange)="checked.set($event)"
      />
    `,
  }),
};

export const DragOnly: Story = {
  name: 'Drag only',
  args: { size: 'm', control: 'drag' },
  render: (args) => ({
    props: args,
    template: `<ds-cell-selection [size]="size" [control]="control" />`,
  }),
};

export const Toggle: Story = {
  args: { size: 'm', control: 'toggle', toggleValue: false },
  render: (args) => ({
    props: { ...args, value: signal(args.toggleValue) },
    template: `
      <ds-cell-selection
        [size]="size"
        [control]="control"
        [toggleValue]="value()"
        (toggleChange)="value.set($event)"
      />
    `,
  }),
};

export const DragToggle: Story = {
  name: 'Drag + Toggle',
  args: { size: 'm', control: 'drag-toggle', toggleValue: true },
  render: (args) => ({
    props: { ...args, value: signal(args.toggleValue) },
    template: `
      <ds-cell-selection
        [size]="size"
        [control]="control"
        [toggleValue]="value()"
        (toggleChange)="value.set($event)"
      />
    `,
  }),
};

export const Disabled: Story = {
  args: { size: 'm', control: 'drag-check', checked: true, disabled: true },
  render: (args) => ({
    props: args,
    template: `
      <ds-cell-selection
        [size]="size"
        [control]="control"
        [checked]="checked"
        [disabled]="disabled"
      />
    `,
  }),
};
