import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Banknote } from '../../../models/banknote.model';
import { ImageLoaderComponent } from "../../utils/image-loader/image-loader.component";

@Component({
  selector: 'app-banknote-card',
  standalone: true,
  imports: [RouterLink, ImageLoaderComponent],
  templateUrl: './banknote-card.component.html',
  styleUrl: './banknote-card.component.scss',
})
export class BanknoteCardComponent {
  banknote = input.required<Banknote>();

  collapsed = signal<boolean>(true);
  onCommentClick() {
    this.collapsed.set(!this.collapsed());
  }

}
