import { Component, computed, inject, input } from '@angular/core';
import { Banknote } from '../../../../models/banknote.model';
import { NgFor } from '@angular/common';
import { VolumesService } from '../../../../services/volumes.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-banknote-vcard',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, NgFor],
  templateUrl: './banknote-vcard.component.html',
  styleUrl: './banknote-vcard.component.scss'
})
export class BanknoteVCardComponent {
  private volumesService: VolumesService = inject(VolumesService);
  
  banknote = input.required<Banknote>();
  badgeClass = computed<string>(() => { 
    return this.volumesService.getBadgeClass(this.banknote().volume);
  }); 
}
