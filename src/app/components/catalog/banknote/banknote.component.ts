import { JsonPipe } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { CatalogProvider } from '../../../providers/catalog.provider';

@Component({
  selector: 'app-banknote',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './banknote.component.html',
  styleUrl: './banknote.component.scss'
})
export class BanknoteComponent implements OnInit {
  id = input.required<string>();
  private catalogProvider: CatalogProvider = inject(CatalogProvider);

  selectedBanknote = this.catalogProvider.selectedBanknote;

  ngOnInit(): void {
    this.catalogProvider.selectBanknote(this.id());
  }
}
