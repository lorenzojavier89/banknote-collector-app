import { Component } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { Banknote } from '../../../models/banknote.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './album.component.html',
  styleUrl: './album.component.scss'
})
export class AlbumComponent {
  banknotes: Banknote[] = [];

  constructor(private catalogService: CatalogService) {
    this.catalogService.getBanknotes().subscribe(data => {
      this.banknotes = data;
    });
  }
}
