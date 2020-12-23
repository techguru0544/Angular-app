import { Injectable } from '@angular/core';
import { RequestService } from '../request/request.service';
import { apiInfo } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private service: RequestService) { }

    /**
    * Login API call using passing data as json format
    * @param postObj query list object
    */
    public login(postObj: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const headers = [
                {
                    'key': 'Content-Type',
                    'name': 'application/json',
                },
            ];
            this.service.post(apiInfo.info.login, postObj, headers)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Call send reset password link for forgote password
    * @param postObj query list object
    */
    public forgotPassword(postObj: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const headers = [
                {
                    'key': 'Content-Type',
                    'name': 'application/json',
                },
            ];
            this.service.post(apiInfo.info.forgotPassword, postObj, headers)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Call reset password api
    * @param postObj query list object
    */
    public resetPassword(postObj: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const headers = [
                {
                    'key': 'Content-Type',
                    'name': 'application/json',
                },
            ];
            this.service.post(apiInfo.info.resetPassword, postObj, headers)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Signup API call using passing data as json format
    * @param postObj query list object
    */
    public signup(postObj: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const headers = [
                {
                    'key': 'Content-Type',
                    'name': 'application/json',
                },
            ];
            this.service.post(apiInfo.info.signup, postObj, headers)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Calling Logout API
    */
    public logout(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.logout)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }
    /**
    * Remove device token when user logout
    */
    public removeDeviceToken(): Promise<any> {
        return new Promise((resolve, reject) => {
            const headers = [
                {
                    'key': 'Content-Type',
                    'name': 'application/json',
                },
            ];
            this.service.put(apiInfo.info.removeToken + '?device_type=web&device_token=' + localStorage.getItem('kdevice_token'), {}, headers)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }
}
