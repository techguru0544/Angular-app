import { Injectable } from '@angular/core';
import { RequestService } from '../request/request.service';
import { apiInfo } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    constructor(private service: RequestService) { }

    /**
    * Get all institute list form server with paginations
    * @param postObj query list object
    */
    public getAllInstituteList(postObj: any): Promise<any> {
        const esc = encodeURIComponent;
        let queryStr = Object.keys(postObj)
            .map(k => esc(k) + '=' + esc(postObj[k]))
            .join('&');
        if (queryStr !== '') {
            queryStr = '?' + queryStr;
        }
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.getInstitute + queryStr)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get all state list form server
    * @param postObj query list object
    */
    public getAllStateList(postObj: any): Promise<any> {
        const esc = encodeURIComponent;
        let queryStr = Object.keys(postObj)
            .map(k => esc(k) + '=' + esc(postObj[k]))
            .join('&');
        if (queryStr !== '') {
            queryStr = '?' + queryStr;
        }
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.getState + queryStr)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }
    /**
    * Get all country list form server
    * @param postObj query list object
    */
    public getAllCountryList(postObj: any): Promise<any> {
        const esc = encodeURIComponent;
        let queryStr = Object.keys(postObj)
            .map(k => esc(k) + '=' + esc(postObj[k]))
            .join('&');
        if (queryStr !== '') {
            queryStr = '?' + queryStr;
        }
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.getCountry + queryStr)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }


    /**
    * Get all area list form server
    * @param postObj query list object
    */
    public getAllAreaList(postObj: any): Promise<any> {
        const esc = encodeURIComponent;
        let queryStr = Object.keys(postObj)
            .map(k => esc(k) + '=' + esc(postObj[k]))
            .join('&');
        if (queryStr !== '') {
            queryStr = '?' + queryStr;
        }
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.getArea + queryStr)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });

    }

    /**
    * Get all area list form server
    * @param postObj query list object
    */
    public getAllOncoAreaList(postObj: any): Promise<any> {
        const esc = encodeURIComponent;
        let queryStr = Object.keys(postObj)
            .map(k => esc(k) + '=' + esc(postObj[k]))
            .join('&');
        if (queryStr !== '') {
            queryStr = '?' + queryStr;
        }
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.getOncAreas + apiInfo.info.get + queryStr)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });

    }

    /**
    * Get all frequent institute list form server
    */
    public getAllFrequentInstituteList(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.institution + apiInfo.info.frequent)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get all frequent area list form server
    */
    public getAllFrequentAreaList(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.getArea + apiInfo.info.frequent)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get all frequent institute list form server without paginations
    * @param {any} postObj query list
    */
    public getAllExistingInstituteList(postObj: any): Promise<any> {
        const esc = encodeURIComponent;
        let queryStr = Object.keys(postObj)
        .map(k => esc(k) + '=' + esc(postObj[k]))
        .join('&');
        if (queryStr !== '') {
            queryStr = '?' + queryStr;
        }
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.getInstitute + apiInfo.info.get + queryStr)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get all area list form server without paginations
    * @param {any} postObj query list
    */
    public getAllExistingAreaList(postObj: any): Promise<any> {
        const esc = encodeURIComponent;
        let queryStr = Object.keys(postObj)
        .map(k => esc(k) + '=' + esc(postObj[k]))
        .join('&');
        if (queryStr !== '') {
            queryStr = '?' + queryStr;
        }
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.getArea + apiInfo.info.get + queryStr)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Get all search news data by keyword search by user
    * @param postObj query list object
    */
    public getSearchnewsData(postObj: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.service.post(apiInfo.info.news + apiInfo.info.search, postObj)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * save recent search data
    * @param postObj query list object
    */
    public saveRecentSearchData(postObj: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.service.post(apiInfo.info.news + apiInfo.info.search + apiInfo.info.save, postObj)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * get all existing recent search data
    */
    public getRecentSearchData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.news + apiInfo.info.search + apiInfo.info.recent)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * delete all existing recent search data
    */
    public deleteRecentSearchData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.news + apiInfo.info.search + apiInfo.info.delete)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * get all existing teams and Groups of logged in user
    */
    public getGroupsandTeams(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.getGroupTeam)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * get all existing teams and Groups of News which is clicked
    * @param NewsId selected News ID
    */
    public getGroupsandTeamsByNewsId(NewsId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.service.get(apiInfo.info.News + '/' + NewsId + apiInfo.info.getAllGroupTeam)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
    * Add remove News from group
    * @param postObj query list object
    */
    public addRemoveNewsInGroup(postObj: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.service.post(apiInfo.info.add, postObj)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }
}
