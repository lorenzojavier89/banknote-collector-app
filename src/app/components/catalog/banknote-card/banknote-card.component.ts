import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Banknote } from '../../../models/banknote.model';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-banknote-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './banknote-card.component.html',
  styleUrl: './banknote-card.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({opacity: 0}), animate('1s', style({opacity: 1}))]),
      transition(':leave', [animate('1s', style({opacity: 0}))]),
    ]),
  ]
})
export class BanknoteCardComponent {
  banknote = input.required<Banknote>();
}
