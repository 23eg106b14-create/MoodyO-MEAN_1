import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
<header class="header">
  <div class="container">
    <div class="logo">
      <h1>🎧 Moodyo</h1>
    </div>
    <nav class="nav">
      <ul class="nav-list" [class.open]="menuOpen">
        <li><a routerLink="/">Home</a></li>
        <li><a routerLink="/admin">Admin</a></li>
      </ul>
      <div class="hamburger" (click)="toggleMenu()">
        ☰
      </div>
    </nav>
  </div>
</header>
`,
  styles: [`
.header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo h1 {
  font-size: 2rem;
  font-weight: 700;
  color: inherit;
}

.nav-list {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-list a {
  text-decoration: none;
  color: inherit;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-list a:hover {
  color: #007bff;
}

.hamburger {
  display: none;
  cursor: pointer;
}

@media (max-width: 768px) {
  .hamburger {
    display: block;
  }

  .nav-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 1rem 0;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
  }

  .nav-list.open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
}
`]
})
export class HeaderComponent {
  menuOpen: boolean = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
