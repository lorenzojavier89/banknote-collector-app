import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { WorldMapComponent } from './components/world-map/world-map.component';
import { BanknoteComponent } from './components/catalog/banknote/banknote.component';
import { CatalogAlbumComponent } from './components/catalog/catalog-album/catalog-album.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'catalog',
    component: CatalogComponent,
    children: [
        { path: '', component: CatalogAlbumComponent },
        { path: ':id', component: BanknoteComponent }],
  },
  { path: 'world-map', component: WorldMapComponent },
];
