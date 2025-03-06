import { computed, inject, Injectable, signal } from '@angular/core';
import { FiltersService } from './filters.service';
import { SortState } from '../models/sort-state.model';

@Injectable({
  providedIn: 'root',
})
export class SortService {
  private filtersService: FiltersService = inject(FiltersService);
  private readonly _sort = signal<SortState>({ active: 'order', direction: '' });

  banknotes = computed(() => {
    const { active, direction } = this._sort();
    const banknotesCopy = [...this.filtersService.banknotes()];

    const sortedBanknotes = banknotesCopy.sort((a, b) => {
      if (active === 'order' && direction === 'asc') {
        return a.order - b.order;
      }

      if (active === 'order' && direction === 'desc') {
        return b.order - a.order;
      }

      if (active === 'issueDate' && direction === 'asc') {
        const issueMinDateDifference = a.issueMinDate - b.issueMinDate;
        if (issueMinDateDifference !== 0) {
          return issueMinDateDifference;
        }

        return a.issueMaxDate - b.issueMaxDate;
      }

      if (active === 'issueDate' && direction === 'desc') {
        const issueMaxDateDifference = b.issueMaxDate - a.issueMaxDate;
        if (issueMaxDateDifference !== 0) {
          return issueMaxDateDifference;
        }

        return b.issueMinDate - a.issueMinDate;
      }

      return 0;
    });

    return sortedBanknotes;
  });

  setSortState(sortState: SortState) {
    this._sort.set(sortState);
  }
}
