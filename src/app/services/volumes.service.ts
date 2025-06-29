import { Injectable } from '@angular/core';
import { VolumeType } from '../models/volume-type.enum';

@Injectable({
  providedIn: 'root'
})
export class VolumesService {

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
