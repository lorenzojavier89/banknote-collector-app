import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { shareReplay } from 'rxjs/operators';
import { CounterType } from '../models/counter-type.model';
import { VolumeDetails } from '../models/volume-details.model';
import { VolumeType } from '../models/volume-type.enum';
import { CatalogProvider } from '../providers/catalog.provider';

@Injectable({
  providedIn: 'root'
})
export class VolumesService {
  private http: HttpClient = inject(HttpClient);
  private catalogProvider: CatalogProvider = inject(CatalogProvider);
  private volumesDetailsJsonUrl = 'assets/data/volumeDetails.json';

  private volumeDetails$ = this.http.get<VolumeDetails[]>(this.volumesDetailsJsonUrl).pipe(shareReplay(1));
  private _volumeDetails = toSignal(this.volumeDetails$, { initialValue: []});
  public volumeDetails = computed<VolumeDetails[]>(() => {
    const counters = this.catalogProvider.counters();
    const _volumeDetails = this._volumeDetails();
    
    return Object.values(VolumeType).map<VolumeDetails>(v => ({
      name: v,
      counter: counters.get(this.catalogProvider.getCounterKey(CounterType.VolumeCode, v)) ?? 0,
      details: _volumeDetails.find(d => d.name === v)?.details ?? [],
    }))
  });

  getBadgeClass(v: VolumeType | string | null): string  {
    switch (v) {
      case VolumeType.Black: return 'text-bg-dark';
      case VolumeType.Red: return 'text-bg-danger';
      case VolumeType.Green: return 'text-bg-success';
      case VolumeType.Blue: return 'text-bg-primary';
      default: return 'text-bg-secondary';
    }
  }  
}
