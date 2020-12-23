import { Injectable } from '@angular/core';
import { RequestService } from '../request/request.service';
import { apiInfo } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private service: RequestService) { }

    /**
    * Get login userd detail
    */
    public getUserDetail(): Promise<any>{
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.profile)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get all notifiations data for user
    * @param postObj query list object
    */
    public getNotifications(postObj: any): Promise<any> {
        const esc = encodeURIComponent;
        let queryStr = Object.keys(postObj)
            .map(k => esc(k) + '=' + esc(postObj[k]))
            .join('&');
        if (queryStr !== '') {
            queryStr = '?' + queryStr;
        }
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.notification + queryStr)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get all groups form server
    */
    public getGroupList(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.groups)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Add group name to server
    * @param postObj query list object
    */
    public addGroup(postObj: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.service.post(apiInfo.info.addGroup, postObj)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Remove group from favourite list by id
    * @param groupId selected group ID
    */
    public removeGroupById(groupId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.service.delete(apiInfo.info.deleteGroup + `/${groupId}`, {})
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get terms and service data
    */
    public getTermsServiceData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.terms)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }
}
