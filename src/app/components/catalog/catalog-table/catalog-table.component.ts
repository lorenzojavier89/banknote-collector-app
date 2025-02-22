import { Component, computed, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { FiltersService } from '../../../services/filters.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { CatalogTableElement } from '../../../models/catalog-table-element.model';

@Component({
  selector: 'app-catalog-table',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './catalog-table.component.html',
  styleUrl: './catalog-table.component.scss',
})
export class CatalogTableComponent {
  displayedColumns: string[] = ['order', 'denomination', 'name', 'issueDate'];
  dataSource = new CatalogTableDataSource();
}

class CatalogTableDataSource extends DataSource<CatalogTableElement> {
  private filtersService: FiltersService = inject(FiltersService);

  tableRows = computed<CatalogTableElement[]>(() => 
    this.filtersService.banknotes().map((b) => ({ ...b }))
  );

  connect(): Observable<CatalogTableElement[]> {
    return toObservable(this.tableRows);
  }

  disconnect() {}
}
