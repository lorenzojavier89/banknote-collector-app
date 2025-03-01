import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { FiltersService } from '../../../services/filters.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { Banknote } from '../../../models/banknote.model';
import { NgFor } from '@angular/common';
import { VolumesService } from '../../../services/volumes.service';

class CatalogTableDataSource extends DataSource<Banknote> {
  private filtersService: FiltersService = inject(FiltersService);
  banknotes = this.filtersService.banknotes;
  
  connect(): Observable<Banknote[]> {
    return toObservable(this.banknotes);
  }

  disconnect() {}
}

@Component({
  selector: 'app-catalog-table',
  standalone: true,
  imports: [MatTableModule, NgFor],
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
}

