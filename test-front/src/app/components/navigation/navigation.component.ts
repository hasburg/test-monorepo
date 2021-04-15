import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  constructor(private imageService: ImageService) {}

  ngOnInit(): void {}
  get isBack() {
    return this.imageService.isBack();
  }
  get isForward() {
    return this.imageService.isForward();
  }
  navigate(position) {
    this.imageService.navigate(position);
  }
}
