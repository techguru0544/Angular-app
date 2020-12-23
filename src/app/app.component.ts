import { Component, OnInit, HostListener, Renderer2, NgZone } from '@angular/core';
import { MessageService } from './core/service/message/message.service';
import { UtilService } from './core/service/util.service';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { PushNotificationsService } from './core/service/push-notifications/push-notifications.service';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs/observable/interval';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModelComponent } from './pages/common/message-model/message-model.component';
import { PlatformLocation, DOCUMENT } from '@angular/common';
// import { version } from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isShow = true;
  isFooterShow = true;
  showBtn: Boolean = false;
  loggedUserData: any;
  activeModal: any;
  windowScrolled: boolean;
  isRefresh = false;

  constructor(
    private utilService: UtilService,
    private router: Router,
    private _notificationService: PushNotificationsService,
    private swUpdate: SwUpdate,
    private messageService: MessageService,
    private modalService: NgbModal,
    private location: PlatformLocation,
    private renderer: Renderer2,
    ngZone: NgZone
  ) {
    this.location.onPopState(() => {
      localStorage.removeItem('showDrugDetail');
      this.messageService.setBrowserBackStatus(true);
    });

    this.loggedUserData = this.utilService.getLoggedUserData();
    if (this.loggedUserData !== null && this.loggedUserData !== undefined && this.loggedUserData !== '') {
      this._notificationService.requestPermission(this.loggedUserData.id);
    }
    this._notificationService.receiveMessage();
  }

  /**
   * Used for to scroll on top
   * @memberof AppComponent
   */
  public scrollToTop(): void {
    (function smoothscroll() {
      const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 8));
        /** Settings for scroll to top in IE browser */
        const ua = window.navigator.userAgent;
        const msie = ua.indexOf('MSIE ');
        if ((msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) && currentScroll < 5) {
          window.scrollTo(0, 0);
        }
      }
    })();
  }

  /**
   * This function will call when component is load first time
   * @memberof AppComponent
   */
  public ngOnInit(): void {
    if (performance.navigation.type === 0) {
      localStorage.removeItem('selectedEntity');
      localStorage.removeItem('isFromAnalytics');
      localStorage.removeItem('analyticsTabData');
      localStorage.removeItem('analyticsSelectedTab');
      localStorage.removeItem('pageReload');
      // localStorage.removeItem('KNewsItemData');
      // localStorage.removeItem('KActivetab');
    }
    this.router.events.subscribe((res) => {
      if (this.router.url === '/signup-success') {
        this.isFooterShow = true;
      }
      this.checkRoute();
    });
    if (this.utilService.isLoggedIn()) {
      if (this.router.url !== '/signup-success') {
        this.isFooterShow = false;
      }
    } else {
      this.checkRoute();
    }
  }

  /**
   * This funstion is used to check the active route and based on that show the footer
   * @memberof AppComponent
   */
  public checkRoute(): void {
    if (this.router.url === '/') {
      this.isFooterShow = false;
    } else {
      if (this.router.url === '/login' || this.router.url === '/signup' || this.router.url.indexOf('/auth') > -1 || this.router.url.indexOf('password') > -1) {
        this.isFooterShow = true;
      } else {
        this.isFooterShow = false;
      }
    }
  }
}
