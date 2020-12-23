import { Component, OnInit, OnDestroy, Renderer2, HostListener } from '@angular/core';
import { HomeService } from './../../core/service/home/home.service';
import { MessageService } from './../../core/service/message/message.service';
import { Router } from '@angular/router';
import { UtilService } from './../../core/service/util.service';
import { apiInfo } from './../../../environments/environment';
import 'rxjs/add/operator/filter';
import { environment } from '../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './../../core/service/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { GoogleAnalyticsService } from 'src/app/core/service/google-analytics.service';
import { EventsData } from 'src/app/core/service/gaEventsData';
import { Location } from '@angular/common';
import { SlickCarouselComponent } from 'ngx-slick-carousel';

declare var $: any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    newsData: any = [];
    currentPage = 1;
    nextPage = false;
    query = '';
    loggedUserData: any;
    userMode: any;
    isLoad = false;
    isLoadMore = false;
    NewsReference: any;
    isApiRun = false;
    ifAPISuccess = false;
    message: any;
    isLAPP = false;
    NewsListRef: any;
    isExpired = false;
    showBiomarker = '';
    remainingDays: any;
    expiredMsg = '';
    isGroupShowId: any;
    showGroupPopup = false;
    teamsGroups: any = [];
    NewsTeams: any = [];
    NewsGroups: any = [];
    groupForm: FormGroup;
    modalReference: any;
    numTeams: any;
    numGroups: any;
    postObj: any = {};
    isSpecificClick = false;
    clickedTab: any = {};
    existsMsg: any = '';
    selectedTab = 'News';
    selectedTabRef: any;
    isDrugExpired = false;
    drugRemainingDays: any;
    drugExpiredMsg = '';
    isAnalyticShow = false;
    itemDetails: any;
    slideNo = 0;

    /**
     * Called when click anywhere on DOM
     * @param event click event object
     */
    @HostListener('document:click', ['$event'])
    clickout(event: any) {
        if (event.srcElement.className.indexOf('groupPopup') === -1) {
            if (this.showGroupPopup) {
                this.showGroupPopup = false;
                this.groupForm.reset();
            }
        }
    }

    constructor(
        private homeService: HomeService,
        private messageService: MessageService,
        private router: Router,
        private utilService: UtilService,
        private renderer: Renderer2,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private gaService: GoogleAnalyticsService,
        private location: Location
    ) {
        this.isLoad = false;
        this.loggedUserData = this.utilService.getLoggedUserData();

        /** Check the query parameter on url and redirection on that entity */
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.hasOwnProperty('entity')) {
                this.selectedTab = params.entity;
                localStorage.setItem('selectedEntity', this.selectedTab);
                this.location.replaceState(this.location.path().split('?')[0], '');
            }
        });

        this.userMode = this.loggedUserData['mode'];
        if (this.loggedUserData !== null && this.loggedUserData !== undefined && this.loggedUserData !== '') {
            if (this.loggedUserData.organizations_count === 0) {
                this.isLAPP = true;
            }
        }

        this.NewsReference = this.messageService.getHideSearchBoxStatus().subscribe(res => {
            if (res) {
                this.renderer.removeClass(document.body, 'body-overflow');
                this.messageService.setHttpLoaderStatus(true);
                this.messageService.setnewsListEditStatus(true);
                if (!this.ifAPISuccess) {
                    if (localStorage.getItem('selectedEntity') === 'News') {
                        this.isLoad = false;
                        this.currentPage = 1;
                        this.newsData = [];
                        this.clickedTab = {};
                        this.isAnalyticShow = false;
                        this.messageService.setHttpLoaderStatus(true);
                        this.getAllLAPPnewsData(null);
                    }
                }
            }
        });

        /** Subscribe when login user profile data changes */
        this.NewsListRef = this.messageService.getLoggedUserData().subscribe(res => {
            this.loggedUserData = this.utilService.getLoggedUserData();
            this.checkUserLoginDetail();
        });

        /** Add new group form structure create with required validation */
        this.groupForm = this.formBuilder.group({
            groupName: [
                '',
                [
                    Validators.required,
                ]
            ]
        });
    }

    /**
     * This function will call when component is load first time
     * @memberof DashboardComponent
     */
    public ngOnInit(): void {
        this.messageService.setHttpLoaderStatus(true);
        localStorage.removeItem('Kselected_news');
        localStorage.removeItem('header_title');
        this.messageService.setnewsData(null);
        localStorage.removeItem('kselected_tab');
        localStorage.removeItem('KsearchAreaId');
        localStorage.removeItem('KsearchAreaData');
        localStorage.removeItem('KsearchInstituteId');
        localStorage.removeItem('KsearchInstituteData');
        localStorage.removeItem('kbookmarkselected_tab');
        localStorage.removeItem('KNewsItemData');
        localStorage.removeItem('KActivetab')
        this.renderer.removeClass(document.body, 'body-overflow');

        // if (localStorage.getItem('selectedEntity') !== null && localStorage.getItem('selectedEntity') !== '' && localStorage.getItem('selectedEntity') !== undefined) {
        //     this.selectedTab = localStorage.getItem('selectedEntity');
        // } else {
        //     localStorage.setItem('selectedEntity', 'content');
        // }
        localStorage.setItem('selectedEntity', 'News');
        this.messageService.setSelectedEntityData(this.selectedTab);

       // if (this.selectedTab === 'News') {
            this.showGroupsandTeams();
        // }
    }

    /**
     * This function will call when component is destroy
     * @memberof DashboardComponent
     */
    public ngOnDestroy(): void {
        if (!!this.NewsReference) {
            this.NewsReference.unsubscribe();
        }

        if (!!this.NewsListRef) {
            this.NewsListRef.unsubscribe();
        }

        if (!!this.selectedTabRef) {
            this.selectedTabRef.unsubscribe();
        }

        this.messageService.setHttpLoaderStatus(true);
    }

    /**
    * check login user type and show data based on that
    * @memberof DashboardComponent
    */
    public checkUserLoginDetail(): void {
        if (this.loggedUserData !== null || this.loggedUserData !== undefined || this.loggedUserData !== '') {
            this.userMode = this.loggedUserData['mode'];
            if (this.loggedUserData.organizations_count === 0) {
                this.isLAPP = true;
            }
            if (this.isLAPP) {
                this.remainingDays = this.loggedUserData.remaining_days;
                this.drugRemainingDays = this.loggedUserData.drug_remaining_days;

                /**
                * Show subscrirption reminder msg for individual user (News entity)
                */
                if (this.remainingDays <= 15) {
                    if (this.loggedUserData.active_subscription_expired !== null && this.loggedUserData.active_subscription_expired !== '') {
                        this.isExpired = true;
                    } else {
                        this.isExpired = false;
                    }
                } else {
                    this.isExpired = false;
                }
                this.expiredMsg = '';

                /**
                * Show subscrirption reminder msg for individual user (Drug entity)
                */
                if (this.drugRemainingDays <= 15) {
                    if (this.loggedUserData.drugs_subscription_expired !== null && this.loggedUserData.drugs_subscription_expired !== '') {
                        this.isDrugExpired = true;
                    } else {
                        this.isDrugExpired = false;
                    }
                } else {
                    this.isDrugExpired = false;
                }
                this.drugExpiredMsg = '';
            } else {
                this.isExpired = false;
                let isSet = false;
                this.expiredMsg = '';
                this.isDrugExpired = false;
                this.drugExpiredMsg = '';
                let drugIsSet = false;
                let NewsExpiry: any[][] = [];
                let drugExpiry: any[][] = [];

                if (this.loggedUserData.teams !== undefined) {
                    for (const x of Object.keys(this.loggedUserData.teams)) {
                        if (this.loggedUserData['teams'][x]['show_biomarker_entity'] == '1') {
                            this.showBiomarker = 'yes';
                        }
                        let days = 0;
                        let isExpired = false;
                        let drugDays = 0;
                        let drugIsExpired = false;
                        this.loggedUserData.teams[x]['subscription'].filter((item: any) => {
                            if (item.subscription_expired_date !== null && item.subscription_expired_date !== '') {
                                if (item['remaining_days'] === null) {
                                    if (item['entity'] === 'news') {
                                        days = null;
                                    }
                                    if (item['entity'] === 'Drugs') {
                                        drugDays = null;
                                    }
                                }
                                if (item['remaining_days'] <= 15) {
                                    if (item['entity'] === 'news') {
                                        days = item['remaining_days'];
                                        isExpired = true;
                                    }
                                    if (item['entity'] === 'Drugs') {
                                        drugDays = item['remaining_days'];
                                        drugIsExpired = true;
                                    }
                                }
                            }
                        });

                        /**
                        * Subscription reminder msg set for Team user (News entity)
                        */
                       if (days === null) {
                        if(NewsExpiry['expired'] == undefined) NewsExpiry['expired']=[];
                        NewsExpiry['expired'].push(this.loggedUserData.teams[x]['name']);
                       }
                       if (days === 0 && isExpired) {
                        if(NewsExpiry['today'] == undefined) NewsExpiry['today']=[];
                        NewsExpiry['today'].push(this.loggedUserData.teams[x]['name']);
                       }
                       if (days > 0) {
                        let strDays = (days === 1)?'day':'days';

                        if(NewsExpiry['expires'] == undefined) NewsExpiry['expires']=[];

                        NewsExpiry['expires'].push(`team (${this.loggedUserData.teams[x]['name']}) expires in ${days}  ` + strDays);

                       }else if (days < 0) {
                        if(NewsExpiry['today'] == undefined) NewsExpiry['today']=[];
                        NewsExpiry['today'].push(this.loggedUserData.teams[x]['name']);
                       }

                        /**
                        * Subscription reminder msg set for Team user (Drug entity)
                        */
                      if (drugDays === null) {
                        if(drugExpiry['expired'] == undefined) drugExpiry['expired']=[];
                        drugExpiry['expired'].push(this.loggedUserData.teams[x]['name']);
                       }
                       if (drugDays === 0 && drugIsExpired) {
                        if(drugExpiry['today'] == undefined) drugExpiry['today']=[];
                        drugExpiry['today'].push(this.loggedUserData.teams[x]['name']);
                       }
                       if (drugDays > 0) {
                        let strDays = (drugDays === 1)?'day':'days';

                        if(drugExpiry['expires'] == undefined) drugExpiry['expires']=[];

                        drugExpiry['expires'].push(`team (${this.loggedUserData.teams[x]['name']}) expires in ${drugDays}  ` + strDays);

                       }else if (drugDays < 0) {
                        if(drugExpiry['today'] == undefined) drugExpiry['today']=[];
                        drugExpiry['today'].push(this.loggedUserData.teams[x]['name']);
                       }

                    }

                    for (var type in NewsExpiry) {
                        let items = NewsExpiry[type].length;
                        let tempMsg = "";

                        if(items > 0)
                        {
                            for(var index in NewsExpiry[type])
                            {
                                let joiner = (Number(index) == items-2)?" and ":", ";
                                if(Number(index) == items-1) joiner = "";

                                if(type == 'expires')
                                {
                                tempMsg += NewsExpiry[type][index]+joiner;
                                }else
                                tempMsg += `team (${NewsExpiry[type][index]})${joiner}`;
                            }
                            tempMsg = `Your subscription for ${tempMsg}`;
                            if (type == 'expired') tempMsg += " has expired";
                            if (type == 'today') tempMsg += " expires today";
                            this.expiredMsg += tempMsg + ". ";
                        }
                    }


                    for (var type in drugExpiry) {
                        let items = drugExpiry[type].length;
                        let tempMsg = "";

                        if (items > 0) {
                            for (var index in drugExpiry[type]) {
                                let joiner = (Number(index) == items - 2) ? " and " : ", ";
                                if (Number(index) == items - 1) joiner = "";

                                if (type == 'expires') {
                                    tempMsg += drugExpiry[type][index] + joiner;
                                } else
                                    tempMsg += `team (${drugExpiry[type][index]})${joiner}`;
                            }
                            tempMsg = `Your subscription for ${tempMsg}`;
                            if (type == 'expired') tempMsg += " has expired";
                            if (type == 'today') tempMsg += " expires today";
                            this.drugExpiredMsg += tempMsg + ". ";
                        }
                    }

                }
            }
        }
    }

    /**
    * Get all news list form server for Lapp users
    * @param {any} iten selected get data type
    * @memberof DashboardComponent
    */
    public getAllLAPPnewsData(item: any): void {
        this.ifAPISuccess = true
        if (item) {
            if (item !== 'scroll') {
                this.currentPage = 1;
                this.newsData = [];
            }
        } else {
            this.clickedTab['id'] = 0;
        }
        this.postObj = {
            'page': this.currentPage,
            'favourite': true
        };
        if (item) {
            if (item.type !== 'all' && item !== 'scroll') {
                this.postObj['type'] = item.type;
                this.postObj['id'] = item.id;
                this.isSpecificClick = true;
            } else {
                if (item === 'scroll') {
                    this.postObj['type'] = this.clickedTab['type'];
                    this.postObj['id'] = this.clickedTab['id'];
                }
                this.isSpecificClick = false;
            }
        }

        if (this.query !== '') {
            this.postObj['query'] = this.query;
        }
        if (this.currentPage === 1) {
            this.isLoad = false;
        }
        this.homeService.getAllLAPPnews(this.postObj)
            .then(res => {
                if (res['success']) {
                    this.nextPage = res['data']['next_page'];
                    Object.keys(res['data']['data']).map(key => {
                        const instituteData = [];
                        for (const i of Object.keys(res['data']['data'][key]['News_institutions'])) {
                            const data = [];
                            let name = '';
                            if (res['data']['data'][key]['News_institutions'][i]['name'] !== null && res['data']['data'][key]['News_institutions'][i]['name'] !== '') {
                                name = res['data']['data'][key]['News_institutions'][i]['name'];
                            }
                            if (res['data']['data'][key]['News_institutions'][i]['city'] !== null && res['data']['data'][key]['News_institutions'][i]['city'] !== '') {
                                data.push(res['data']['data'][key]['News_institutions'][i]['city']);
                            }
                            if (res['data']['data'][key]['News_institutions'][i]['state'] !== null && res['data']['data'][key]['News_institutions'][i]['state'] !== '') {
                                data.push(res['data']['data'][key]['News_institutions'][i]['state']);
                            }
                            if (res['data']['data'][key]['News_institutions'][i]['country'] !== null && res['data']['data'][key]['News_institutions'][i]['country'] !== '') {
                                data.push(res['data']['data'][key]['News_institutions'][i]['country']);
                            }
                            instituteData.push({
                                name,
                                'location': data.join(', ')
                            });
                        }
                        res['data']['data'][key]['institutionsData'] = instituteData;
                        if (res['data']['data'][key]['News_image_url'] === null || res['data']['data'][key]['News_image_url'] === undefined || res['data']['data'][key]['News_image_url'] === '') {
                            res['data']['data'][key]['News_image_url'] = '';
                            const _name = res['data']['data'][key].News_full_name;
                            if (_name !== null && _name !== undefined) {
                                if (res['data']['data'][key].News_first_name !== null) {
                                    res['data']['data'][key]['News_short_name'] = `${res['data']['data'][key].News_first_name.split(' ')[0][0]}`;
                                }
                                if (res['data']['data'][key].News_last_name !== null) {
                                    res['data']['data'][key]['News_short_name'] = res['data']['data'][key]['News_short_name'] + `${res['data']['data'][key].News_last_name.split(' ')[0][0]}`;
                                }
                            }
                        }
                        this.newsData.push(res['data']['data'][key]);
                    });
                    if (res['data']['next_page']) {
                        this.currentPage += 1;
                    }
                    if (item && this.newsData.length > 0) {
                        this.isSpecificClick = false;
                    }
                    this.isLoad = true;
                    this.isLoadMore = false;
                    this.isApiRun = false;
                } else {
                    this.isApiRun = false;
                }
                this.ifAPISuccess = false;
            }).catch(err => {
                console.log(err);
                this.isLoad = true;
                this.isApiRun = false;
                this.ifAPISuccess = false;
            });
    }

    /**
    * Load more data with scroll down
    * @param {any} event window scroll event
    * @memberof DashboardComponent
    */
    public onScroll(event: any): void {
        if (this.nextPage) {
            if (!this.isLoadMore) {
                this.isLoadMore = true;
                this.isApiRun = true;
                this.messageService.setHttpLoaderStatus(false);
                if (this.userMode === apiInfo.MODE_LTL) {
                    if (this.clickedTab['id'] > 0) {
                        this.getAllLAPPnewsData('scroll');
                    } else {
                        this.getAllLAPPnewsData(null);
                    }
                } else if (this.userMode === apiInfo.MODE_PULSE) {
                    if (this.clickedTab['id'] > 0) {
                        this.getAllLAPPnewsData('scroll');
                    } else {
                        this.getAllLAPPnewsData(null);
                    }
                }
            }
        }
    }

    /**
    * Open news detail for selected or clicked news
    * @param {any} item selected News object
    * @memberof DashboardComponent
    */
    public opennewsDetail(item: any): void {
        let NewsName = item.News_full_name;
        if (item.News_qualification) {
        NewsName += ', ' + item.News_qualification;
        }
        localStorage.setItem('header_title', NewsName);
        this.router.navigate([`${environment.appPrefix}/News-entity/${btoa(item.News_id)}`]);
    }

    /**
    * check image is exist or not if not than create placehoolder image with News firstname and lastname
    * @param {any} item selected News object
    * @memberof DashboardComponent
    */
    public checkImageExistorNot(item: any): void {
        item['News_image_url'] = '';
        const _name = item.News_full_name;
        if (_name !== null && _name !== undefined) {
            if (item.News_first_name !== null) {
                item['News_short_name'] = `${item.News_first_name.split(' ')[0][0]}`;
            }
            if (item.News_last_name !== null) {
                item['News_short_name'] = item['News_short_name'] + `${item.News_last_name.split(' ')[0][0]}`;
            }
        }
    }

    public imageLoadSuccess(item: any): void {
        item['imageLoad'] = true;
    }

    /**
    * Open the popup for group
    * @param {any} item selected group
    * @param {any} itemDetails selected items
    * @memberof DashboardComponent
    */
    public openGroup(item: any, itemDetails: any): void {
        this.itemDetails = itemDetails;
        this.isGroupShowId = item;
        this.existsMsg = '';
        this.homeService.getGroupsandTeamsByNewsId(item)
            .then(res => {
                if (res['success']) {
                    if (res['data']['teams']) {
                        this.NewsTeams = res['data']['teams'];
                    } else {
                        this.NewsTeams = [];
                    }

                    if (res['data']['groups']) {
                        this.NewsGroups = res['data']['groups'];
                    } else {
                        this.NewsGroups = [];
                    }
                    this.showGroupPopup = true;
                }
            }).catch(err => {
                console.log(err);
                this.utilService.showError('Error', 'Something went wrong.');
            });
    }

    /**
    * show groups and teams of logged in user
    * @memberof DashboardComponent
    */
    public showGroupsandTeams(): void {
        this.homeService.getGroupsandTeams()
            .then(res => {
                this.teamsGroups = [];
                if (res['success']) {
                    // const firstObj = {
                    //     'id': 0,
                    //     'name': 'news',
                    //     'type': 'all'
                    // };
                    let teamCount = 0;
                    let groupCount = 0;
                    res['data'].filter((item: any) => {
                        if (item.type === 'group') {
                            groupCount++;
                        }
                        if (item.type === 'team') {
                            teamCount++;
                        }
                    });
                    if (teamCount > 1 && groupCount > 0) {
                        
                    }
                    for (let i = 0; i < res['data'].length; i++) {
                        if (groupCount > 0 && res['data'][i].type === 'group') {
                            this.teamsGroups.push({
                                'id': res['data'][i].id,
                                'name': res['data'][i].name,
                                'type': res['data'][i].type
                            });
                        }
                        if (teamCount > 1 && res['data'][i].type === 'team') {
                            this.teamsGroups.push({
                                'id': res['data'][i].id,
                                'name': res['data'][i].name,
                                'type': res['data'][i].type
                            });
                        }
                    }
                    // this.teamsGroups.unshift(firstObj);

                    const lastObj = {
                        'id': -1,
                        'name': 'News Analytics',
                        'type': 'analytics'
                    };

                    this.teamsGroups.push(lastObj);
                    if (this.numTeams <= 1) {
                        this.teamsGroups = this.teamsGroups.filter(function (obj) {
                            return obj.type !== 'team';
                        });
                    }
                    if (this.slideNo === 1 && this.teamsGroups.length > 3) {
                        this.slideNo = this.teamsGroups.length - 3;
                    }
                }
            }).catch(err => {
                console.log(err);
            });
    }

    /**
     * Add or remove News from the group.
     * @param {any} item selected group
     * @param {any} event input changed event
     * @memberof DashboardComponent
     */
    public addRemoveNewsFromGroup(item: any, event: any): void {
        const postObj = {};
        postObj['News_id'] = this.isGroupShowId;
        postObj['group_id'] = item.id;
        if (event.target.checked) {
            postObj['action'] = 'add';
        } else {
            postObj['action'] = 'remove';
        }

        this.homeService.addRemoveNewsInGroup(postObj)
            .then(res => {
                if (res['success']) {
                    console.log('res group', res);
                    this.utilService.showSuccess('Success', res['message']);
                } else {
                    this.utilService.showError('Error', res['errors']['name']);
                }
            }).catch(err => {
                console.log(err);
                this.utilService.showError('Error', err['errors']['name']);
            });

    }

    /**
    * Add group function
    * @memberof DashboardComponent
    */
    public addGroup(): void {
        if (this.groupForm.valid) {
            const postObj = {};
            postObj['name'] = this.groupForm.controls.groupName.value;

            this.userService.addGroup(postObj)
                .then(res => {
                    if (res['success']) {
                        console.log('res', res);
                        this.utilService.showSuccess('Success', res['message']);
                        this.openGroup(this.isGroupShowId, this.itemDetails);
                        this.showGroupsandTeams();
                        this.groupForm.reset();
                    } else {
                        if (res['message'] === 'Name exist') {
                            this.existsMsg = 'Name exists';
                        } else {
                            this.utilService.showError('Error', res['message']);
                        }

                    }
                }).catch(err => {
                    this.groupForm.reset();
                    console.log(err);
                });
        }
    }

    /**
    * Get specific News list based on group or team
    * @param {any} item selected type for getting list of News
    * @memberof DashboardComponent
    */
    public getSpecificNewsList(item: any): void {
        this.selectedTab = 'News';
        this.clickedTab = item;
        if (item.id > -1) {
            this.isAnalyticShow = false;
            this.messageService.setHttpLoaderStatus(true);
            this.getAllLAPPnewsData(this.clickedTab);
        } else {
            this.isAnalyticShow = true;
        }
    }

    public resetMsgonKey(): void {
        if (!this.groupForm.valid) {
            this.existsMsg = '';
        }
    }

    /**
    * Changes tab contain based on selected tab
    * @param {any} tab selected tab obejct
    * @memberof DashboardComponent
    */
    public changeEntityTab(tab: any): void {
        this.selectedTab = tab;
        console.log('this.selectedTab', this.selectedTab);
        localStorage.setItem('selectedEntity', tab);
        if (this.selectedTab === 'News') {
            this.messageService.setHttpLoaderStatus(true);
            if (localStorage.getItem('analyticsTabData') !== null && localStorage.getItem('analyticsTabData') !== undefined) {
                const item = JSON.parse(localStorage.getItem('analyticsTabData'));
                this.getSpecificNewsList(item);
                localStorage.removeItem('isFromAnalytics');
                localStorage.removeItem('analyticsTabData');
                this.slideNo = 1;
            } else {
                this.slideNo = 0;
                this.isSpecificClick = false;
                this.isLoad = false;
                this.currentPage = 1;
                this.newsData = [];
                this.clickedTab = {};
                this.isAnalyticShow = false;
                this.getAllLAPPnewsData(null);
                // if (this.teamsGroups.length === 0) {
                //     this.showGroupsandTeams();
                // }
            }
        }
        this.messageService.setSelectedEntityData(this.selectedTab);
    }

    /**
     * refresh the page after premium/nonpremium News by user
     * @param {any} event changed event
     * @memberof DashboardComponent
     */
    public changeDataByUser(event: any): void {
        if (event.index !== undefined) {
            this.newsData.splice(event.index, 1);
        }
    }

    // Google Analytics Events Tracking
    gaNewsClicksTracking() {
        this.gaService.emitEvent(EventsData.newsButtonCategory, EventsData.newsButtonAction, EventsData.newsButtonLabel, 10);
    }
    gaDrugsClicksTracking() {
        this.gaService.emitEvent(EventsData.drugsButtonCategory, EventsData.drugsButtonAction, EventsData.drugsButtonLabel, 10);
    }
    gaNewsAnalysisTracking(item) {
        if (item.id === -1) {
            this.gaService.emitEvent(EventsData.newsAnalyticsButtonCategory, EventsData.newsAnalyticsButtonAction, EventsData.newsAnalyticsButtonLabel, 10);
        }
        else { }
    }
    gaGroupTrack(item, event) {
        debugger
        let userName;
        console.log(this.itemDetails);
        EventsData.newsGroupNewsNameLabel = this.itemDetails.News_full_name;
        userName = this.loggedUserData['full_name'];
        if (event.target.checked === false) { }
        else {
            if (event.target.checked) {
                this.gaService.emitEvent(EventsData.newsGroupCategory, EventsData.newsGroupNameAction + item.name + EventsData.newsGroupAddedByAction + userName, EventsData.newsGroupNewsNameLabel, 10);
            } else {
                this.gaService.emitEvent(EventsData.newsGroupCategory, EventsData.newsGroupNameAction + item.groupName + EventsData.newsGroupCreatedByAction + userName, EventsData.newsGroupCreatedNewGroupLabel, 10);
            }
        }
    }

    /**
     * Check add group text
     * @param {string} text
     * @memberof DashboardComponent
     */
    checkValidValue() {
        console.log(this.groupForm.value.groupName);
        if (this.groupForm.value.groupName !== null) {
            if (this.groupForm.value.groupName.trim() === '') {
                this.groupForm.controls.groupName.setValue('');
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
}
