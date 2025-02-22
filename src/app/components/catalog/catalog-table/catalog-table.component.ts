import { Component, computed, inject } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {DataSource} from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { FiltersService } from '../../../services/filters.service';
import { toObservable } from '@angular/core/rxjs-interop';

export interface TableRow {
  name: string;
  position: number;
}

const DATA: TableRow[] = [
  {position: 1, name: 'Hydrogen' },
  {position: 2, name: 'Helium' },
  {position: 3, name: 'Lithium' },
  {position: 4, name: 'Beryllium' },
];

@Component({
  selector: 'app-catalog-table',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './catalog-table.component.html',
  styleUrl: './catalog-table.component.scss'
})
export class CatalogTableComponent {
  displayedColumns: string[] = ['position', 'name'];
  dataSource = new ExampleDataSource();
}

class ExampleDataSource extends DataSource<TableRow> {
  private filtersService: FiltersService = inject(FiltersService);

  tableRows = computed<TableRow[]>(() => this.filtersService.banknotes().map((b) => ({
    position: b.order,
    name: b.name
  })))

  connect(): Observable<TableRow[]> {
    return toObservable(this.tableRows);
  }

  disconnect() {}

}
