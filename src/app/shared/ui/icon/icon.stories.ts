import type { Meta, StoryObj } from '@storybook/angular';
import { IconComponent, ICON_NAMES } from './icon.component';

const meta: Meta<IconComponent> = {
  title: 'Design System/Icon',
  component: IconComponent,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    name: { control: { type: 'select', options: ICON_NAMES } },
    size: { control: { type: 'select', options: [16, 20, 24, 32] } },
  },
  args: {
    name: 'search',
    size: 24,
  },
};

export default meta;
type Story = StoryObj<IconComponent>;

// ── Single icon (controls) ────────────────────────────────────
export const Default: Story = {};

// ── All icons at a glance ─────────────────────────────────────
export const AllIcons: Story = {
  render: () => ({
    props: { icons: ICON_NAMES },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 24px; padding: 16px;">
        @for (icon of icons; track icon) {
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 96px;">
            <ds-icon [name]="icon" [size]="24" />
            <span style="font-size: 11px; color: #767676; text-align: center; word-break: break-all;">{{ icon }}</span>
          </div>
        }
      </div>
    `,
  }),
};

// ── Sizes ─────────────────────────────────────────────────────
export const Sizes: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display: flex; align-items: center; gap: 32px; padding: 16px;">
        @for (s of [16, 20, 24, 32]; track s) {
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <ds-icon name="search" [size]="s" />
            <span style="font-size: 11px; color: #767676;">{{ s }}px</span>
          </div>
        }
      </div>
    `,
  }),
};

// ── Color via currentColor ────────────────────────────────────
export const Colors: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display: flex; align-items: center; gap: 24px; padding: 16px;">
        <ds-icon name="shield" [size]="32" style="color: #1A73E8;" />
        <ds-icon name="check-circle" [size]="32" style="color: #34A853;" />
        <ds-icon name="warning-triangle" [size]="32" style="color: #FBBC04;" />
        <ds-icon name="error-circle" [size]="32" style="color: #EA4335;" />
        <ds-icon name="info-circle" [size]="32" style="color: #767676;" />
      </div>
    `,
  }),
};

// ── By category ───────────────────────────────────────────────
export const ByCategory: Story = {
  render: () => ({
    props: {
      categories: [
        { label: 'Action', icons: ['search','filter','settings','save','download','upload','export-share','launch','refresh','archive','share','clock','clock-back','switch','bolt','location','user','users','buyers','tenant','lock','lock-open','bookmark','flag','eye','eye-off','calendar','calendar-add','calendar-checked','shield','credit-card','in-progress','play','pause','file-new','file-text','tools','contract','checklist','chart','qr-code','heart'] },
        { label: 'Editing', icons: ['plus','plus-circle','minus','minus-circle','edit','edit-compose','trash','duplicate','paperclip','link','pin','undo','redo','image'] },
        { label: 'Navigation', icons: ['home','burger','grid','context-vertical','context-horizontal','close','close-circle','minimize','maximize','arrow-left','arrow-right','arrow-up','arrow-down','arrow-first','arrow-last','chevron-left','chevron-right','chevron-up','chevron-down','chevron-double-left','chevron-double-right','unfold'] },
        { label: 'Communication', icons: ['phone','speech-bubble','mail','bell','bell-off','microphone','globe','smartphone'] },
        { label: 'Signal', icons: ['warning-triangle','info-circle','check','check-circle','error-circle','help','not-allowed'] },
        { label: 'Feedback', icons: ['star','thumb-up','thumb-down'] },
      ]
    },
    template: `
      @for (cat of categories; track cat.label) {
        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 13px; font-weight: 600; color: #333; margin: 0 0 12px; padding: 0 16px; text-transform: uppercase; letter-spacing: .05em;">{{ cat.label }}</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 16px; padding: 0 16px;">
            @for (icon of cat.icons; track icon) {
              <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; width: 80px;">
                <ds-icon [name]="icon" [size]="24" />
                <span style="font-size: 10px; color: #767676; text-align: center; word-break: break-all; line-height: 1.3;">{{ icon }}</span>
              </div>
            }
          </div>
        </div>
      }
    `,
  }),
};
