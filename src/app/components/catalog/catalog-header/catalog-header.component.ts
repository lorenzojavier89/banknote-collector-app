import { Component, computed, inject } from '@angular/core';
import { FiltersService } from '../../../services/filters.service';
import { NgFor, NgIf } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Volume } from '../../../models/volume.enum';
import { VolumesService } from '../../../services/volumes.service';

@Component({
  selector: 'app-catalog-header',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule, MatTooltipModule, NgFor, NgIf],
  templateUrl: './catalog-header.component.html',
  styleUrl: './catalog-header.component.scss'
})
export class CatalogHeaderComponent {
  private volumesService: VolumesService = inject(VolumesService);
  private filtersService: FiltersService = inject(FiltersService);

  noFiltersAppliedMssg = "Sin filtros aplicados";
  removeAppliedFiltersMssg = "Quitar todos los filtros";

  banknotes = this.filtersService.banknotes;
  appliedFilter = this.filtersService.appliedFilter;
  
  count = computed(() => this.banknotes().length);

  badgeClass(code: string | null): string  {
    return this.volumesService.getBadgeClass(code);
  }  

  onRemoveFiltersClick(event: MouseEvent) {
    event.stopPropagation();
    this.filtersService.removeAllFilters();
  }
}
