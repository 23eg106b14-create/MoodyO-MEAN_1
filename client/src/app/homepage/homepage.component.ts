import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeService, Mood } from '../services/theme.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  template: `
<app-header></app-header>

<section class="hero-section">
  <div class="container">
    <h1>Moodyo – Mood Based Audio</h1>
    <p>Let your emotions choose the rhythm.</p>
    <div class="mood-buttons">
      <button
        *ngFor="let mood of themeService.moods"
        class="mood-btn"
        (click)="selectEmotion(mood)">
        <span class="emoji">{{ themeService.getMoodData(mood).emoji }}</span>
        <span class="title">{{ themeService.getMoodData(mood).title }}</span>
        <div class="description">{{ themeService.getMoodData(mood).description }}</div>
      </button>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <p>&copy; 2025 Moodyo. All rights reserved.</p>
    <nav class="footer-nav">
      <a href="#">About</a>
      <a href="#">Contact</a>
      <a href="#">Privacy</a>
    </nav>
  </div>
</footer>
`,
  styles: [`
:host {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hero-section {
  padding: 60px 20px;
  text-align: center;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-section h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-section p {
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.8;
}

.mood-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.mood-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
  color: inherit;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  min-width: 200px;
  position: relative;
  overflow: hidden;
}

.mood-btn:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.emoji {
  font-size: 3rem;
  display: block;
  margin-bottom: 10px;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  display: block;
  margin-bottom: 5px;
}

.description {
  font-size: 0.9rem;
  opacity: 0.7;
}

.footer {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 30px 0;
  margin-top: auto;
}

.footer .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-nav {
  display: flex;
  gap: 20px;
}

.footer-nav a {
  color: inherit;
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.footer-nav a:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2.5rem;
  }

  .mood-buttons {
    gap: 15px;
  }

  .mood-btn {
    padding: 20px;
    min-width: 150px;
  }

  .footer .container {
    flex-direction: column;
    gap: 20px;
  }
}
`]
})
export class HomepageComponent {

  constructor(
    private router: Router,
    public themeService: ThemeService
  ) { }

  selectEmotion(emotion: Mood) {
    this.router.navigate(['mood', emotion]);
  }
}
