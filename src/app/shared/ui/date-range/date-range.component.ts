import { Component, computed, input, model, output, signal, OnInit } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { ButtonComponent } from '../button/button.component';

export type DateRangeLayout = 'single' | 'dual';
export type DateRangeSelection = 'date' | 'range';
export type DateRangeType = DateRangeLayout;
export type DateType = 'default' | 'unique' | 'starting' | 'between' | 'ending';
export type CalendarView = 'days' | 'months' | 'years';

export interface DateRangeShortcut {
  label: string;
  getValue: () => { start: Date; end: Date } | null;
}

export interface DateRangeValue {
  startDate: Date | null;
  startTime: string;
  endDate:   Date | null;
  endTime:   string;
}

interface CalendarDay {
  date:     Date;
  inMonth:  boolean;
  dateType: DateType;
  disabled: boolean;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_FULL  = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function _nowMidnight() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function _daysAgo(n: number) {
  const d = _nowMidnight();
  d.setDate(d.getDate() - n);
  return d;
}

function _hoursAgo(n: number) {
  return new Date(Date.now() - n * 60 * 60 * 1000);
}

export const DEFAULT_SHORTCUTS: DateRangeShortcut[] = [
  { label: 'Last hour',     getValue: () => ({ start: _hoursAgo(1),  end: new Date() }) },
  { label: 'Last 24 hours', getValue: () => ({ start: _hoursAgo(24), end: new Date() }) },
  { label: 'Last 7 days',   getValue: () => ({ start: _daysAgo(7),   end: _nowMidnight() }) },
  { label: 'Last 10 days',  getValue: () => ({ start: _daysAgo(10),  end: _nowMidnight() }) },
  { label: 'Custom',        getValue: () => null },
];

@Component({
  selector: 'ds-date-range',
  standalone: true,
  imports: [IconComponent, ButtonIconComponent, ButtonComponent],
  templateUrl: './date-range.component.html',
  styleUrl: './date-range.component.scss',
})
export class DateRangeComponent implements OnInit {
  type      = input<DateRangeLayout>('single');
  selection = input<DateRangeSelection>('range');
  fullWidth = input<boolean>(false);
  minDate   = input<Date | null>(null);
  maxDate   = input<Date | null>(null);

  showShortcuts = input<boolean>(false);
  shortcuts     = input<DateRangeShortcut[]>(DEFAULT_SHORTCUTS);
  showTime      = input<boolean>(false);
  showFooter    = input<boolean>(false);

  startDate = model<Date | null>(null);
  endDate   = model<Date | null>(null);

  applied   = output<DateRangeValue>();
  cancelled = output<void>();

  readonly weekdays    = WEEKDAYS;
  readonly monthsShort = MONTHS_SHORT;

  leftMonth  = signal<Date>(new Date());
  rightMonth = signal<Date>(new Date());
  leftView   = signal<CalendarView>('days');
  rightView  = signal<CalendarView>('days');
  leftYearBase  = signal<number>(new Date().getFullYear());
  rightYearBase = signal<number>(new Date().getFullYear());
  hoverDate     = signal<Date | null>(null);

  startTime      = signal<string>('00:00');
  endTime        = signal<string>('00:00');
  activeShortcut = signal<string | null>(null);

  ngOnInit() {
    const now = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.leftMonth.set(now);
    this.leftYearBase.set(now.getFullYear());
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    this.rightMonth.set(next);
    this.rightYearBase.set(next.getFullYear());
  }

  hostClasses = computed(() => [
    'ds-date-range',
    this.type()          === 'dual'  ? 'ds-date-range--dual'           : '',
    this.selection()     === 'date'  ? 'ds-date-range--date-only'      : '',
    this.fullWidth()                 ? 'ds-date-range--full-width'     : '',
    this.showShortcuts()             ? 'ds-date-range--with-shortcuts' : '',
    this.showFooter()                ? 'ds-date-range--with-footer'    : '',
  ].filter(Boolean).join(' '));

  // ── Shortcuts ────────────────────────────────────────────────
  onShortcutClick(shortcut: DateRangeShortcut) {
    this.activeShortcut.set(shortcut.label);
    const range = shortcut.getValue();
    if (range) {
      this.startDate.set(range.start);
      this.endDate.set(range.end);
      const startMon = new Date(range.start.getFullYear(), range.start.getMonth(), 1);
      this.leftMonth.set(startMon);
      this.leftYearBase.set(startMon.getFullYear());
      if (this.type() === 'dual') {
        // Always offset right by +1 month so dual calendar never shows the same month twice
        const nextMon = new Date(startMon.getFullYear(), startMon.getMonth() + 1, 1);
        this.rightMonth.set(nextMon);
        this.rightYearBase.set(nextMon.getFullYear());
      }
    }
  }

  shortcutClass(shortcut: DateRangeShortcut): string {
    return [
      'ds-date-range__shortcut-item',
      this.activeShortcut() === shortcut.label ? 'ds-date-range__shortcut-item--active' : '',
    ].filter(Boolean).join(' ');
  }

  // ── Footer ───────────────────────────────────────────────────
  onApply() {
    this.applied.emit({
      startDate: this.startDate(),
      startTime: this.startTime(),
      endDate:   this.endDate(),
      endTime:   this.endTime(),
    });
  }

  onCancel() {
    this.cancelled.emit();
  }

  // ── Labels ───────────────────────────────────────────────────
  monthLabel(d: Date)          { return `${MONTHS_FULL[d.getMonth()]} ${d.getFullYear()}`; }
  yearLabel(d: Date)           { return `${d.getFullYear()}`; }
  yearRangeLabel(base: number) { return `${base} – ${base + 11}`; }

  dateInputValue(d: Date | null): string {
    if (!d) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  onStartDateInput(value: string) {
    if (!value) { this.startDate.set(null); return; }
    const d = new Date(value);
    if (!isNaN(d.getTime())) this.startDate.set(d);
  }

  onEndDateInput(value: string) {
    if (!value) { this.endDate.set(null); return; }
    const d = new Date(value);
    if (!isNaN(d.getTime())) this.endDate.set(d);
  }

  // ── Navigation days ──────────────────────────────────────────
  prevLeft() {
    this.leftMonth.update(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    this._syncRight();
  }
  nextLeft() {
    this.leftMonth.update(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    this._syncRight();
  }
  prevRight() {
    const prev = new Date(this.rightMonth().getFullYear(), this.rightMonth().getMonth() - 1, 1);
    if (prev > this.leftMonth()) this.rightMonth.set(prev);
  }
  nextRight() {
    this.rightMonth.update(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  private _syncRight() {
    if (this.type() === 'dual') {
      this.rightMonth.set(new Date(this.leftMonth().getFullYear(), this.leftMonth().getMonth() + 1, 1));
    }
  }

  // ── Navigation years ─────────────────────────────────────────
  prevLeftYears()  { this.leftYearBase.update(y => y - 12); }
  nextLeftYears()  { this.leftYearBase.update(y => y + 12); }
  prevRightYears() { this.rightYearBase.update(y => y - 12); }
  nextRightYears() { this.rightYearBase.update(y => y + 12); }

  yearsGrid(base: number): number[] {
    return Array.from({ length: 12 }, (_, i) => base + i);
  }

  // ── Toggle views ─────────────────────────────────────────────
  toggleLeftView() {
    if      (this.leftView() === 'days')   { this.leftView.set('months'); }
    else if (this.leftView() === 'months') { this.leftView.set('years'); }
    else                                   { this.leftView.set('months'); }
  }
  toggleRightView() {
    if      (this.rightView() === 'days')   { this.rightView.set('months'); }
    else if (this.rightView() === 'months') { this.rightView.set('years'); }
    else                                    { this.rightView.set('months'); }
  }

  pickLeftMonth(monthIdx: number) {
    this.leftMonth.update(d => new Date(d.getFullYear(), monthIdx, 1));
    this.leftView.set('days');
  }
  pickRightMonth(monthIdx: number) {
    this.rightMonth.update(d => new Date(d.getFullYear(), monthIdx, 1));
    this.rightView.set('days');
  }

  pickLeftYear(year: number) {
    this.leftMonth.update(d => new Date(year, d.getMonth(), 1));
    this.leftYearBase.set(year);
    this.leftView.set('months');
  }
  pickRightYear(year: number) {
    this.rightMonth.update(d => new Date(year, d.getMonth(), 1));
    this.rightYearBase.set(year);
    this.rightView.set('months');
  }

  // ── Calendar grid ────────────────────────────────────────────
  buildDays(month: Date): CalendarDay[] {
    const year  = month.getFullYear();
    const mon   = month.getMonth();
    const first = new Date(year, mon, 1).getDay();
    const total = new Date(year, mon + 1, 0).getDate();
    const days: CalendarDay[] = [];

    const prevTotal = new Date(year, mon, 0).getDate();
    for (let i = first - 1; i >= 0; i--)
      days.push(this._makeDay(new Date(year, mon - 1, prevTotal - i), false));
    for (let d = 1; d <= total; d++)
      days.push(this._makeDay(new Date(year, mon, d), true));
    let next = 1;
    while (days.length % 7 !== 0)
      days.push(this._makeDay(new Date(year, mon + 1, next++), false));
    return days;
  }

  private _makeDay(date: Date, inMonth: boolean): CalendarDay {
    const min = this.minDate();
    const max = this.maxDate();
    const disabled = (min !== null && date < min) || (max !== null && date > max);
    return { date, inMonth, dateType: inMonth ? this._computeType(date) : 'default', disabled };
  }

  private _computeType(date: Date): DateType {
    const start = this.startDate();
    const end   = this.endDate();
    const hover = this.hoverDate();
    const d = this._strip(date);

    if (!start) return 'default';
    const s = this._strip(start);

    const effectiveEnd = end ? this._strip(end) : (hover ? this._strip(hover) : null);

    if (!effectiveEnd) return this._sameDay(d, s) ? 'unique' : 'default';

    const lo = s <= effectiveEnd ? s : effectiveEnd;
    const hi = s <= effectiveEnd ? effectiveEnd : s;

    if (this._sameDay(d, lo) && this._sameDay(d, hi)) return 'unique';
    if (this._sameDay(d, lo)) return 'starting';
    if (this._sameDay(d, hi)) return 'ending';
    if (d > lo && d < hi)     return 'between';
    return 'default';
  }

  // ── Interaction ──────────────────────────────────────────────
  onDayClick(day: CalendarDay) {
    if (day.disabled) return;
    const start = this.startDate();
    const end   = this.endDate();

    if (this.selection() === 'date') {
      this.startDate.set(day.date);
      this.endDate.set(null);
      this.leftMonth.update(d => new Date(d));
      return;
    }

    if (!start || end) {
      this.startDate.set(day.date);
      this.endDate.set(null);
      this.activeShortcut.set('Custom');
    } else {
      if (day.date < start) {
        this.endDate.set(start);
        this.startDate.set(day.date);
      } else {
        this.endDate.set(day.date);
      }
      this.hoverDate.set(null);
      this.activeShortcut.set('Custom');
    }
    this.leftMonth.update(d => new Date(d));
  }

  onDayHover(day: CalendarDay) {
    if (this.selection() === 'range' && this.startDate() && !this.endDate()) {
      this.hoverDate.set(day.date);
      this.leftMonth.update(d => new Date(d));
    }
  }

  onMouseLeave() {
    this.hoverDate.set(null);
  }

  dayClass(day: CalendarDay): string {
    return [
      'ds-date-range__day',
      `ds-date-range__day--${day.dateType}`,
      day.disabled ? 'ds-date-range__day--disabled' : '',
    ].filter(Boolean).join(' ');
  }

  monthClass(monthIdx: number, currentMonth: Date): string {
    return [
      'ds-date-range__month-cell',
      monthIdx === currentMonth.getMonth() ? 'ds-date-range__month-cell--current' : '',
    ].filter(Boolean).join(' ');
  }

  yearClass(year: number, currentMonth: Date): string {
    return [
      'ds-date-range__year-cell',
      year === currentMonth.getFullYear() ? 'ds-date-range__year-cell--current' : '',
    ].filter(Boolean).join(' ');
  }

  private _sameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth()    === b.getMonth()    &&
           a.getDate()     === b.getDate();
  }

  private _strip(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
}
