import type { Meta, StoryObj } from '@storybook/angular';
import { SegmentedControlComponent } from './segmented-control.component';

const meta: Meta<SegmentedControlComponent> = {
  title: 'Design System/Action/Segmented Control',
  component: SegmentedControlComponent,
  tags: ['autodocs'],
  argTypes: {
    selected:       { control: 'text' },
    disabled:       { control: 'boolean' },
    selectedChange: { action: 'selectedChange' },
  },
};

export default meta;
type Story = StoryObj<SegmentedControlComponent>;

export const Playground: Story = {
  args: {
    options: [
      { value: 'all',    label: 'All' },
      { value: 'active', label: 'Active' },
      { value: 'closed', label: 'Closed' },
    ],
    selected: 'active',
    disabled: false,
  },
};

export const Variants: Story = {
  render: () => ({
    props: {
      twoOptions: [
        { value: 'list', label: 'List' },
        { value: 'grid', label: 'Grid' },
      ],
      iconOptions: [
        { value: 'edit',  label: 'Edit',   icon: 'edit',         iconPos: 'left' },
        { value: 'view',  label: 'View',   icon: 'eye',          iconPos: 'left' },
        { value: 'share', label: 'Share',  icon: 'export-share', iconPos: 'left' },
      ],
      withDisabled: [
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B', disabled: true },
        { value: 'c', label: 'Option C' },
      ],
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;">
        <ds-segmented-control [options]="twoOptions"   selected="list"></ds-segmented-control>
        <ds-segmented-control [options]="iconOptions"  selected="view"></ds-segmented-control>
        <ds-segmented-control [options]="withDisabled" selected="a"></ds-segmented-control>
        <ds-segmented-control [options]="twoOptions"   selected="list" [disabled]="true"></ds-segmented-control>
      </div>
    `,
  }),
};

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
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">--semantic-color-interactive-background-main-default</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Fond sélectionné</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;"><div style="width:32px;height:16px;background:var(--semantic-color-interactive-background-main-default);border:1px solid #ccc;"></div></td>
          </tr>
          <tr>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">--semantic-color-interactive-text-neutral-default</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Texte item sélectionné</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;"><div style="width:32px;height:16px;background:var(--semantic-color-interactive-text-neutral-default);border:1px solid #ccc;"></div></td>
          </tr>
          <tr>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">--semantic-color-interactive-border-strong-alt-default</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Bordure item</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;"><div style="width:32px;height:16px;background:var(--semantic-color-interactive-border-strong-alt-default);border:1px solid #ccc;"></div></td>
          </tr>
          <tr>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">--semantic-color-static-background-main-primary</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Fond item non-sélectionné</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;"><div style="width:32px;height:16px;background:var(--semantic-color-static-background-main-primary);border:1px solid #ccc;"></div></td>
          </tr>
          <tr>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">--semantic-color-static-text-main-primary</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Texte item non-sélectionné</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;"><div style="width:32px;height:16px;background:var(--semantic-color-static-text-main-primary);border:1px solid #ccc;"></div></td>
          </tr>
          <tr>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">--semantic-color-interactive-background-light-hover</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Fond hover non-sélectionné</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;"><div style="width:32px;height:16px;background:var(--semantic-color-interactive-background-light-hover);border:1px solid #ccc;"></div></td>
          </tr>
          <tr>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">--semantic-color-interactive-border-strong-hover</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Bordure+fond hover sélectionné</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;"><div style="width:32px;height:16px;background:var(--semantic-color-interactive-border-strong-hover);border:1px solid #ccc;"></div></td>
          </tr>
          <tr>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">--semantic-border-radius-s</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Radius first/last/single</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">—</td>
          </tr>
          <tr>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">--semantic-measurement-spacing-xxs</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Padding vertical item</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">—</td>
          </tr>
          <tr>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">--semantic-measurement-spacing-m</td>
            <td style="padding:4px 10px;border:1px solid #ddd;white-space:nowrap;">Padding horizontal item</td>
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
