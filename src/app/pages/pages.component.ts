import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})

export class PagesComponent implements OnInit {
  userId: any;
  usersData: any;
  userDetails: any;

  constructor() {
    this.usersData = localStorage.getItem('Kuser_data');
    this.userDetails = JSON.parse(this.usersData);
    this.userId = this.userDetails.username;
  }

  /**
   * This function will call when component is load first time
   * @memberof PagesComponent
   */
  public ngOnInit(): void {
    /** intialize */
  }

}
