import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  constructor(private imageService: ImageService) {}

  ngOnInit(): void {}
  onSelectFile(e: Event) {
    this.imageService.onSelectFile(e);
  }
  get fileToUpload() {
    return this.imageService.fileToUpload;
  }
  get url() {
    return this.imageService.url;
  }
  uploadImage() {
    this.imageService.uploadImage();
  }
}
