import type { Meta, StoryObj } from '@storybook/angular';
import { CheckboxComponent } from './checkbox.component';

const meta: Meta<CheckboxComponent> = {
  title: 'Design System/Data Entry/Checkbox',
  component: CheckboxComponent,
  tags: ['autodocs'],
  argTypes: {
    label:         { control: 'text' },
    checked:       { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    error:         { control: 'boolean' },
    disabled:      { control: 'boolean' },
    state:         { control: 'inline-radio', options: ['Default', 'Hover', 'Active', 'Disabled'] },
  },
};

export default meta;
type Story = StoryObj<CheckboxComponent>;

export const Default: Story = {
  args: {
    label: 'Label',
    checked: false,
    indeterminate: false,
    error: false,
    disabled: false,
    state: 'Default',
  },
  render: (args) => ({
    props: args,
    template: `
      <ds-checkbox
        [label]="label"
        [checked]="checked"
        [indeterminate]="indeterminate"
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
        <ds-checkbox label="Label"                                       />
        <ds-checkbox label="Label" [checked]="true"                      />
        <ds-checkbox label="Label" [error]="true"                        />
        <ds-checkbox label="Label" [checked]="true" [error]="true"       />

        <ds-checkbox label="Label" state="Hover"                                          />
        <ds-checkbox label="Label" state="Hover"  [checked]="true"                        />
        <ds-checkbox label="Label" state="Hover"  [error]="true"                          />
        <ds-checkbox label="Label" state="Hover"  [checked]="true" [error]="true"         />

        <ds-checkbox label="Label" state="Active"                                         />
        <ds-checkbox label="Label" state="Active" [checked]="true"                        />
        <ds-checkbox label="Label" state="Active" [error]="true"                          />
        <ds-checkbox label="Label" state="Active" [checked]="true" [error]="true"         />

        <ds-checkbox label="Label" [disabled]="true"                                      />
        <ds-checkbox label="Label" [disabled]="true" [checked]="true"                     />
        <span></span><span></span>
      </div>
    `,
  }),
};

export const Indeterminate: Story = {
  render: () => ({
    template: `
      <div style="display:grid;grid-template-columns:repeat(2, max-content);gap:16px 32px;align-items:center;">
        <ds-checkbox label="Label" [checked]="true" [indeterminate]="true"                />
        <ds-checkbox label="Label" [checked]="true" [indeterminate]="true" [error]="true" />
        <ds-checkbox label="Label" state="Hover"  [checked]="true" [indeterminate]="true" />
        <ds-checkbox label="Label" state="Hover"  [checked]="true" [indeterminate]="true" [error]="true" />
        <ds-checkbox label="Label" state="Active" [checked]="true" [indeterminate]="true" />
        <ds-checkbox label="Label" state="Active" [checked]="true" [indeterminate]="true" [error]="true" />
        <ds-checkbox label="Label" [disabled]="true" [checked]="true" [indeterminate]="true" />
        <span></span>
      </div>
    `,
  }),
};

export const NoLabel: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:16px;align-items:center;">
        <ds-checkbox />
        <ds-checkbox [checked]="true" />
        <ds-checkbox [checked]="true" [indeterminate]="true" />
        <ds-checkbox [error]="true" />
        <ds-checkbox [checked]="true" [error]="true" />
        <ds-checkbox [disabled]="true" />
      </div>
    `,
  }),
};
