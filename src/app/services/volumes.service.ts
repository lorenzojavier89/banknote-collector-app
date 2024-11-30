import { Injectable } from '@angular/core';
import { Volume } from '../models/volume.enum';

@Injectable({
  providedIn: 'root'
})
export class VolumesService {

  getBadgeClass(v: Volume | string | null): string  {
    switch (v) {
      case Volume.Black: return 'text-bg-dark';
      case Volume.Red: return 'text-bg-danger';
      case Volume.Green: return 'text-bg-success';
      default: return 'text-bg-secondary';
    }
  }  
}
