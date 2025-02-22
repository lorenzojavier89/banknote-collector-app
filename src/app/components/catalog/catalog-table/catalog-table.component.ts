import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { FiltersService } from '../../../services/filters.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { Banknote } from '../../../models/banknote.model';

class CatalogTableDataSource extends DataSource<Banknote> {
  private filtersService: FiltersService = inject(FiltersService);
  banknotes = this.filtersService.banknotes;
  
  connect(): Observable<Banknote[]> {
    return toObservable(this.banknotes);
  }

  disconnect() {}
}

@Component({
  selector: 'app-catalog-table',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './catalog-table.component.html',
  styleUrl: './catalog-table.component.scss',
})
export class CatalogTableComponent {
  displayedColumns: string[] = ['order', 'denomination', 'issueDate', 'issuerName', 'issuerSubname'];
  dataSource = new CatalogTableDataSource();
}

