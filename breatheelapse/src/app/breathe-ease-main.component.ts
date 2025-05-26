/* global window, clearInterval */
import { Component } from '@angular/core';

/**
 * BreatheEase Main Container Component
 * Handles: BOLT Test guide & timer, Score recording, Progress (history graph), Health Insights.
 * Designed for a clean light UI and responsive mobile/web layout.
 */

// PUBLIC_INTERFACE
@Component({
  selector: 'breathe-ease-main',
  templateUrl: './breathe-ease-main.component.html',
  styleUrls: ['./breathe-ease-main.component.css']
})
export class BreatheEaseMainComponent {
  // State for navigation between the feature tabs (test, history, insights)
  currentTab: 'test' | 'history' | 'insights' = 'test';

  // --- BOLT Test State ---
  testStep: 'intro' | 'instructions' | 'countdown' | 'hold' | 'result' = 'intro';
  testStartTime: number | null = null;
  boltResult: number | null = null;
  userInputName: string = '';
  timer: any = null;
  countdown: number = 3; // For pre-test countdown

  // --- Score Data ---
  boltScores: Array<{ date: string, score: number }> = this.loadScores();

  // --- Feature: Progress/History chart config ---
  get chartLabels() { return this.boltScores.map(d => d.date); }
  get chartData() { return this.boltScores.map(d => d.score); }

  // --- UI Theme Colors ---
  palette = {
    primary: '#1976D2',
    secondary: '#FFFFFF',
    accent: '#43A047',
  };

  // --- BOLT Test Steps ---
  // PUBLIC_INTERFACE
  startTest() {
    this.testStep = 'instructions';
    this.boltResult = null;
    this.countdown = 3;
  }

  // PUBLIC_INTERFACE
  beginCountdown() {
    this.testStep = 'countdown';
    this.countdown = 3;
    this.runCountdown();
  }

  runCountdown() {
    if (this.countdown > 0) {
      this.timer = window.setTimeout(() => {
        this.countdown--;
        this.runCountdown();
      }, 1000);
    } else {
      this.testStep = 'hold';
      this.startHolding();
    }
  }

  startHolding() {
    this.testStartTime = Date.now();
    this.timer = window.setInterval(() => { }, 1000); // Timer running in background
  }

  // PUBLIC_INTERFACE
  finishTest() {
    if (this.testStep === 'hold' && this.testStartTime) {
      const duration = Math.round((Date.now() - this.testStartTime) / 1000);
      window.clearInterval(this.timer);
      this.testStep = 'result';
      this.boltResult = duration;
      this.testStartTime = null;
    }
  }

  // PUBLIC_INTERFACE
  saveScore() {
    if (this.boltResult != null) {
      const today = new Date();
      const dstr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      this.boltScores.push({ date: dstr, score: this.boltResult });
      this.saveScores();
      this.testStep = 'intro';
      this.boltResult = null;
    }
  }

  // --- Score Storage (local, could be upgraded to backend) ---
  loadScores(): Array<{ date: string, score: number }> {
    try {
      const s = window.localStorage.getItem('boltScores');
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  }

  saveScores() {
    window.localStorage.setItem('boltScores', JSON.stringify(this.boltScores));
  }

  // PUBLIC_INTERFACE
  switchTab(tab: 'test' | 'history' | 'insights') {
    this.currentTab = tab;
  }

  // --- Health Insights: feedback based on scores ---
  // PUBLIC_INTERFACE
  getInsight(): { title: string; message: string; color: string } {
    if (!this.boltScores.length) return {
      title: "Start Testing",
      message: "Take your first BOLT test to receive breathing health tips!",
      color: this.palette.accent
    };
    const latest = this.boltScores[this.boltScores.length - 1].score;
    if (latest < 10) {
      return {
        title: 'Low BOLT Score',
        message: "Your BOLT score suggests possible breathing issues. Try nasal breathing, gentle breath holds, and consult resources.",
        color: "#f44336"
      };
    }
    if (latest < 20) {
      return {
        title: "Moderate BOLT Score",
        message: "Your breathing could still improve. Practice relaxed breath holds and nose breathing exercises daily.",
        color: "#FFA000"
      };
    }
    if (latest < 30) {
      return {
        title: "Good BOLT Score",
        message: "You have solid breathing efficiency. Maintain the habit and continue mindful breathing practices.",
        color: this.palette.primary
      };
    }
    return {
      title: "Excellent BOLT Score",
      message: "You have outstanding breathing health—keep up your routine, and explore advanced breathing exercises as desired!",
      color: this.palette.accent
    };
  }

  // --- Cleanup (for timers) ---
  ngOnDestroy() { if (this.timer) clearInterval(this.timer); }
}
