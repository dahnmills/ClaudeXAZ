import type { Meta, StoryObj } from '@storybook/angular';
import { RadioComponent } from './radio.component';

const meta: Meta<RadioComponent> = {
  title: 'Design System/Data Entry/Radio',
  component: RadioComponent,
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
type Story = StoryObj<RadioComponent>;

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
      <ds-radio
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
        <ds-radio label="Label"                                       />
        <ds-radio label="Label" [selected]="true"                     />
        <ds-radio label="Label" [error]="true"                        />
        <ds-radio label="Label" [selected]="true" [error]="true"      />

        <ds-radio label="Label" state="Hover"                                          />
        <ds-radio label="Label" state="Hover"  [selected]="true"                       />
        <ds-radio label="Label" state="Hover"  [error]="true"                          />
        <ds-radio label="Label" state="Hover"  [selected]="true" [error]="true"        />

        <ds-radio label="Label" state="Active"                                         />
        <ds-radio label="Label" state="Active" [selected]="true"                       />
        <ds-radio label="Label" state="Active" [error]="true"                          />
        <ds-radio label="Label" state="Active" [selected]="true" [error]="true"        />

        <ds-radio label="Label" [disabled]="true"                                      />
        <ds-radio label="Label" [disabled]="true" [selected]="true"                    />
        <span></span><span></span>
      </div>
    `,
  }),
};

export const NoLabel: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:16px;align-items:center;">
        <ds-radio />
        <ds-radio [selected]="true" />
        <ds-radio [error]="true" />
        <ds-radio [selected]="true" [error]="true" />
        <ds-radio [disabled]="true" />
      </div>
    `,
  }),
};

export const Group: Story = {
  render: () => ({
    props: { value: 'b' },
    template: `
      <div style="display:flex;flex-direction:column;gap:8px;">
        <ds-radio label="Option A" [selected]="value === 'a'" (selectedChange)="value = 'a'" />
        <ds-radio label="Option B" [selected]="value === 'b'" (selectedChange)="value = 'b'" />
        <ds-radio label="Option C" [selected]="value === 'c'" (selectedChange)="value = 'c'" />
      </div>
    `,
  }),
};
