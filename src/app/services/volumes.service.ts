import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { shareReplay } from 'rxjs/operators';
import { VolumeDetails } from '../models/volume-details.model';
import { VolumeType } from '../models/volume-type.enum';

@Injectable({
  providedIn: 'root'
})
export class VolumesService {
  private http: HttpClient = inject(HttpClient);
  private volumesDetailsJsonUrl = 'assets/data/volumeDetails.json';

  private volumeDetails$ = this.http.get<VolumeDetails[]>(
    this.volumesDetailsJsonUrl).pipe(shareReplay(1));
  volumeDetails = toSignal(this.volumeDetails$, { initialValue: []});

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
