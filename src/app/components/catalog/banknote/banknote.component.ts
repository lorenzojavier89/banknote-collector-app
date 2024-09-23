import { Component, input } from '@angular/core';

@Component({
  selector: 'app-banknote',
  standalone: true,
  imports: [],
  templateUrl: './banknote.component.html',
  styleUrl: './banknote.component.scss'
})
export class BanknoteComponent {
  id = input.required<string>();
}
