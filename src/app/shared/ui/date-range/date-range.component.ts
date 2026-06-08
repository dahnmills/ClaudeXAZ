import { Component, computed, input, model, signal, OnInit } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';

/**
 * layout  : 'single' = 1 calendrier visible, 'dual' = 2 calendriers côte à côte
 * selection: 'date'  = sélection d'une date unique, 'range' = sélection d'une plage
 */
export type DateRangeLayout = 'single' | 'dual';
export type DateRangeSelection = 'date' | 'range';
// Rétrocompat
export type DateRangeType = DateRangeLayout;
export type DateType = 'default' | 'unique' | 'starting' | 'between' | 'ending';
export type CalendarView = 'days' | 'months' | 'years';

interface CalendarDay {
  date:     Date;
  inMonth:  boolean;
  dateType: DateType;
  disabled: boolean;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_FULL  = ['January','February','March','April','May','June','July','August','September','October','November','December'];

@Component({
  selector: 'ds-date-range',
  standalone: true,
  imports: [IconComponent, ButtonIconComponent],
  templateUrl: './date-range.component.html',
  styleUrl: './date-range.component.scss',
})
export class DateRangeComponent implements OnInit {
  /** Nombre de calendriers affichés */
  type      = input<DateRangeLayout>('single');
  /** Mode de sélection : une date unique ou une plage start→end */
  selection = input<DateRangeSelection>('range');
  fullWidth = input<boolean>(false);
  minDate   = input<Date | null>(null);
  maxDate   = input<Date | null>(null);

  startDate = model<Date | null>(null);
  endDate   = model<Date | null>(null);

  readonly weekdays = WEEKDAYS;
  readonly monthsShort = MONTHS_SHORT;

  // Mois affichés (premier jour du mois)
  leftMonth  = signal<Date>(new Date());
  rightMonth = signal<Date>(new Date());

  // Vue active : days → months → years
  leftView  = signal<CalendarView>('days');
  rightView = signal<CalendarView>('days');

  // Année de référence pour la grille years (on affiche 12 années autour)
  leftYearBase  = signal<number>(new Date().getFullYear());
  rightYearBase = signal<number>(new Date().getFullYear());

  hoverDate = signal<Date | null>(null);

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
    this.type()      === 'dual'  ? 'ds-date-range--dual'       : '',
    this.selection() === 'date'  ? 'ds-date-range--date-only'  : '',
    this.fullWidth()             ? 'ds-date-range--full-width' : '',
  ].filter(Boolean).join(' '));

  // ── Labels ───────────────────────────────────────────────────
  monthLabel(d: Date)      { return `${MONTHS_FULL[d.getMonth()]} ${d.getFullYear()}`; }
  yearLabel(d: Date)       { return `${d.getFullYear()}`; }
  yearRangeLabel(base: number) { return `${base} – ${base + 11}`; }

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

  // ── Navigation years (grille 12) ─────────────────────────────
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
    return { date, inMonth, dateType: this._computeType(date), disabled };
  }

  private _computeType(date: Date): DateType {
    const start = this.startDate();
    const end   = this.endDate();
    const hover = this.hoverDate();
    const d = this._strip(date);

    if (!start) return 'default';
    const s = this._strip(start);

    // Fin effective = end confirmé ou hover
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
      // Sélection date unique uniquement
      this.startDate.set(day.date);
      this.endDate.set(null);
      this.leftMonth.update(d => new Date(d));
      return;
    }

    // Sélection plage (range)
    if (!start || end) {
      this.startDate.set(day.date);
      this.endDate.set(null);
    } else {
      if (day.date < start) {
        this.endDate.set(start);
        this.startDate.set(day.date);
      } else {
        this.endDate.set(day.date);
      }
      this.hoverDate.set(null);
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
      !day.inMonth  ? 'ds-date-range__day--out'      : '',
      day.disabled  ? 'ds-date-range__day--disabled'  : '',
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
