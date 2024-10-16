import { Component, input, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-filter-expansion-panel',
  standalone: true,
  imports: [MatExpansionModule],
  templateUrl: './filter-expansion-panel.component.html',
  styleUrl: './filter-expansion-panel.component.scss'
})
export class FilterExpansionPanelComponent {
  title = input.required<string>();

  readonly panelOpenState = signal(false);
}
