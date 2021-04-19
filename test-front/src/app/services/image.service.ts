import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IoService } from './io.service';
import { RestService } from './rest.service';

@Injectable({ providedIn: 'root' })
export class ImageService {
  url: string | ArrayBuffer;
  fileToUpload: File = null;
  imagesShared: Array<String> = [];
  imageToDisplay: Array<String> = [];
  constructor(private ioService: IoService, private restService: RestService) {
    this.ioService.on('message').subscribe((el: Array<string>) => {
      this.imagesShared = el.reverse();
      this.imageToDisplay = el.slice(0, 12);
    });
    this.ioService.on('newImage').subscribe((el: MessageInterface) => {
      this.imagesShared.unshift(el.msg);
      this.imageToDisplay = this.imagesShared.slice(0, 12);
    });
    this.ioService.on('reset').subscribe((el) => {
      this.imageToDisplay = [];
      this.imagesShared = [];
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
    this.restService.postFile(this.fileToUpload).subscribe(
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
  resetImages() {
    this.restService.resetFiles().subscribe(
      (el) => {
        this.imageToDisplay = [];
        this.imagesShared = [];
        this.ioService.emit('onReset', {});
      },
      () => {
        //TODO: add error handle
      }
    );
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
    return `url(${environment.host + path})`;
  }
}

export interface MessageInterface {
  msg: string;
}
