import { Component, input } from '@angular/core';
import { Banknote } from '../../../../models/banknote.model';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-banknote-vcard',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './banknote-vcard.component.html',
  styleUrl: './banknote-vcard.component.scss'
})
export class BanknoteVCardComponent {
  banknote = input.required<Banknote>();
  badgeClass = input.required<string>();
}
