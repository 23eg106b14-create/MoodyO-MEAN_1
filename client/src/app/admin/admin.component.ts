import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SongService, Song } from '../services/song.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
<div class="admin-container">
  <h1>MoodyO Song Management</h1>

  <form (ngSubmit)="submitSong()">
    <input [(ngModel)]="formData.title" name="title" placeholder="Song Title" required>
    <input [(ngModel)]="formData.artist" name="artist" placeholder="Artist" required>
    <input [(ngModel)]="formData.src" name="src" placeholder="Audio URL" required type="url">
    <input [(ngModel)]="formData.cover" name="cover" placeholder="Cover Image URL" required type="url">
    <select [(ngModel)]="formData.emotion" name="emotion" required>
      <option *ngFor="let emotion of emotions" [value]="emotion">{{ emotion | titlecase }}</option>
    </select>
    <button type="submit">{{ isEditing ? 'Update Song' : 'Add Song' }}</button>
    <button type="button" *ngIf="isEditing" (click)="resetForm()">Cancel</button>
  </form>

  <h2>All Songs</h2>
  <table *ngIf="songs.length > 0">
    <thead>
      <tr>
        <th>Title</th>
        <th>Artist</th>
        <th>Emotion</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let song of songs">
        <td>{{ song.title }}</td>
        <td>{{ song.artist }}</td>
        <td>{{ song.emotion | titlecase }}</td>
        <td>
          <button (click)="editSong(song)">Edit</button>
          <button (click)="deleteSong(song._id)">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
  <p *ngIf="songs.length === 0">No songs available.</p>

  <br>
  <a routerLink="/">Back to Homepage</a>
</div>
`,
  styles: [`
.admin-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
}

input, select {
  padding: 8px;
  font-size: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th, table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

table th {
  background-color: #f4f4f4;
}
`]
})
export class AdminComponent implements OnInit {
  songs: Song[] = [];
  emotions = ['happy', 'joyful', 'sad', 'depression'];
  formData: Song = { title: '', artist: '', src: '', cover: '', emotion: '' } as Song;
  isEditing: boolean = false;
  editingId: string = '';

  constructor(private songService: SongService) { }

  ngOnInit(): void {
    this.loadSongs();
  }

  loadSongs(): void {
    this.songService.getAllSongs().subscribe(songs => this.songs = songs);
  }

  submitSong(): void {
    if (this.isEditing) {
      this.songService.updateSong(this.editingId, this.formData).subscribe(() => {
        this.resetForm();
        this.loadSongs();
      });
    } else {
      const newSong = { ...this.formData };
      this.songService.createSong(newSong).subscribe(() => {
        this.resetForm();
        this.loadSongs();
      });
    }
  }

  editSong(song: Song): void {
    this.formData = { ...song };
    this.isEditing = true;
    this.editingId = song._id;
  }

  deleteSong(id: string): void {
    if (confirm('Are you sure you want to delete this song?')) {
      this.songService.deleteSong(id).subscribe(() => this.loadSongs());
    }
  }

  resetForm(): void {
    this.formData = { title: '', artist: '', src: '', cover: '', emotion: '' } as Song;
    this.isEditing = false;
    this.editingId = '';
  }
}
