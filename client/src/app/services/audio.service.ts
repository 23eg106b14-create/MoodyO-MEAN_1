import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Song } from './song.service';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio: HTMLAudioElement | null = null;
  private currentSongSubject = new BehaviorSubject<Song | null>(null);
  public currentSong$ = this.currentSongSubject.asObservable();

  public isPlaying: boolean = false;
  public isMuted: boolean = false;
  public currentTime: number = 0;
  public duration: number = 0;

  constructor() { }

  get currentSong(): Song | null {
    return this.currentSongSubject.value;
  }

  setCurrentSong(song: Song): void {
    this.stopCurrentAudio();
    this.currentSongSubject.next(song);

    this.audio = new Audio(song.src);
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio?.duration || 0;
    });
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio?.currentTime || 0;
    });
    this.audio.addEventListener('ended', () => {
      this.nextTrack();
    });
  }

  play(): void {
    if (this.audio) {
      this.audio.play();
      this.isPlaying = true;
    }
  }

  pause(): void {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  togglePlay(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  toggleMute(): void {
    if (this.audio) {
      this.audio.muted = !this.audio.muted;
      this.isMuted = this.audio.muted;
    }
  }

  seek(time: number): void {
    if (this.audio) {
      this.audio.currentTime = time;
      this.currentTime = time;
    }
  }

  // Placeholder for playlist functionality
  nextTrack(): void {
    // Implementation would depend on playlist/routing logic
  }

  previousTrack(): void {
    // Implementation would depend on playlist/routing logic
  }

  private stopCurrentAudio(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.src = '';
      this.audio.load();
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
