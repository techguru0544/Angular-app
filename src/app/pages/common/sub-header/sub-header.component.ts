import { Component, OnInit, HostListener, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { GoogleAnalyticsService } from 'src/app/core/service/google-analytics.service';
import { EventsData } from 'src/app/core/service/gaEventsData';
import { NavigationEnd, Router } from '@angular/router';
import { MessageService } from 'src/app/core/service/message/message.service';
import { ReplaySubject } from 'rxjs';
import { UtilService } from 'src/app/core/service/util.service';
import { UserService } from 'src/app/core/service/user/user.service';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent implements OnInit, OnDestroy {

  /** main entity tab changes event */
  @Output() changeTab: EventEmitter<any> = new EventEmitter<any>();

  /** change News list by team and group */
  @Output() changeNewsList: EventEmitter<any> = new EventEmitter<any>();

  @Input() set teamsGroupsList(value: any) {
    this.setTeamGroupData.next(value);
  }

  /** teamGroup list changes event */
  private readonly setTeamGroupData: ReplaySubject<string[]> = new ReplaySubject<string[]>();

  @Input() set showBiomarkerTab(value: any) {
    this.setBiomarkerData.next(value);
  }

  /** showBiomarker list changes event */
  private readonly setBiomarkerData: ReplaySubject<string[]> = new ReplaySubject<string[]>();

  showCategory = false;
  selectedTab = 'News';
  showBiomarker = '';
  navigationSubscription: any;
  teamsGroups: any = [];
  selectedType = 'news';
  selectedIndex = 0;
  showMoreEntity = false;
  isNewUpdateAvailable = 1;
  NewsListRef: any;
  loggedUserData: any;

  /**
  * tabbing slider
  */
  slideConfig = {
    enabled: true,
    autoplay: false,
    arrows: true,
    dots: false,
    speed: 500,
    infinite: false,
    centerMode: false,
    draggable: true,
    'slidesToShow': 8,
    'slidesToScroll': 1,
      responsive: [
          {
              breakpoint: 1199,
              settings: {
                  slidesToShow: 7
              }
          },
          {
              breakpoint: 991,
              settings: {
                  slidesToShow: 6
              }
          },
          {
              breakpoint: 767,
              settings: {
                  slidesToShow: 5
              }
          },
          {
              breakpoint: 579,
              settings: {
                  slidesToShow: 4
              }
          },
          {
              breakpoint: 420,
              settings: {
                  slidesToShow: 3
              }
          }
      ]
  };

  /**
  * Called when click anywhere on DOM
  * @param event click event object
  */
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (document.getElementById('filterSec') !== undefined && document.getElementById('filterSec') !== null) {
      if (!document.getElementById('filterSec').contains(event.target)) {
        this.showCategory = false;
      }
    }
  }

  constructor(
    private gaService: GoogleAnalyticsService,
    private router: Router,
    private messageService: MessageService,
    private utilService: UtilService,
    private userService: UserService,
  ) {
    this.navigationSubscription = this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        if (localStorage.getItem('selectedEntity') !== null && localStorage.getItem('selectedEntity') !== '' && localStorage.getItem('selectedEntity') !== undefined) {
          this.selectedTab = localStorage.getItem('selectedEntity');
        } else {
          localStorage.setItem('selectedEntity', 'News');
        }
        this.changeEntityTab(this.selectedTab);
      }
    });

    /** Subscribe when login user profile data changes */
    this.NewsListRef = this.messageService.getLoggedUserData().subscribe(res => {
      this.loggedUserData = this.utilService.getLoggedUserData();
      if (this.loggedUserData !== undefined && this.loggedUserData !== null && this.loggedUserData !== '') {
        this.isNewUpdateAvailable = this.loggedUserData.update_token;
      }
    });
  }

  /**
  * This function will call when component is load first time
  */
  ngOnInit() {

    this.setTeamGroupData.subscribe((res: any) => {
      this.teamsGroups = res;
    });

    this.setBiomarkerData.subscribe((res: any) => {
      this.showBiomarker = res;
      if (window.innerWidth < 565) {
        this.showMoreEntity = true;
      }
    });

    // if (localStorage.getItem('selectedEntity') !== null && localStorage.getItem('selectedEntity') !== '' && localStorage.getItem('selectedEntity') !== undefined) {
    //   this.selectedTab = localStorage.getItem('selectedEntity');
    // } else {
    //   localStorage.setItem('selectedEntity', 'content');
    // }
    localStorage.setItem('selectedEntity', 'News');
    this.messageService.setSelectedEntityData(this.selectedTab);
  }

  /**
  * This function will call when component is unload or destroy
  */
  ngOnDestroy() {

    if (!!this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }

    if (!!this.NewsListRef) {
      this.NewsListRef.unsubscribe();
    }

    this.messageService.setHttpLoaderStatus(true);
  }

  onResize(event: any) {
    if (this.showBiomarker === 'yes') {
      if (window.innerWidth < 565) {
        this.showMoreEntity = true;
      } else {
        this.showMoreEntity = false;
      }
    } else {
      this.showMoreEntity = false;
    }
  }

  /**
  * Hide/Show area list dropdown
  */
  showCategoryList() {
    if (this.showCategory) {
      this.showCategory = false;
    } else {
      this.showCategory = true;
    }
  }

  /**
  * fire event when user click on perticular tab
  * @param tabName clicking tab name
  */
  changeEntityTab(tabName: string) {
    this.selectedTab = tabName;
    if (this.selectedTab === 'News') {
      if (localStorage.getItem('analyticsTabData') !== null && localStorage.getItem('analyticsTabData') !== undefined) {
        this.selectedIndex = -1;
        this.selectedType = 'news Analytics';
      } else {
        this.selectedType = 'news';
        this.selectedIndex = 0;
      }
    }
    this.changeTab.next(tabName);
  }

  /**
  * Get and show news list by selected type
  * @param item selected team/group object
  */
  getSpecificNewsList(item: any) {
    console.log(item);
    // if (item === 'analytics') {
    //   this.selectedIndex = -1;
    //   this.selectedType = 'news Analytics';
    //   item = {
    //     id: -1,
    //     name: 'news Analytics',
    //     type: 'analytics'
    //   }
    // } else {
    //   this.selectedIndex = item.id;
    //   this.selectedType = item.name;
    // }
    this.selectedIndex = item.id;
    this.selectedType = item.name;
    this.showCategory = false;
    this.selectedTab = 'News';
    localStorage.setItem('selectedEntity', this.selectedTab);
    this.changeNewsList.next(item);
  }

  // Google Analytics Events Tracking
  gaNewsClicksTracking() {
    this.gaService.emitEvent(EventsData.newsButtonCategory, EventsData.newsButtonAction, EventsData.newsButtonLabel, 10);
  }
  gaDrugsClicksTracking() {
    this.gaService.emitEvent(EventsData.drugsButtonCategory, EventsData.drugsButtonAction, EventsData.drugsButtonLabel, 10);
  }
  gaNewsAnalysisTracking() {
    this.gaService.emitEvent(EventsData.newsAnalyticsButtonCategory, EventsData.newsAnalyticsButtonAction, EventsData.newsAnalyticsButtonLabel, 10);
  }

  /**
  * Clear the cache and reload the page to get latest version of demo
  */
  latestVersionOfdemo() {
    if ('caches' in window) {
      console.log(caches);
      caches.keys()
        .then(function (keyList) {
          return Promise.all(keyList.map(function (key) {
            return caches.delete(key);
          }));
        });
    }
    const postObj = {
      update_token: 1,
      is_all: 0
    };
    this.userService.updateUserStatusForNewUpdate(postObj)
      .then((res: any) => {
        console.log(res);
        if (res.success) {
          this.isNewUpdateAvailable = 1;
          location.reload();
        }
      }).catch((err: any) => {
        console.log(err);
      });
  }

}
