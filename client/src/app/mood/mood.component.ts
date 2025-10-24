import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SongService, Song } from '../services/song.service';
import { ThemeService, Mood } from '../services/theme.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-mood',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterLink],
  template: `
<app-header></app-header>

<main class="mood-main">
  <div class="container">
    <section class="mood-hero">
      <div class="mood-info">
        <span class="emoji">{{ themeService.getMoodData(emotion).emoji }}</span>
        <h1>{{ themeService.getMoodData(emotion).title }} Mood</h1>
        <p>{{ themeService.getMoodData(emotion).description }}</p>
      </div>
      <a routerLink="/" class="back-link">← Back to Home</a>
    </section>

    <section class="mood-player">
      <div class="songs-grid">
        <div *ngFor="let song of songs; trackBy: trackByFn" class="song-card" (click)="playSong(song)">
          <div class="album-art">
            <img [src]="song.cover" [alt]="song.title">
            <div class="play-overlay">▶</div>
          </div>
          <div class="song-info">
            <h3>{{ song.title }}</h3>
            <p>{{ song.artist }}</p>
          </div>
        </div>
      </div>
      <p *ngIf="songs.length === 0">No songs found for this mood. Add some in the admin panel!</p>
    </section>

    <div class="audio-player" *ngIf="currentSong">
      <div class="player-left">
        <img [src]="currentSong.cover" [alt]="currentSong.title" class="player-album">
        <div class="player-info">
          <h4>{{ currentSong.title }}</h4>
          <p>{{ currentSong.artist }}</p>
        </div>
      </div>
      <div class="player-center">
        <div class="player-controls">
          <button (click)="previousSong()" class="control-btn">⏮️</button>
          <button (click)="togglePlay()" class="play-btn-large">{{ isPlaying ? '⏸' : '▶' }}</button>
          <button (click)="nextSong()" class="control-btn">⏭️</button>
        </div>
        <div class="progress-bar-container">
          <span class="time">{{ formatTime(currentTime) }}</span>
          <input type="range" class="progress-bar" min="0" [max]="duration || 100" [value]="currentTime" (input)="seek($event)">
          <span class="time">{{ formatTime(duration) }}</span>
        </div>
      </div>
      <div class="player-right">
        <button (click)="toggleMute()" class="volume-btn">{{ isMuted ? '🔇' : '🔊' }}</button>
      </div>
    </div>
  </div>
</main>

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
.mood-main {
  margin-top: 80px;
  flex: 1;
}

.mood-hero {
  padding: 40px 20px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mood-info .emoji {
  font-size: 4rem;
  display: block;
  margin-bottom: 10px;
}

.mood-info h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.mood-info p {
  font-size: 1.2rem;
  opacity: 0.8;
}

.back-link {
  color: inherit;
  text-decoration: none;
  font-weight: 500;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  transition: background 0.3s;
}

.back-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

.mood-player {
  padding: 40px 20px;
}

.songs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.song-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.song-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.album-art {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.album-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.song-card:hover .album-art img {
  transform: scale(1.05);
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.song-card:hover .play-overlay {
  opacity: 1;
}

.song-info {
  padding: 20px;
}

.song-info h3 {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.song-info p {
  margin: 0;
  opacity: 0.8;
  font-size: 1rem;
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

.player-controls {
  display: flex;
  gap: 15px;
}

.player-controls button {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  transition: background 0.3s;
}

.player-controls button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.play-btn {
  background: rgba(255, 255, 255, 0.2);
  width: 50px;
  height: 50px;
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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
  .mood-hero {
    flex-direction: column;
    gap: 20px;
  }

  .mood-info h1 {
    font-size: 2rem;
  }

  .songs-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }

  .audio-player {
    padding: 10px;
    flex-direction: column;
    gap: 10px;
  }

  .player-info {
    flex: 1;
  }

  .player-controls {
    justify-content: center;
  }

  .footer .container {
    flex-direction: column;
    gap: 20px;
  }
}
`]
})
export class MoodComponent implements OnInit {
  emotion: Mood = 'happy';
  songs: Song[] = [];
  currentSongIndex: number = 0;
  currentSong: Song | null = null;
  audio: HTMLAudioElement | null = null;
  isPlaying: boolean = false;
  isMuted: boolean = false;
  currentTime: number = 0;
  duration: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private songService: SongService,
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const emotionParam = params.get('emotion');
      if (emotionParam && this.themeService.moods.includes(emotionParam as Mood)) {
        this.emotion = emotionParam as Mood;
        this.themeService.setMood(this.emotion);
        this.loadSongs();
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  loadSongs(): void {
    this.songService.getSongsByEmotion(this.emotion).subscribe(songs => this.songs = songs);
  }

  playSong(song: Song): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.audio = new Audio(song.src);
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio?.duration || 0;
    });
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio?.currentTime || 0;
    });
    this.audio.addEventListener('ended', () => {
      this.nextSong();
    });
    this.audio.play();
    this.isPlaying = true;
    this.currentSong = song;
  }

  togglePlay(): void {
    if (this.audio) {
      if (this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
      } else {
        this.audio.play();
        this.isPlaying = true;
      }
    }
  }

  toggleMute(): void {
    if (this.audio) {
      this.audio.muted = !this.audio.muted;
      this.isMuted = this.audio.muted;
    }
  }

  seek(event: any): void {
    if (this.audio) {
      const seekTime = Number(event.target.value);
      this.audio.currentTime = seekTime;
      this.currentTime = seekTime;
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  nextSong(): void {
    if (this.currentSongIndex < this.songs.length - 1) {
      this.currentSongIndex++;
      this.playSong(this.songs[this.currentSongIndex]);
    }
  }

  previousSong(): void {
    if (this.currentSongIndex > 0) {
      this.currentSongIndex--;
      this.playSong(this.songs[this.currentSongIndex]);
    }
  }

  trackByFn(index: number, item: Song): string {
    return item._id;
  }
}
