import { Component, inject, computed, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { Banknote } from '../../../models/banknote.model';
import { NgFor } from '@angular/common';
import { VolumesService } from '../../../services/volumes.service';
import { MatSortModule, Sort } from '@angular/material/sort';
import { SortService } from '../../../services/sort.service';
import { SortState } from '../../../models/sort-state.model';

class CatalogTableDataSource extends DataSource<Banknote> {
  private sortService: SortService = inject(SortService);
    
  connect(): Observable<Banknote[]> {
    return toObservable(this.sortService.banknotes);
  }

  disconnect() {}

  setSort(sort: Sort) {
    this.sortService.setSortState(sort as SortState);
  }
}

@Component({
  selector: 'app-catalog-table',
  standalone: true,
  imports: [MatTableModule, MatSortModule, NgFor],
  templateUrl: './catalog-table.component.html',
  styleUrl: './catalog-table.component.scss',
})
export class CatalogTableComponent {
  private volumesService: VolumesService = inject(VolumesService); 

  displayedColumns: string[] = ['order', 'denomination', 'issueDate', 'flagIcons', 'issuerName', 'issuerSubname', 'subregionName'];
  dataSource = new CatalogTableDataSource();

  badgeClass(element: Banknote): string {
    return this.volumesService.getBadgeClass(element.volume);
  }

  onSortChange(sort: Sort) {
    this.dataSource.setSort(sort);
  }
}

