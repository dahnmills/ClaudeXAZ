import type { Meta, StoryObj } from '@storybook/angular';
import { InputTextComponent } from './input-text.component';

const meta: Meta<InputTextComponent> = {
  title: 'Design System/Data Entry/Input Text',
  component: InputTextComponent,
  tags: ['autodocs'],
  argTypes: {
    label:        { control: 'text' },
    placeholder:  { control: 'text' },
    optional:     { control: 'boolean' },
    disabled:     { control: 'boolean' },
    readonly:     { control: 'boolean' },
    error:        { control: 'boolean' },
    errorMessage: { control: 'text' },
    value:        { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<InputTextComponent>;

export const Default: Story = {
  args: {
    label: 'Nom du titulaire',
    placeholder: 'Jean Dupont',
    optional: false,
    disabled: false,
    readonly: false,
    error: false,
    errorMessage: '',
    value: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width:320px;">
        <ds-input-text
          [label]="label"
          [placeholder]="placeholder"
          [optional]="optional"
          [disabled]="disabled"
          [readonly]="readonly"
          [error]="error"
          [errorMessage]="errorMessage"
          [(value)]="value"
        ></ds-input-text>
      </div>
    `,
  }),
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:640px;">
        <ds-input-text label="Default" placeholder="Entrez votre texte..."></ds-input-text>
        <ds-input-text label="Avec valeur" value="Marie Martin"></ds-input-text>
        <ds-input-text label="Optionnel" placeholder="Optionnel" [optional]="true"></ds-input-text>
        <ds-input-text label="Read Only" value="POL-2024-001234" [readonly]="true"></ds-input-text>
        <ds-input-text label="Désactivé" placeholder="Non disponible" [disabled]="true"></ds-input-text>
        <ds-input-text label="Erreur" value="utilisateur@" [error]="true" errorMessage="Format d'email invalide"></ds-input-text>
      </div>
    `,
  }),
};

export const WithError: Story = {
  args: {
    label: 'Email',
    value: 'utilisateur@',
    error: true,
    errorMessage: "Format d'email invalide",
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width:320px;">
        <ds-input-text
          [label]="label"
          [value]="value"
          [error]="error"
          [errorMessage]="errorMessage"
        ></ds-input-text>
      </div>
    `,
  }),
};
