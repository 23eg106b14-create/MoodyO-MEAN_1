import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Song {
  _id: string;
  title: string;
  artist: string;
  src: string;
  cover: string;
  emotion: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getSongsByEmotion(emotion: string): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/songs/${emotion}`);
  }

  getAllSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/admin/songs`);
  }

  createSong(song: Omit<Song, '_id' | 'createdAt'>): Observable<Song> {
    return this.http.post<Song>(`${this.apiUrl}/admin/songs`, song);
  }

  updateSong(id: string, song: Omit<Song, '_id' | 'createdAt'>): Observable<Song> {
    return this.http.put<Song>(`${this.apiUrl}/admin/songs/${id}`, song);
  }

  deleteSong(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/songs/${id}`);
  }
}
