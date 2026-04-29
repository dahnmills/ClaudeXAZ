import type { Meta, StoryObj } from '@storybook/angular';
import { ToggleComponent } from './toggle.component';

const meta: Meta<ToggleComponent> = {
  title: 'Design System/Data Entry/Toggle',
  component: ToggleComponent,
  tags: ['autodocs'],
  argTypes: {
    label:    { control: 'text' },
    selected: { control: 'boolean' },
    error:    { control: 'boolean' },
    disabled: { control: 'boolean' },
    state:    { control: 'inline-radio', options: ['Default', 'Hover', 'Active', 'Disabled'] },
  },
};

export default meta;
type Story = StoryObj<ToggleComponent>;

export const Default: Story = {
  args: {
    label: 'Label',
    selected: false,
    error: false,
    disabled: false,
    state: 'Default',
  },
  render: (args) => ({
    props: args,
    template: `
      <ds-toggle
        [label]="label"
        [selected]="selected"
        [error]="error"
        [disabled]="disabled"
        [state]="state"
      />
    `,
  }),
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display:grid;grid-template-columns:repeat(4, max-content);gap:16px 32px;align-items:center;">
        <ds-toggle label="Label"                                       />
        <ds-toggle label="Label" [selected]="true"                     />
        <ds-toggle label="Label" [error]="true"                        />
        <ds-toggle label="Label" [selected]="true" [error]="true"      />

        <ds-toggle label="Label" state="Hover"                                     />
        <ds-toggle label="Label" state="Hover"  [selected]="true"                  />
        <ds-toggle label="Label" state="Hover"  [error]="true"                     />
        <ds-toggle label="Label" state="Hover"  [selected]="true" [error]="true"   />

        <ds-toggle label="Label" state="Active"                                    />
        <ds-toggle label="Label" state="Active" [selected]="true"                  />
        <ds-toggle label="Label" state="Active" [error]="true"                     />
        <ds-toggle label="Label" state="Active" [selected]="true" [error]="true"   />

        <ds-toggle label="Label" [disabled]="true"                                 />
        <ds-toggle label="Label" [disabled]="true" [selected]="true"               />
        <ds-toggle label="Label" [disabled]="true" [error]="true"                  />
        <ds-toggle label="Label" [disabled]="true" [selected]="true" [error]="true"/>
      </div>
    `,
  }),
};

export const NoLabel: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:16px;align-items:center;">
        <ds-toggle />
        <ds-toggle [selected]="true" />
        <ds-toggle [error]="true" />
        <ds-toggle [selected]="true" [error]="true" />
        <ds-toggle [disabled]="true" />
      </div>
    `,
  }),
};

export const Interactive: Story = {
  render: () => ({
    props: { v1: false, v2: true },
    template: `
      <div style="display:flex;flex-direction:column;gap:8px;">
        <ds-toggle label="Notifications email" [selected]="v1" (selectedChange)="v1 = $event" />
        <ds-toggle label="Mode sombre"         [selected]="v2" (selectedChange)="v2 = $event" />
      </div>
    `,
  }),
};
