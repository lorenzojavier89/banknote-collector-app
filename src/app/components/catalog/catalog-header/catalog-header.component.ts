import { Component, computed, inject, model } from '@angular/core';
import { FiltersService } from '../../../services/filters.service';
import { NgFor, NgIf } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VolumesService } from '../../../services/volumes.service';
import { CatalogViewMode } from '../../../models/catalog-view-mode.enum';
import { SortService } from '../../../services/sort.service';

@Component({
  selector: 'app-catalog-header',
  standalone: true,
  imports: [MatExpansionModule, MatButtonModule, MatIconModule, MatTooltipModule, NgFor, NgIf],
  templateUrl: './catalog-header.component.html',
  styleUrl: './catalog-header.component.scss'
})
export class CatalogHeaderComponent {
  private volumesService: VolumesService = inject(VolumesService);
  private filtersService: FiltersService = inject(FiltersService);
  private sortService: SortService = inject(SortService);

  gridViewModeMssg = "Mostrar vista de grilla";
  tableViewModeMssg = "Mostrar vista de tabla";
  noFiltersAppliedMssg = "Sin filtros aplicados";
  removeAppliedFiltersMssg = "Quitar todos los filtros";

  viewMode = model.required<CatalogViewMode>();
  banknotes = this.sortService.banknotes;
  appliedFilter = this.filtersService.appliedFilter;
  
  count = computed(() => this.banknotes().length);

  badgeClass(code: string | null): string  {
    return this.volumesService.getBadgeClass(code);
  }  

  onRemoveFiltersClick(event: MouseEvent) {
    event.stopPropagation();
    if(this.appliedFilter().someFiltersApplied){
      this.filtersService.removeAllFilters();
    }
  }

  onGridViewModeClick(event: MouseEvent) {
    event.stopPropagation();
    this.viewMode.set(CatalogViewMode.GridView);
  }

  onTableViewModeClick(event: MouseEvent) {
    event.stopPropagation();
    this.viewMode.set(CatalogViewMode.TableView);
  }
}
