import { NgFor, NgIf } from '@angular/common';
import { Component, computed, inject, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CatalogViewMode } from '../../../models/catalog-view-mode.enum';
import { SortState } from '../../../models/sort-state.model';
import { CatalogService } from '../../../services/catalog.service';
import { VolumesService } from '../../../services/volumes.service';

@Component({
  selector: 'app-catalog-header',
  standalone: true,
  imports: [MatExpansionModule, MatButtonModule, MatMenuModule, MatIconModule, MatTooltipModule, NgFor, NgIf],
  templateUrl: './catalog-header.component.html',
  styleUrl: './catalog-header.component.scss'
})
export class CatalogHeaderComponent {
  private volumesService: VolumesService = inject(VolumesService);
  private catalogService: CatalogService = inject(CatalogService);

  gridViewModeMssg = "Mostrar vista de grilla";
  tableViewModeMssg = "Mostrar vista de tabla";
  noFiltersAppliedMssg = "Sin filtros aplicados";
  removeAppliedFiltersMssg = "Quitar todos los filtros";
  sortByOrderMenuItemMssg = "Ordenar por ubicación en álbum";
  sortByIssueDateAscMenuItemMssg = "Ordenar más antiguos primero";
  sortByIssueDateDescMenuItemMssg = "Ordernar más recientes primero";
  sortStateMssg = computed<string>(() => {
    const sortStateKey = this.catalogService.sortStateKey();
    switch(sortStateKey){
      case 'order-asc': return "Ordenado por ubicación en álbum";
      case 'order-desc': return "Ordenado por ubicación en álbum (desc)";
      case 'issueDate-asc': return "Ordenado por fecha de emisión (más antiguos primero)";
      case 'issueDate-desc': return "Ordenado por fecha de emisión (más recientes primero)";
      case 'rarityIndex-asc': return "Ordenado por rareza (más comunes primero)";
      case 'rarityIndex-desc': return "Ordenado por rareza (más raros primero)";
      default: return '';
    }
  });

  viewMode = model.required<CatalogViewMode>();
  banknotes = this.catalogService.sortedBanknotes;
  appliedFilter = this.catalogService.appliedFilter;
  
  count = computed(() => this.banknotes().length);

  badgeClass(name: string | null): string  {
    return this.volumesService.getBadgeClass(name);
  }  

  onRemoveFiltersClick(event: MouseEvent) {
    event.stopPropagation();
    if(this.appliedFilter().someFiltersApplied){
      this.catalogService.removeAllFilters();
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

  onMenuClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onSortChange(sort: SortState) {
    this.catalogService.setSortState(sort);
  }
}
