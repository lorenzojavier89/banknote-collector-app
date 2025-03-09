import { Component, computed, inject, model } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { NgFor, NgIf } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VolumesService } from '../../../services/volumes.service';
import { CatalogViewMode } from '../../../models/catalog-view-mode.enum';

@Component({
  selector: 'app-catalog-header',
  standalone: true,
  imports: [MatExpansionModule, MatButtonModule, MatIconModule, MatTooltipModule, NgFor, NgIf],
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

  viewMode = model.required<CatalogViewMode>();
  banknotes = this.catalogService.sortedBanknotes;
  appliedFilter = this.catalogService.appliedFilter;
  
  count = computed(() => this.banknotes().length);

  badgeClass(code: string | null): string  {
    return this.volumesService.getBadgeClass(code);
  }
  
  sortStateMssg = computed<string>(() => {
    const { active, direction } = this.catalogService.sortState();
    const mssgKey = `${active}-${direction}`;

    switch(mssgKey){
      case 'order-asc': return "Ordenado por ubicación en álbum (asc)";
      case 'order-desc': return "Ordenado por ubicación en álbum (desc)";
      case 'issueDate-asc': return "Odernado por fecha de emisión (más antiguos primero)";
      case 'issueDate-desc': return "Ordenado por fecha de emisión (más recientes primero)";
      default: return '';
    }
  });

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
}
