import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Banknote } from '../../../models/banknote.model';

@Component({
  selector: 'app-banknote-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './banknote-card.component.html',
  styleUrl: './banknote-card.component.scss',
})
export class BanknoteCardComponent {
  banknote = input.required<Banknote>();
}
