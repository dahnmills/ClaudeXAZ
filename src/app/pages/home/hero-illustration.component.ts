import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-illustration',
  standalone: true,
  templateUrl: './hero-illustration.component.html',
  styleUrl: './hero-illustration.component.scss',
  host: { 'class': 'hero-illustration', 'aria-hidden': 'true' },
})
export class HeroIllustrationComponent {}
