import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AudioService } from '../services/audio.service';

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

<div class="audio-player" *ngIf="audioService.currentSong">
  <div class="player-left">
    <img [src]="audioService.currentSong.cover" [alt]="audioService.currentSong.title" class="player-album">
    <div class="player-info">
      <h4>{{ audioService.currentSong.title }}</h4>
      <p>{{ audioService.currentSong.artist }}</p>
    </div>
  </div>
  <div class="player-center">
    <div class="player-controls">
      <button (click)="previousSong()" class="control-btn">⏮️</button>
      <button (click)="audioService.togglePlay()" class="play-btn-large">{{ audioService.isPlaying ? '⏸' : '▶' }}</button>
      <button (click)="nextSong()" class="control-btn">⏭️</button>
    </div>
    <div class="progress-bar-container">
      <span class="time">{{ audioService.formatTime(audioService.currentTime) }}</span>
      <input type="range" class="progress-bar" min="0" [max]="audioService.duration || 100" [value]="audioService.currentTime" (input)="seek($event)">
      <span class="time">{{ audioService.formatTime(audioService.duration) }}</span>
    </div>
  </div>
  <div class="player-right">
    <button (click)="audioService.toggleMute()" class="volume-btn">{{ audioService.isMuted ? '🔇' : '🔊' }}</button>
  </div>
</div>
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

.audio-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  height: 80px;
}

.player-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.player-album {
  width: 60px;
  height: 60px;
  border-radius: 8px;
}

.player-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.player-controls {
  display: flex;
  gap: 15px;
  align-items: center;
}

.control-btn {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  transition: background 0.3s;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.play-btn-large {
  background: #1db954;
  border: none;
  color: white;
  font-size: 2rem;
  padding: 15px;
  border-radius: 50%;
  cursor: pointer;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.play-btn-large:hover {
  background: #1ed760;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 400px;
}

.time {
  font-size: 0.9rem;
  color: #b3b3b3;
  min-width: 35px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.progress-bar::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  background: #1db954;
  border-radius: 50%;
  cursor: pointer;
}

.player-right {
  display: flex;
  align-items: center;
}

.volume-btn {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  transition: background 0.3s;
}

.volume-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.player-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.player-info img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
}

.player-info h4 {
  margin: 0 0 5px 0;
  font-size: 1rem;
  font-weight: 600;
}

.player-info p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
}
`]
})
export class HeaderComponent implements OnInit, OnDestroy {
  menuOpen: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(public audioService: AudioService) {}

  ngOnInit(): void {
    // Audio service is injectable now
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  previousSong(): void {
    // Implement based on current page/playlist
  }

  nextSong(): void {
    // Implement based on current page/playlist
  }

  seek(event: any): void {
    const seekTime = Number(event.target.value);
    this.audioService.seek(seekTime);
  }
}
