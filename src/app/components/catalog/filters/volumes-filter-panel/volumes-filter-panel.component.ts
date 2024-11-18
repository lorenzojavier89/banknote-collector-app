import { Component } from '@angular/core';
import { FilterExpansionPanelComponent } from '../filter-expansion-panel/filter-expansion-panel.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-volumes-filter-panel',
  standalone: true,
  imports: [FilterExpansionPanelComponent, NgFor],
  templateUrl: './volumes-filter-panel.component.html',
  styleUrl: './volumes-filter-panel.component.scss'
})
export class VolumesFilterPanelComponent {
  

}
