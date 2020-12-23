import { Injectable } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from './../../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  private cancelPendingRequests$ = new Subject<void>();

  authToken: string;
  previousUrl: string;
  toast: any;
  showToast: any;

  constructor(private toasterService: ToasterService, public toastr: ToastrManager) { }

  /**
   * Check user is login or not
   */
  isLoggedIn(): boolean {
    return localStorage.getItem('Kweb_token') && localStorage.getItem('Kweb_token') ? true : false;
  }

  /**
  * get local storage token
  */
  getToken(): string | null {
    if (this.authToken) {
      return this.authToken;
    } else {
      return localStorage.getItem('Kweb_token') ? localStorage.getItem('Kweb_token') : null;
    }
  }

  /**
  * set token in localstorage
  * @param token
  */
  setToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('Kweb_token', token);
  }

  /**
  * Set login user data in localstorage
  * @param data
  */
  setLoggedUserData(data: any) {
    localStorage.setItem('Kuser_data', data);
  }

  /**
  * Get login user data from localstorage
  */
  getLoggedUserData(): string | null {
    return localStorage.getItem('Kuser_data') ? JSON.parse(localStorage.getItem('Kuser_data')) : null;
  }

  /**
   * Clear local storage data when user logout
   */
  clearLocalStorage() {
    localStorage.clear();
  }

  /**
  * Show error message
  * @param title
  * @param message
  */
  showError(title, message) {
    if (this.toast !== undefined) {
      this.toasterService.clear();
    }
    this.toast = this.toasterService.popAsync('error', title, message);
  }

  /**
  * Show success message
  * @param title
  * @param message
  */
  showSuccess(title, message) {
    if (this.toast !== undefined) {
      this.toasterService.clear();
    }
    this.toast = this.toasterService.popAsync('success', title, message);
  }

  /**
  * Common error handler
  */
  errorHandler(error: any) {
    if (error.hasOwnProperty('error')) {
      if (error && error.hasOwnProperty('message')) {
        if (typeof error.message === 'object') {
          for (const x of Object.keys(error.message)) {
            this.showError('Error', error.message[x]);
          }
        } else if (typeof error.message === 'string') {
          this.showError('Error', error.message);
        }
      } else {
        this.showError('Error', 'Something went wrong. Please try again later');
      }
    } else {
      this.showError('Error', 'Something went wrong. Please try again later');
    }
  }
}
