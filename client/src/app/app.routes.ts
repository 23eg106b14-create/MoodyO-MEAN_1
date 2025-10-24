import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AdminComponent } from './admin/admin.component';
import { MoodComponent } from './mood/mood.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'mood/:emotion', component: MoodComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
