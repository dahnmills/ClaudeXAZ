import type { Meta, StoryObj } from '@storybook/angular';
import { CollapsibleTableComponent } from './collapsible-table.component';

const meta: Meta<CollapsibleTableComponent> = {
  title: 'Design System/Data Display/Collapsible Table',
  component: CollapsibleTableComponent,
  tags: ['autodocs'],
  argTypes: {
    category: { control: 'text' },
    icon:     { control: 'text' },
    open:     { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<CollapsibleTableComponent>;

export const Tokens: Story = {
  name: 'Design Tokens',
  render: () => ({
    template: `
      <table style="border-collapse:collapse;width:auto;font-family:monospace;font-size:12px;">
        <thead>
          <tr style="background:#f5f5f5;text-align:left;">
            <th style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Token</th>
            <th style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Rôle</th>
            <th style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Aperçu</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">--semantic-color-static-background-main-secondary</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Fond header</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;"><div style="width:32px;height:16px;background:var(--semantic-color-static-background-main-secondary);border:1px solid #ccc;"></div></td>
          </tr>
          <tr>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">--semantic-color-static-background-main-primary</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Fond body</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;"><div style="width:32px;height:16px;background:var(--semantic-color-static-background-main-primary);border:1px solid #ccc;"></div></td>
          </tr>
          <tr>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">--semantic-color-static-text-main-tertiary</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Texte catégorie</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;"><div style="width:32px;height:16px;background:var(--semantic-color-static-text-main-tertiary);border:1px solid #ccc;"></div></td>
          </tr>
          <tr>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">--semantic-color-interactive-icon-strong-alt-default</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Icône + chevron</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;"><div style="width:32px;height:16px;background:var(--semantic-color-interactive-icon-strong-alt-default);border:1px solid #ccc;"></div></td>
          </tr>
          <tr>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">--semantic-color-interactive-background-light-alt-hover</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Fond hover header</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;"><div style="width:32px;height:16px;background:var(--semantic-color-interactive-background-light-alt-hover);border:1px solid #ccc;"></div></td>
          </tr>
          <tr>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">--semantic-color-interactive-background-light-alt-active</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Fond active header</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;"><div style="width:32px;height:16px;background:var(--semantic-color-interactive-background-light-alt-active);border:1px solid #ccc;"></div></td>
          </tr>
          <tr>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">--semantic-measurement-spacing-s</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Gap + padding header</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">—</td>
          </tr>
          <tr>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">--semantic-measurement-opacity-disabled</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Opacité disabled</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">—</td>
          </tr>
        </tbody>
      </table>
    `,
  }),
};

export const Playground: Story = {
  args: { category: 'Category', icon: 'edit', open: true, disabled: false },
  render: (args) => ({
    props: args,
    template: `
      <ds-collapsible-table [category]="category" [icon]="icon" [(open)]="open" [disabled]="disabled">
        <p>Body content — typically a table, list, or properties panel.</p>
      </ds-collapsible-table>
    `,
  }),
};
