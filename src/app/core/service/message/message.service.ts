import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    isLoader = new Subject<any>();

    constructor() { }
    /**
     * Set HTTP Loader show status when calling rest API to server
     * @param data
     */
    setHttpLoaderStatus(data: any) {
        this.isLoader.next(data);
    }

    /**
     * Get HTTP Loader show status when calling rest API to server
     */
    getHttpLoaderStatus(): Observable<any> {
        return this.isLoader.asObservable();
    }
}
