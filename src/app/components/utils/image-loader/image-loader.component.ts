import { NgIf } from '@angular/common';
import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-image-loader',
  standalone: true,
  imports: [NgIf],
  templateUrl: './image-loader.component.html',
  styleUrl: './image-loader.component.scss'
})
export class ImageLoaderComponent {
  @Input({required:true}) src: string = '';
  @Input() defaultSrc: string = 'assets/images/banknotes/notfound-sm.jpg';
  imageLoaded: boolean = true;

  onError() {
    this.imageLoaded = false;
  }
}
