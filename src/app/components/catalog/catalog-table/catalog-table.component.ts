import { Component, inject, computed, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { FiltersService } from '../../../services/filters.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { Banknote } from '../../../models/banknote.model';
import { NgFor } from '@angular/common';
import { VolumesService } from '../../../services/volumes.service';
import { MatSortModule, Sort } from '@angular/material/sort';

class CatalogTableDataSource extends DataSource<Banknote> {
  private filtersService: FiltersService = inject(FiltersService);
  private sort = signal<Sort>({ active: 'order', direction: ''});  
  banknotes = computed(() => {
    const { active, direction } = this.sort();  
    const banknotes = this.filtersService.banknotes();
    
    const sortedBanknotes = banknotes.sort((a, b) => {
      if(active === 'order' && direction === 'asc') {
        return a.order - b.order;
      }

      if(active === 'order' && direction === 'desc') {
        return b.order - a.order;
      }

      return 0;
    });

    return [...sortedBanknotes];
  }
  );
  
  connect(): Observable<Banknote[]> {
    return toObservable(this.banknotes);
  }

  disconnect() {}

  setSort(sort: Sort) {
    this.sort.set(sort);
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

