import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [NgClass],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {
  public isOpen: boolean = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
