import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { WorldMapComponent } from './components/world-map/world-map.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'catalog', component: CatalogComponent },
    { path: 'world-map', component: WorldMapComponent }
];
