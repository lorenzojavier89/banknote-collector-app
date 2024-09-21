import { Component } from '@angular/core';
import { CatalogService } from '../../services/catalog.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent {

  constructor(private catalogService: CatalogService) {
    this.catalogService.getBanknotes().subscribe(data => {
      console.log(data);
    });
  }
}
