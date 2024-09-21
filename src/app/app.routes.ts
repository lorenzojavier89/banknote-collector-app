import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { WorldMapComponent } from './components/world-map/world-map.component';
import { BanknoteComponent } from './components/catalog/banknote/banknote.component';
import { AlbumComponent } from './components/catalog/album/album.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'catalog',
    component: CatalogComponent,
    children: [
        { path: '', component: AlbumComponent },
        { path: ':id', component: BanknoteComponent }],
  },
  { path: 'world-map', component: WorldMapComponent },
];
