import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'test-front';
  url: any;
  fileToUpload: File = null;
  constructor(private httpClient: HttpClient) {}
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
        console.log(el);
      },
      () => {
        //TODO: add error handle
        this.fileToUpload = null;
        this.url = null;
      },
      () => {
        this.fileToUpload = null;
        this.url = null;
      }
    );
  }

  postFile(fileToUpload: File): Observable<any> {
    const endpoint = 'localhost:3000/api/upload';
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.httpClient.post(endpoint, formData);
  }
}
