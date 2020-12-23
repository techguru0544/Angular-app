import { Injectable } from '@angular/core';
import { RequestService } from '../request/request.service';
import { apiInfo } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class newsService {

  constructor(private service: RequestService) { }

  /**
  * Get all news data by news Id
  * @param NewsId selected News ID
  * @param postObj query list object
  */
  public getAllNewsBynewsId(NewsId: number, postObj: any): Promise<any> {
    const esc = encodeURIComponent;
    let queryStr = Object.keys(postObj)
      .map(k => esc(k) + '=' + esc(postObj[k]))
      .join('&');
    if (queryStr !== '') {
      queryStr = '?' + queryStr;
    }
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.news + `/${NewsId}` + apiInfo.info.getNews + apiInfo.info.list + queryStr)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Add news as favourite list by id
  * @param NewsId selected News ID
  */
  public addFavoritenewsById(NewsId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.service.put(apiInfo.info.news + `/${NewsId}` + apiInfo.info.favourite, {})
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Remove news from favourite list by id
  * @param NewsId selected News ID
  */
  public removeFavoritenewsById(NewsId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.service.delete(apiInfo.info.news + `/${NewsId}` + apiInfo.info.unfavourite, {})
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Add Liked Status to news by news id
  * @param id selected news ID
  * @param postObj query list object
  */
  public addLikedStatustoNews(id: number, postObj: any): Promise<any> {
    const esc = encodeURIComponent;
    let queryStr = Object.keys(postObj)
      .map(k => esc(k) + '=' + esc(postObj[k]))
      .join('&');
    if (queryStr !== '') {
      queryStr = '?' + queryStr;
    }
    return new Promise((resolve, reject) => {
      this.service.put(apiInfo.info.likes + `/${id}` + `${queryStr}`, {})
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Get All Likes data for news by news id
  * @param id selected news ID
  * @param postObj query list object
  */
  public getLikedForNews(id: number, postObj: any): Promise<any> {
    const esc = encodeURIComponent;
    let queryStr = Object.keys(postObj)
      .map(k => esc(k) + '=' + esc(postObj[k]))
      .join('&');
    if (queryStr !== '') {
      queryStr = '?' + queryStr;
    }
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.likes + `/${id}` + queryStr)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * Get all existing Comments for News by id
  * @param id selected news ID
  */
  public getAllExistingComments(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.service.get(apiInfo.info.getNews + `/${id}` + apiInfo.info.comments)
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }
}
