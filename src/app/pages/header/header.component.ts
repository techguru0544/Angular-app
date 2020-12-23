import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { MessageService } from './../../core/service/message/message.service';
import { UtilService } from './../../core/service/util.service';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from './../../core/service/user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignOutModalComponent } from './../common/sign-out-modal/sign-out-modal.component';
import 'rxjs/add/operator/pairwise';
import { environment } from '../../../environments/environment';
import { UserStatisticsService } from './../../core/service/user-statistics/user-statistics.service';
declare var $: any;

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

    shouldShow: Boolean = false;
    shouldShowSec: Boolean = false;
    searchText: string;
    isHomePage = true;
    newsData: any;
    isShow = false;
    notificationCounts = 0;
    showBiomarker = '';
    loggedUserData: any;
    usersData: any;
    isnewsActive = true;
    placeHolder = 'Search news';
    searchExist = false;
    isClick = false;
    isShowNotification = false;
    searchReference: any;
    oldSearchText = '';
    currentYear: Number;
    isLogin = false;
    routerRef: any;
    isSearchFocus = false;
    NewsListRef: any;
    selectedEntityRef: any;
    selectedEntity = 'content';
    isDrugActive = false;
    isDrugShow = false;
    backRef: any;
    headerRef: any;
    isConferenceActive = false;
    isConferenceShow = false;
    isBiomarkerActive = false;
    isBiomarkerShow = false;
    isNewUpdateAvailable = 1;
    isHome = true;
    isContentActive = false;
    newUpdateCount = 0;
    isNotificationExist = false;
    isUpdateClick = false;
    userStatiticsNewslistSaved = false;
    userStatiticsDruglistSaved = false;
    userStatiticsConferencelistSaved = false;
    userStatiticsBiomarkerlistSaved = false;
    constructor(
        private renderer: Renderer2,
        private messageService: MessageService,
        private utilService: UtilService,
        private router: Router,
        private userService: UserService,
        private modalService: NgbModal,
        private UserStatisticsService: UserStatisticsService
    ) {
        // if (localStorage.getItem('selectedEntity') !== null && localStorage.getItem('selectedEntity') !== '' && localStorage.getItem('selectedEntity') !== undefined) {
        //     this.selectedEntity = localStorage.getItem('selectedEntity');
        // } else {
        //     localStorage.setItem('selectedEntity', 'content');
        // }
        localStorage.setItem('selectedEntity', 'News');
        this.routerRef = this.router.events.filter(event => event instanceof NavigationEnd)
            .subscribe(e => {
               if (this.router.url.indexOf(environment.appPrefix) > -1) {
                    if (this.router.url.indexOf('/home?entity') > -1) {
                        this.isHome = true;
                    } else {
                        if (this.router.url === environment.appPrefix) {
                            this.isHome = true;
                        } else {
                            this.isHome = false;
                        }
                    }
                } else {
                    this.isHome = false;
                }
                if (this.utilService.isLoggedIn()) {
                    this.isLogin = true;
                    this.getLoginUserDetail();
                } else {
                    this.isLogin = false;
                }
            });

        if (this.router.url === environment.appPrefix) {
            this.isnewsActive = true;
            this.searchText = '';
            this.oldSearchText = '';
            this.searchExist = false;
            this.checkActiveTabData();
        } else {
            this.isnewsActive = false;
            this.isDrugActive = false;
            this.isConferenceActive = false;
            this.isContentActive = false;
        }
        this.newsData = localStorage.getItem('header_title');
        if (this.newsData !== null) {
            this.isHomePage = false;
        } else {
            this.newsData = '';
            this.isHomePage = true;
        }

        /** get status of header data is set of not and show search textbox on header or not */
        this.headerRef = this.messageService.getnewsData().subscribe(res => {
            this.newsData = res;
            if (this.newsData !== null && this.newsData !== '') {
                this.isHomePage = false;
                if (localStorage.getItem('header_title') !== null && localStorage.getItem('header_title') !== undefined) {
                    this.newsData = localStorage.getItem('header_title');
                }
                if (this.newsData === 'null') {
                    this.newsData = '';
                }
                if (Object.keys(this.newsData).length === 0 && this.newsData.constructor === Object) {
                    this.newsData = '';
                }
            } else {
                this.isHomePage = true;
                this.oldSearchText = '';
                this.setSearchTextSettings();
                this.newsData = '';
            }
            if (this.router.url === environment.appPrefix) {
                this.searchText = '';
                this.oldSearchText = '';
                this.searchExist = false;
                localStorage.removeItem('ksearch_text');
                this.checkActiveTabData();
            } else {
                this.isnewsActive = false;
                this.isDrugActive = false;
                this.isConferenceActive = false;
                this.isContentActive = false;
            }
        });

        /** Hide the search auto suggestion box and check exist search text */
        this.searchReference = this.messageService.getShowSearchFlag().subscribe(res => {
            this.isShow = false;
            this.isSearchFocus = false;
            this.isDrugShow = false;
            this.isConferenceShow = false;
            this.renderer.removeClass(document.body, 'body-overflow');
            const search = localStorage.getItem('ksearch_text');
            if (search === null || search === '') {
                this.router.navigate([`/${environment.appPrefix}`]);
            }
            if (search === null) {
                this.searchText = '';
                this.oldSearchText = '';
                this.searchExist = false;
            } else {
                this.searchText = search;
                this.searchExist = true;
            }
            if (this.router.url === environment.appPrefix) {
                this.searchExist = false;
                this.searchText = '';
                this.oldSearchText = '';
            } else {
                if (this.searchText !== '') {
                    localStorage.setItem('ksearch_text', this.searchText);
                }
            }
            this.setSearchTextSettings();
        });

        /** check is exist News list is updated by user or not if yes then get user detail from API */
        this.NewsListRef = this.messageService.getnewsListEditStatus().subscribe(res => {
            if (this.utilService.isLoggedIn()) {
                this.isLogin = true;
                this.getLoginUserDetail();
            } else {
                this.isLogin = false;
            }
        });

        /** Check which entity is selected on dashboard and based on this set searchbox settings */
        this.selectedEntityRef = this.messageService.getSelectedEntityData().subscribe((res: any) => {
            if (res !== undefined) {
                this.selectedEntity = res;
                this.setPlaceholderForSearchBox('');
                this.checkActiveTabData();
                if (res !== 'content' && res !== 'biomarker') {
                    this.setSearchTextSettings();
                }
            }
        });

        this.backRef = this.messageService.getBrowserBackStatus().subscribe(res => {
            if (res) {
                this.isShow = false;
                this.isDrugShow = false;
                this.isSearchFocus = false;
                this.isConferenceShow = false;
                this.renderer.removeClass(document.body, 'body-overflow');
            }
        });

        this.loggedUserData = this.utilService.getLoggedUserData();

        if (this.loggedUserData !== undefined && this.loggedUserData !== null && this.loggedUserData !== '') {
            if (this.loggedUserData['teams'] !== undefined) {
                for (const x of Object.keys(this.loggedUserData['teams'])) {
                    if (this.loggedUserData['teams'][x]['show_biomarker_entity'] == '1') {
                        this.showBiomarker = 'yes';
                    }
                }
            }
        }

    }

    /**
     * This function will call when component is load first time
     * @memberof HeaderComponent
     */
    public ngOnInit(): void {
        const date = new Date();
        this.currentYear = date.getFullYear();
        if (this.utilService.isLoggedIn()) {
            this.isLogin = true;
        } else {
            this.isLogin = false;
        }
    }

    /**
     * This function will call when component is destroy
     * @memberof HeaderComponent
     */
    public ngOnDestroy(): void {
        if (!!this.routerRef) {
            this.routerRef.unsubscribe();
        }

        if (!!this.NewsListRef) {
            this.NewsListRef.unsubscribe();
        }

        if (!!this.searchReference) {
            this.searchReference.unsubscribe();
        }

        if (!!this.selectedEntityRef) {
            this.selectedEntityRef.unsubscribe();
        }

        if (!!this.backRef) {
            this.backRef.unsubscribe();
        }

        if (!!this.headerRef) {
            this.headerRef.unsubscribe();
        }
    }

    /**
     * Check which entity is active and based on that set search box settings
     * @memberof HeaderComponent
     */
    public setSearchTextSettings(): void {
        const self = this;
        $(document).ready(function () {
            let timer;
            // tslint:disable-next-line: prefer-const
            let x;

            $('#searchInput').keydown(function () {
                if (self.selectedEntity === 'News') {
                    self.isShow = true;
                } else if (self.selectedEntity === 'drug') {
                    self.isDrugShow = true;
                } else if (self.selectedEntity === 'conference') {
                    self.isConferenceShow = true;
                } else if (self.selectedEntity === 'biomarker') {
                    self.isBiomarkerShow = true;
                }
                if (x) { x.abort(); }
                clearTimeout(timer);
                timer = setTimeout(function () {
                    self.doSearch();
                }, 100);
            });
        });
    }

    /**
    * Get current login user detail
    * @memberof HeaderComponent
    */
    public getLoginUserDetail(): void {
        this.userService.getUserDetail()
            .then((userRes: any) => {
                if (userRes['success']) {
                    this.utilService.setLoggedUserData(JSON.stringify(userRes['data']));
                    this.messageService.setLoggedUserData(userRes['data']);
                    this.usersData = userRes['data'];
                    this.notificationCounts = this.usersData['push_notifications_count'];
                    if (this.usersData['all_notifications_count'] !== null && this.usersData['all_notifications_count'] !== undefined && this.usersData['all_notifications_count'] > 0) {
                        this.newUpdateCount = this.usersData['notifications_count'];
                        this.isNotificationExist = true;
                    }

                    if (this.usersData.organizations_count === 0) {
                        this.isShowNotification = false;
                    } else {
                        this.isShowNotification = true;
                    }

                    this.isNewUpdateAvailable = this.usersData.update_token;

                    if (this.usersData['teams'] !== undefined) {
                        for (const x of Object.keys(this.usersData['teams'])) {
                            if (this.usersData['teams'][x]['show_biomarker_entity'] == '1') {
                                this.showBiomarker = 'yes';
                            }
                        }
                    }
                } else {
                    this.messageService.setLoggedUserData(null);
                }
            }).catch((err: any) => {
                console.log(err);
                this.messageService.setLoggedUserData(null);
            });
    }

    /**
     * @memberof HeaderComponent
     */
    public hideShowSec(): void {
        if (!this.shouldShowSec) {
            this.renderer.addClass(document.body, 'bodyFixed');
        } else {
            this.newUpdateCount = 0;
            this.renderer.removeClass(document.body, 'bodyFixed');
        }
        this.shouldShowSec = !this.shouldShowSec;
    }

    /**
     * Redirect on selected page and hide/show sidemenu
     * @param {any} pageUrl selected page url
     * @memberof HeaderComponent
     */
    public hideShowClass(pageUrl: any): void {
        if (!this.shouldShow) {
            this.renderer.addClass(document.body, 'bodyFixed');
        } else {
            this.renderer.removeClass(document.body, 'bodyFixed');
        }
        this.shouldShow = !this.shouldShow;
        this.isShow = false;
        this.isSearchFocus = false;
        this.isDrugShow = false;
        this.isConferenceShow = false;
        if (this.router.url.indexOf('/news-list') === -1 && this.router.url.indexOf('/drug-search-result') === -1 && this.router.url.indexOf('/conference-search-result') === -1) {
            this.searchText = '';
            this.oldSearchText = '';
            this.searchExist = false;
        }
        if (pageUrl !== 'menu') {
            this.searchText = '';
            this.oldSearchText = '';
            this.searchExist = false;
        }
        this.renderer.removeClass(document.body, 'body-overflow');
        if (pageUrl !== '' && pageUrl !== 'News' && pageUrl !== 'drug' && pageUrl !== 'conference' && pageUrl !== 'biomarker' && pageUrl !== 'content') {
            if (pageUrl === '/terms-of-service') {
                this.router.navigate([pageUrl]);
            } else if (pageUrl === '/privacy-policy') {
                this.router.navigate([pageUrl]);
            } else if (pageUrl === 'home') {
                this.router.navigate([`${environment.appPrefix}`]);
            } else {
                if (pageUrl !== 'menu') {
                    this.router.navigate([`${environment.appPrefix}${pageUrl}`]);
                }
            }
        } else {
            console.log(pageUrl);
            if (pageUrl === 'News' || pageUrl === 'drug' || pageUrl === 'conference' || pageUrl === 'biomarker' || pageUrl === 'content') {
                localStorage.setItem('selectedEntity', pageUrl);
                this.messageService.setSelectedEntityData(pageUrl);
            }
        }
    }

    /**
    * search news data
    * @param {any} event input event object
    * @memberof HeaderComponent
    */
    public search(event: any): void {
        this.messageService.setnewsSearchTextIsStart(this.searchText);
    }

    /**
     * Perform search opration
     * @memberof HeaderComponent
     */
    public doSearch(): void {
        console.log(this.searchText);
        if (this.oldSearchText !== this.searchText) {
            this.messageService.setnewsSearchText(this.searchText);
        }
        this.oldSearchText = this.searchText;
    }

    /**
     * Called when used press any key on search box
     * @param {any} event key press event object
     * @memberof HeaderComponent
     */
    public enterKeyPress(event: any): void {
        this.oldSearchText = '';
        this.doSearch();
    }

    /**
    * Open signout modal
    * @memberof HeaderComponent
    */
    public signOutModal(): void {
        const activeModal = this.modalService.open(SignOutModalComponent, { size: 'sm' });
    }

    /**
    * open recent search text when focus on textbox
    * @param {any} event search box focus event object
    * @memberof HeaderComponent
    */
    public getSearchBoxFocus(event: any): void {
        if (localStorage.getItem('selectedEntity') !== null && localStorage.getItem('selectedEntity') !== '' && localStorage.getItem('selectedEntity') !== undefined) {
            this.selectedEntity = localStorage.getItem('selectedEntity');
        } else {
            if (this.router.url.indexOf('conference')) {
                localStorage.setItem('selectedEntity', 'conference');
            } else if (this.router.url.indexOf('drug')) {
                localStorage.setItem('selectedEntity', 'drug');
            } else {
                localStorage.setItem('selectedEntity', 'News');
            }
            this.selectedEntity = localStorage.getItem('selectedEntity');
        }
        this.isSearchFocus = true;
        this.searchExist = false;
        console.log(this.selectedEntity);
        this.renderer.addClass(document.body, 'body-overflow');
        if (this.selectedEntity === 'News') {
            this.isShow = true;
            this.isDrugShow = false;
            this.isConferenceShow = false;
            this.isBiomarkerShow = false;
        } else if (this.selectedEntity === 'drug') {
            this.isDrugShow = true;
            this.isShow = false;
            this.isConferenceShow = false;
            this.isBiomarkerShow = false;
        } else if (this.selectedEntity === 'conference') {
            this.isDrugShow = false;
            this.isShow = false;
            this.isConferenceShow = true;
            this.isBiomarkerShow = false;
        } else if (this.selectedEntity === 'biomarker') {
            this.isDrugShow = false;
            this.isShow = false;
            this.isConferenceShow = false;
            this.isBiomarkerShow = true;
        }
    }

    /**
     * Remove search fox focus
     * @param {any} event search box focus out event object 
     * @memberof HeaderComponent
     */
    public removeSearchBoxFocus(event: any): void {
        if (this.selectedEntity === 'News') {
            if (!this.isShow) {
                this.isSearchFocus = false;
            }
        }
        if (this.selectedEntity === 'drug') {
            if (!this.isDrugShow) {
                this.isSearchFocus = false;
            }
        }
        if (this.selectedEntity === 'conference') {
            if (!this.isConferenceShow) {
                this.isSearchFocus = false;
            }
        }
        if (this.selectedEntity === 'biomarker') {
            this.isSearchFocus = false;
            this.searchText = '';
            this.renderer.removeClass(document.body, 'bodyFixed');
            this.renderer.removeClass(document.body, 'body-overflow');
        }
        this.setPlaceholderForSearchBox('');
    }

    /**
     * Called when click on sidemenu
     * @memberof HeaderComponent
     */
    public clickSideMenu(): void {
        this.isClick = true;
    }

    /**
     * Used for close sidemenu
     * @memberof HeaderComponent
     */
    public closeSideMenu(): void {
        if (this.isClick) {
            this.isClick = false;
        } else {
            if (!this.shouldShow) {
                this.renderer.addClass(document.body, 'bodyFixed');
            } else {
                this.renderer.removeClass(document.body, 'bodyFixed');
            }
            this.shouldShow = !this.shouldShow;
        }
    }

    /**
     * Called when click on header logo
     * @memberof HeaderComponent
     */
    public logoClick(): void {
        this.searchText = '';
        this.searchExist = false;
        this.isShow = false;
        this.isSearchFocus = false;
        this.oldSearchText = '';
        this.isDrugShow = false;
        this.isConferenceShow = false;
        localStorage.removeItem('isFromAnalytics');
        localStorage.removeItem('analyticsTabData');
        localStorage.removeItem('analyticsSelectedTab');
        localStorage.setItem('selectedEntity', 'News');
        this.router.navigate([`${environment.appPrefix}`]);
    }

    /**
    * Open all search result screen click on search icon from herder
    * @memberof HeaderComponent
    */
    public openSearchResultScreen(): void {
        if (this.searchText.length >= 3) {
            this.messageService.setnewsSearchIconClick(true);
        }
    }

    /**
     * Get dummy image for user with his name
     * @memberof HeaderComponent
     */
    public getNameInitials(): string {
        if (this.usersData !== undefined) {
            let name = '';
            if (this.usersData.first_name !== null) {
                name = `${this.usersData.first_name.split(' ')[0][0]}`;
            }
            if (this.usersData.last_name !== null) {
                name = name + `${this.usersData.last_name.split(' ')[0][0]}`;
            }
            return name;
        } else {
            return;
        }
    }

    /**
    * Set placeholder text when focusout from search box
    * @param {any} event
    * @memberof HeaderComponent
    */
    public setPlaceholderForSearchBox(event: any): void {
        if (this.selectedEntity === 'News') {
            this.placeHolder = 'Search news';
        } else if (this.selectedEntity === 'drug') {
            this.placeHolder = 'Search drugs';
        } else if (this.selectedEntity === 'conference') {
            this.placeHolder = 'Search conferences';
        } else if (this.selectedEntity === 'biomarker') {
            this.placeHolder = '';
        }
    }

    /**
    * Check which entity is active
    * @memberof HeaderComponent
    */
    public checkActiveTabData(): void {
        if (localStorage.getItem('selectedEntity') !== null && localStorage.getItem('selectedEntity') !== '' && localStorage.getItem('selectedEntity') !== undefined) {
            this.selectedEntity = localStorage.getItem('selectedEntity');
            var postObj = {};
            if (this.selectedEntity === 'News') {
                this.isnewsActive = true;
                this.isDrugActive = false;
                this.isConferenceActive = false;
                this.isBiomarkerActive = false;
                this.isContentActive = false;
                postObj['entity_id'] = 0;
                postObj['page'] = 'NewsListing';
                postObj['tab'] = 'Main';
                if(!this.userStatiticsNewslistSaved)
                {
                    this.userStatiticsNewslistSaved = true;
                    this.UserStatisticsService.saveUserStatistics(postObj);
                }
            } else if (this.selectedEntity === 'drug') {
                this.isDrugActive = true;
                this.isnewsActive = false;
                this.isConferenceActive = false;
                this.isBiomarkerActive = false;
                this.isContentActive = false;
                postObj['entity_id'] = 0;
                postObj['page'] = 'DrugListing';
                postObj['tab'] = 'Main';
                if(!this.userStatiticsDruglistSaved)
                {
                    this.userStatiticsDruglistSaved = true;
                    this.UserStatisticsService.saveUserStatistics(postObj);
                }
            } else if (this.selectedEntity === 'conference') {
                this.isDrugActive = false;
                this.isnewsActive = false;
                this.isConferenceActive = true;
                this.isBiomarkerActive = false;
                this.isContentActive = false;
                postObj['entity_id'] = 0;
                postObj['page'] = 'ConferenceListing';
                postObj['tab'] = 'Main';
                if(!this.userStatiticsConferencelistSaved)
                {
                    this.userStatiticsConferencelistSaved = true;
                    this.UserStatisticsService.saveUserStatistics(postObj);
                }

            } else if (this.selectedEntity === 'biomarker') {
                this.isDrugActive = false;
                this.isnewsActive = false;
                this.isBiomarkerActive = true;
                this.isConferenceActive = false;
                this.isContentActive = false;
                postObj['entity_id'] = 0;
                postObj['page'] = 'BiomarkerListing';
                postObj['tab'] = 'Main';
                if(!this.userStatiticsBiomarkerlistSaved)
                {
                    this.userStatiticsBiomarkerlistSaved = true;
                    this.UserStatisticsService.saveUserStatistics(postObj);
                }

            } else if (this.selectedEntity === 'content') {
                this.isDrugActive = false;
                this.isnewsActive = false;
                this.isBiomarkerActive = false;
                this.isConferenceActive = false;
                this.isContentActive = true;
            }
        } else {
            this.isnewsActive = true;
            this.isDrugActive = false;
            this.isConferenceActive = false;
            this.isBiomarkerActive = false;
            this.isContentActive = false;
        }
    }

    /**
     * Get rediretcion URL
     * @param pageUrl selected page url
     * @memberof HeaderComponent
     */
    public getRedirectionlink(pageUrl: any): string {
        return `${environment.appPrefix}${pageUrl}`;
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

    closeNotificationMenu() {
        if (this.isUpdateClick) {
            this.isUpdateClick = false;
        } else {
            if (!this.shouldShowSec) {
                this.renderer.addClass(document.body, 'bodyFixed');
            } else {
                this.renderer.removeClass(document.body, 'bodyFixed');
            }
            this.shouldShowSec = !this.shouldShowSec;
        }
    }

    closeNotificationContent() {
        this.isUpdateClick = true;
    }

}
