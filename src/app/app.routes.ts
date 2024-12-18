import { Routes } from '@angular/router';
import { GooglemapComponent } from './googlemap/googlemap.component';

export const routes: Routes = [
  { path: 'map', component: GooglemapComponent },
  { path: '', redirectTo: '/map', pathMatch: 'full' },
];
