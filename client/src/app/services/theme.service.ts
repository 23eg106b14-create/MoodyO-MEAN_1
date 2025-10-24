import { Injectable } from '@angular/core';

export type Mood = 'happy' | 'joyful' | 'sad' | 'depression';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentMood: Mood = 'happy';

  get moods(): Mood[] {
    return ['happy', 'joyful', 'sad', 'depression'];
  }

  getCurrentMood(): Mood {
    return this.currentMood;
  }

  setMood(mood: Mood): void {
    this.currentMood = mood;
    document.body.className = `mood-${mood}`;
  }

  getMoodData(mood: Mood) {
    const moodMap = {
      'happy': {
        emoji: '😊',
        title: 'Happy',
        gradient: 'linear-gradient(135deg, #FFD700, #FFA500)',
        description: 'Let positive vibes flow!'
      },
      'joyful': {
        emoji: '😄',
        title: 'Joyful',
        gradient: 'linear-gradient(135deg, #FF69B4, #00CED1)',
        description: 'Embrace the joy within!'
      },
      'sad': {
        emoji: '😔',
        title: 'Sad',
        gradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
        description: 'Find comfort in gentle melodies'
      },
      'depression': {
        emoji: '😩',
        title: 'Depression',
        gradient: 'linear-gradient(135deg, #6b7280, #6d5bd0)',
        description: 'Healing through sound waves'
      }
    };
    return moodMap[mood];
  }
}
