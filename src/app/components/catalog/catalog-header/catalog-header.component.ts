import { Component, computed, inject } from '@angular/core';
import { FiltersService } from '../../../services/filters.service';
import { NgFor, NgIf } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Volume } from '../../../models/volume.enum';

@Component({
  selector: 'app-catalog-header',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule, MatTooltipModule, NgFor, NgIf],
  templateUrl: './catalog-header.component.html',
  styleUrl: './catalog-header.component.scss'
})
export class CatalogHeaderComponent {

  private filtersService: FiltersService = inject(FiltersService);

  noFiltersAppliedMssg = "Sin filtros aplicados";
  removeAppliedFiltersMssg = "Quitar todos los filtros";

  banknotes = this.filtersService.banknotes;
  appliedFilter = this.filtersService.appliedFilter;
  
  count = computed(() => this.banknotes().length);

  badgeClass(code: string | null): string  {
    switch (code as Volume) {
      case Volume.Black: return 'text-bg-dark';
      case Volume.Red: return 'text-bg-danger';
      case Volume.Green: return 'text-bg-success';
      default: return 'text-bg-secondary';
    }
  }  

  onRemoveFiltersClick(event: MouseEvent) {
    event.stopPropagation();
    this.filtersService.removeAllFilters();
  }
}
