import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class IoService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.io);
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }
  on(event: string) {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });
    });
  }
}
