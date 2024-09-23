import { Component, inject } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './album.component.html',
  styleUrl: './album.component.scss'
})
export class AlbumComponent {
  private catalogService: CatalogService = inject(CatalogService);
  banknotes = this.catalogService.banknotes;
  
}
