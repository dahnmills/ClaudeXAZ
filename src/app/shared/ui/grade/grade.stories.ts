import type { Meta, StoryObj } from '@storybook/angular';
import { GradeComponent } from './grade.component';

const meta: Meta<GradeComponent> = {
  title: 'Design System/Data Display/Grade',
  component: GradeComponent,
  tags: ['autodocs'],
  argTypes: {
    type:  { control: 'select', options: ['manual', 'automatic', 'nc', 'na'] },
    grade: { control: { type: 'number', min: 1, max: 10, step: 1 } },
    score: { control: { type: 'number', step: 0.1 } },
    size:  { control: 'inline-radio', options: ['s', 'm'] },
  },
};

export default meta;
type Story = StoryObj<GradeComponent>;

/** Story principale — joue avec les controls pour tester toutes les combinaisons. */
export const Playground: Story = {
  args: { type: 'manual', grade: 5, score: 5.0, size: 'm' },
};

/** Vue d'ensemble : palette des 10 grades en mode manual + automatic + N/C + N/A */
export const Palette: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:24px;font-family:var(--semantic-font-family);">
        <div>
          <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;">Manual</h4>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <ds-grade type="manual" [grade]="1"  [score]="1"></ds-grade>
            <ds-grade type="manual" [grade]="2"  [score]="2"></ds-grade>
            <ds-grade type="manual" [grade]="3"  [score]="3"></ds-grade>
            <ds-grade type="manual" [grade]="4"  [score]="4"></ds-grade>
            <ds-grade type="manual" [grade]="5"  [score]="5"></ds-grade>
            <ds-grade type="manual" [grade]="6"  [score]="6"></ds-grade>
            <ds-grade type="manual" [grade]="7"  [score]="7"></ds-grade>
            <ds-grade type="manual" [grade]="8"  [score]="8"></ds-grade>
            <ds-grade type="manual" [grade]="9"  [score]="9"></ds-grade>
            <ds-grade type="manual" [grade]="10" [score]="10"></ds-grade>
          </div>
        </div>
        <div>
          <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;">Automatic</h4>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <ds-grade type="automatic" [grade]="1"  [score]="1"></ds-grade>
            <ds-grade type="automatic" [grade]="2"  [score]="2"></ds-grade>
            <ds-grade type="automatic" [grade]="3"  [score]="3"></ds-grade>
            <ds-grade type="automatic" [grade]="4"  [score]="4"></ds-grade>
            <ds-grade type="automatic" [grade]="5"  [score]="5"></ds-grade>
            <ds-grade type="automatic" [grade]="6"  [score]="6"></ds-grade>
            <ds-grade type="automatic" [grade]="7"  [score]="7"></ds-grade>
            <ds-grade type="automatic" [grade]="8"  [score]="8"></ds-grade>
            <ds-grade type="automatic" [grade]="9"  [score]="9"></ds-grade>
            <ds-grade type="automatic" [grade]="10" [score]="10"></ds-grade>
          </div>
        </div>
        <div>
          <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;">Special</h4>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <ds-grade type="nc"></ds-grade>
            <ds-grade type="na"></ds-grade>
          </div>
        </div>
      </div>
    `,
  }),
};

/** Comparaison Size M vs S */
export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;font-family:var(--semantic-font-family);">
        <div>
          <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;">Size M (default)</h4>
          <div style="display:flex;gap:8px;">
            <ds-grade type="manual" [grade]="1" [score]="1" size="m"></ds-grade>
            <ds-grade type="manual" [grade]="5" [score]="5" size="m"></ds-grade>
            <ds-grade type="manual" [grade]="10" [score]="10" size="m"></ds-grade>
          </div>
        </div>
        <div>
          <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;">Size S</h4>
          <div style="display:flex;gap:8px;">
            <ds-grade type="manual" [grade]="1" [score]="1" size="s"></ds-grade>
            <ds-grade type="manual" [grade]="5" [score]="5" size="s"></ds-grade>
            <ds-grade type="manual" [grade]="10" [score]="10" size="s"></ds-grade>
          </div>
        </div>
      </div>
    `,
  }),
};
