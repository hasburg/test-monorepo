import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RestService {
  constructor(private httpClient: HttpClient) {}
  postFile(fileToUpload: File): Observable<any> {
    const endpoint = 'http://localhost:3000/api/upload';
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.httpClient.post(endpoint, formData);
  }
}
