import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreatheEaseMainComponent } from './breathe-ease-main.component';

/**
 * App Root updated to mount the BreatheEase app.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BreatheEaseMainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
