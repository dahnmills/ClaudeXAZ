import type { Meta, StoryObj } from '@storybook/angular';
import { FlyoutMenuItemComponent } from './flyout-menu-item.component';

const meta: Meta<FlyoutMenuItemComponent> = {
  title: 'Design System/Internals/Flyout Menu Item',
  component: FlyoutMenuItemComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Atom interne au composant `ds-flyout-menu`. Ne pas utiliser hors contexte d\'un menu déroulant.',
      },
    },
  },
  argTypes: {
    label:    { control: 'text' },
    icon:     { control: 'text' },
    disabled: { control: 'boolean' },
    selectable: { control: 'boolean' },
    selected:   { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<FlyoutMenuItemComponent>;

export const Default: Story = {
  args: { label: 'Item selection', icon: 'edit', disabled: false },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:196px;background:white;border:1px dashed #d9d9d9;">
        <ds-flyout-menu-item [label]="label" [icon]="icon" [disabled]="disabled" />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  args: { label: 'Item selection', icon: 'edit', disabled: true },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:196px;background:white;border:1px dashed #d9d9d9;">
        <ds-flyout-menu-item [label]="label" [icon]="icon" [disabled]="disabled" />
      </div>
    `,
  }),
};

export const NoIcon: Story = {
  name: 'Without icon',
  args: { label: 'Item selection', icon: null },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:196px;background:white;border:1px dashed #d9d9d9;">
        <ds-flyout-menu-item [label]="label" [icon]="icon" />
      </div>
    `,
  }),
};

/** Liste à choix unique (Figma, Data Entry > Dropdown Flyout Menu) : emplacement
 *  de coche fixe, le libellé reste aligné que l'option soit retenue ou non. */
export const Selectable: Story = {
  name: 'Single choice (selected and not selected)',
  render: () => ({
    template: `
      <div style="width:196px;background:white;border:1px dashed #d9d9d9;">
        <ds-flyout-menu-item label="Policies" [selectable]="true" [selected]="true" />
        <ds-flyout-menu-item label="Drafts" [selectable]="true" [selected]="false" />
      </div>
    `,
  }),
};
