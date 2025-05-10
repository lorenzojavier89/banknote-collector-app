import { DataSource } from '@angular/cdk/collections';
import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Banknote } from '../../../models/banknote.model';
import { SortState } from '../../../models/sort-state.model';
import { CatalogService } from '../../../services/catalog.service';
import { VolumesService } from '../../../services/volumes.service';

class CatalogTableDataSource extends DataSource<Banknote> {
  private catalogService: CatalogService = inject(CatalogService);
    
  connect(): Observable<Banknote[]> {
    return toObservable(this.catalogService.sortedBanknotes);
  }

  disconnect() {}

  setSort(sort: Sort) {
    this.catalogService.setSortState(sort as SortState);
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

  displayedColumns: string[] = ['order', 'denomination', 'issueDate', 'flagIcons', 'issuerName', 'issuerSubname', 'subregionName', 'condition', 'rarityIndex'];
  dataSource = new CatalogTableDataSource();

  volumeBadgeClass(element: Banknote): string {
    return this.volumesService.getBadgeClass(element.volume);
  }

  onSortChange(sort: Sort) {
    this.dataSource.setSort(sort);
  }
}

