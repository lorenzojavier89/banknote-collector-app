import { Component, effect, inject, input, OnInit } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-banknote',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './banknote.component.html',
  styleUrl: './banknote.component.scss'
})
export class BanknoteComponent implements OnInit {
  id = input.required<string>();
  private catalogService: CatalogService = inject(CatalogService);

  selectedBanknote = this.catalogService.selectedBanknote;

  ngOnInit(): void {
    this.catalogService.selectBanknote(this.id());
  }
}
