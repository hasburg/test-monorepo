import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})
export class ImagesComponent implements OnInit {
  constructor(private imageService: ImageService) {}

  ngOnInit(): void {}
  get imageToDisplay(): Array<String> {
    return this.imageService.imageToDisplay;
  }

  getImage(item) {
    return this.imageService.getImage(item);
  }
}
