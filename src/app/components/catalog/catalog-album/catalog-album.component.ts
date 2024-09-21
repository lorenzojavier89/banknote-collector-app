import { Component } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { Banknote } from '../../../models/banknote.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-catalog-album',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './catalog-album.component.html',
  styleUrl: './catalog-album.component.scss'
})
export class CatalogAlbumComponent {
  banknotes: Banknote[] = [];

  constructor(private catalogService: CatalogService) {
    this.catalogService.getBanknotes().subscribe(data => {
      this.banknotes = data;
    });
  }
}
