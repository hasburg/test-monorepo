import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { IoService } from './io.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  url: any;
  fileToUpload: File = null;
  imagesShared: Array<String> = [];
  imageToDisplay: Array<String> = [];

  constructor(private httpClient: HttpClient, private ioService: IoService) {
    this.ioService.on('message').subscribe((el: Array<string>) => {
      this.imagesShared = el.reverse();
      this.imageToDisplay = el.slice(0, 12);
    });
    this.ioService.on('newImage').subscribe((el: any) => {
      this.imagesShared.unshift(el.msg);
      this.imageToDisplay = this.imagesShared.slice(0, 12);
    });
  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.fileToUpload = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event) => {
        this.url = event.target.result;
      };
    }
  }

  uploadImage() {
    this.postFile(this.fileToUpload).subscribe(
      (el) => {
        const newFile = el.data.name;
        this.ioService.emit('newImageSended', { msg: newFile });
        this.imagesShared.unshift('/uploads/' + newFile);
        this.imageToDisplay = this.imagesShared.slice(0, 12);
      },
      () => {
        //TODO: add error handle
      },
      () => {
        this.fileToUpload = null;
        this.url = null;
      }
    );
  }

  postFile(fileToUpload: File): Observable<any> {
    const endpoint = 'http://localhost:3000/api/upload';
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.httpClient.post(endpoint, formData);
  }

  navigate(way) {
    if (way) {
      const lastIndex = this.imagesShared.findIndex(
        (el) => el === this.imageToDisplay[this.imageToDisplay.length - 1]
      );
      this.imageToDisplay = this.imagesShared.slice(lastIndex, lastIndex + 12);
    } else {
      const currentIndex = this.imagesShared.findIndex(
        (el) => el === this.imageToDisplay[0]
      );
      this.imageToDisplay = this.imagesShared.slice(
        currentIndex - 11,
        currentIndex + 1
      );
    }
  }
  isBack() {
    return (
      this.imagesShared.findIndex((el) => el === this.imageToDisplay[0]) - 11 <
      0
    );
  }
  isForward() {
    return (
      this.imagesShared.findIndex(
        (el) => el === this.imageToDisplay[this.imageToDisplay.length - 1]
      ) >=
      this.imagesShared.length - 1
    );
  }

  getImage(path) {
    return environment.host + path;
  }
}
