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
  private _sort = signal<Sort>({ active: 'order', direction: ''});  
  private _banknotes = computed(() => {
      const { active, direction } = this._sort();  
      const banknotesCopy = [...this.filtersService.banknotes()];
      
      const sortedBanknotes = banknotesCopy.sort((a, b) => {
        if(active === 'order' && direction === 'asc') {
          return a.order - b.order;
        }
  
        if(active === 'order' && direction === 'desc') {
          return b.order - a.order;
        }

        if(active === 'issueDate' && direction === 'asc') {
          const issueMinDateDifference = a.issueMinDate - b.issueMinDate;
          if(issueMinDateDifference !== 0) {
            return issueMinDateDifference;
          }
          
          return a.issueMaxDate - b.issueMaxDate;
        }

        if(active === 'issueDate' && direction === 'desc') {
          const issueMaxDateDifference = b.issueMaxDate - a.issueMaxDate;
          if(issueMaxDateDifference !== 0) {
            return issueMaxDateDifference;
          }

          return b.issueMinDate - a.issueMinDate;
        }
  
        return 0;
      });
  
      return sortedBanknotes;
    }
  );
  
  connect(): Observable<Banknote[]> {
    return toObservable(this._banknotes);
  }

  disconnect() {}

  setSort(sort: Sort) {
    this._sort.set(sort);
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

