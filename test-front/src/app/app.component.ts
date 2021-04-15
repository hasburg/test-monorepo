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

  constructor(private httpClient: HttpClient, private ioService: IoService) {
    this.ioService.on('message').subscribe((el: Array<string>) => {
      this.imagesShared = el.reverse();
    });
    this.ioService.on('newImage').subscribe((el:any) => {
      this.imagesShared.unshift(el.msg)
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

  getImage(path) {
    return environment.host + path;
  }
}
