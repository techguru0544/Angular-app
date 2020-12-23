import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MessageService } from './../../../core/service/message/message.service';
import { HomeService } from './../../../core/service/home/home.service';
import { Router } from '@angular/router';
import { UtilService } from './../../../core/service/util.service';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-search-result-list',
    templateUrl: './search-result-list.component.html',
    styleUrls: ['./search-result-list.component.scss']
})
export class SearchResultListComponent implements OnInit, OnDestroy {

    currentPage = 1;
    newsData: any = [];
    searchText: any;
    nextPage = false;
    loggedUserData: any;
    userMode: any;
    isLAPP = false;
    searchReference: any;
    isLoadMore = false;
    isPageLoad: boolean;
    searchCount: Number = 0;
    institutionSearchCount: Number = 0;
    areaSearchCount: Number = 0;
    showInstitution = false;
    institutionType = false;
    showArea = false;
    areaType = false;
    instituteKeyword = '';
    areaKeyword = '';
    frequentInstituteList: any = [];
    frequentAreaList: any = [];
    allInstituteList: any;
    allArearList: any;
    searchInstituteList: any;
    searchAreaList: any;
    selectArea = false;
    allFrequentAreaList: any = [];
    selectInstitute = false;
    allFrequentInstituteList: any = [];
    existAreaSearch: any = [];
    existArearIds: any = [];
    isClearArea = false;
    existInstituteSearch: any = [];
    existInstituteIds: any = [];
    isClearInstitute = false;
    existInstituteList: any = [];
    existAreaList: any = [];
    institutePage = 1;
    areaPage = 1;
    isInstitutePage = false;
    isAreaPage = false;
    instituteLoad = false;
    isSearchApi = false;
    totalSearchResult = 0;
    advancedSearchData = false;
    isInsSearchAPIStart = false;
    isAreaSearchAPIStart = false;

    @HostListener('document:click', ['$event'])
    clickout(event: any) {
        if (event.srcElement.className.indexOf('institute') === -1) {
            if (this.showInstitution) {
                this.showInstitution = false;
            }
        }
        if (event.srcElement.className.indexOf('area') === -1) {
            if (this.showArea) {
                this.showArea = false;
            }
        }

        if (event.srcElement.className.indexOf('search-institute') === -1) {
            if (this.institutionType) {
                this.institutionType = false;
            }
        }

        if (event.srcElement.className.indexOf('search-area') === -1) {
            if (this.areaType) {
                this.areaType = false;
            }
        }
    }

    constructor(
        private messageService: MessageService,
        private homeService: HomeService,
        private router: Router,
        private utilService: UtilService,
        private location: Location,
    ) {
        this.searchText = localStorage.getItem('ksearch_text');
        this.loggedUserData = this.utilService.getLoggedUserData();
        if (this.loggedUserData !== null || this.loggedUserData !== undefined || this.loggedUserData !== '') {
            this.userMode = this.loggedUserData['mode'];
            if (this.userMode === 'pulse' && this.loggedUserData['role'] === 'usr') {
                this.isLAPP = true;
            }
        }
        this.messageService.setShowSearchFlag(false);

        this.searchReference = this.messageService.getShowSearchFlag().subscribe(res => {
            if (this.router.url !== environment.appPrefix) {
                this.searchText = localStorage.getItem('ksearch_text');
                if (this.searchText !== '' && this.searchText !== null && this.searchText !== undefined) {
                        this.newsData = [];
                        this.currentPage = 1;
                        this.isPageLoad = false;
                        this.getSearchnewsList('normal');
                        if (this.existInstituteSearch.length === 0) {
                            this.frequentInstituteList.filter((item: any) => {
                                item['selected'] = false;
                            });
                            this.selectInstitute = false;
                        }

                        if (this.existAreaSearch.length === 0) {
                            this.selectArea = false;
                            this.frequentAreaList.filter((item: any) => {
                                item['selected'] = false;
                            });
                        }
                    }
            } else {
                localStorage.setItem('selectedEntity', 'News');
                this.router.navigate(['/home']);
            }
        });
    }

    ngOnInit() {
        localStorage.removeItem('header_title');
        this.messageService.setnewsData(null);
        this.isPageLoad = false;
        this.messageService.setHttpLoaderStatus(true);
        if (localStorage.getItem('KsearchAreaId') !== null && localStorage.getItem('KsearchAreaId') !== undefined) {
            this.existArearIds = JSON.parse(localStorage.getItem('KsearchAreaId'));
            this.areaSearchCount = this.existArearIds.length;
            this.searchCount = <any>this.areaSearchCount + this.institutionSearchCount;
        }
        if (localStorage.getItem('KsearchAreaData') !== null && localStorage.getItem('KsearchAreaData') !== undefined) {
            this.existAreaSearch = JSON.parse(localStorage.getItem('KsearchAreaData'));
            if (this.existAreaSearch.length > 0) {
                this.selectArea = true;
            }
        }
        if (localStorage.getItem('KsearchInstituteId') !== null && localStorage.getItem('KsearchInstituteId') !== undefined) {
            this.existInstituteIds = JSON.parse(localStorage.getItem('KsearchInstituteId'));
            this.institutionSearchCount = this.existInstituteIds.length;
            this.searchCount = <any>this.areaSearchCount + this.institutionSearchCount;
        }
        if (localStorage.getItem('KsearchInstituteData') !== null && localStorage.getItem('KsearchInstituteData') !== undefined) {
            this.existInstituteSearch = JSON.parse(localStorage.getItem('KsearchInstituteData'));
            if (this.existInstituteSearch.length > 0) {
                this.selectInstitute = true;
            }
        }
        if (this.searchText !== null && this.searchText !== '') {
            this.currentPage = 1;
            this.messageService.setHttpLoaderStatus(true);
            this.getSearchnewsList('normal');
        } else {
            this.router.navigate(['']);
        }

        this.getAllFrequentInstituteList();
        this.getAllFrequentAreaList();
        this.getAllInstituteListWithPagination();
        this.getAllAreaListWithPagination();
        // this.getAllInstituteList();
        // this.getAllAreaList();
    }

    ngOnDestroy() {
        this.messageService.setHttpLoaderStatus(true);
        if (!!this.searchReference) {
            this.searchReference.unsubscribe();
        }
    }

    /**
    * Get all News list based on search keyword
    */
    getSearchnewsList(type: any) {
        this.isSearchApi = false;
        const postObj = {
            'page': this.currentPage,
        };

        if (this.currentPage === 1) {
            this.isPageLoad = false;
            this.messageService.setHttpLoaderStatus(true);
        }

        if (this.searchText !== '') {
            postObj['query'] = this.searchText;
        }
        if (this.existArearIds.length > 0) {
            postObj['area_id'] = this.existArearIds.toString();
        }
        if (this.existInstituteIds.length > 0) {
            postObj['institution_id'] = this.existInstituteIds.toString();
        }
        // this.homeService.getAllLAPPnews(postObj)
        this.homeService.getSearchnewsData(postObj)
            .then(res => {
                if (res['success']) {
                    this.totalSearchResult = res['data']['total'];
                    this.nextPage = res['data']['next_page'];
                    if (this.nextPage) {
                        this.currentPage += 1;
                    }
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
                    this.isPageLoad = true;
                    this.isSearchApi = true;
                }
                this.isLoadMore = false;
            }).catch(err => {
                console.log(err);
                this.isLoadMore = false;
                this.isPageLoad = true;
                this.isSearchApi = true;
            });
    }

    /**
    * Open news detail for selected or clicked news
    * @param item
    */
    opennewsDetail(item: any) {
        this.saveRecentSearchData(item.News_id);
        this.router.navigate([`${environment.appPrefix}/News-entity/${btoa(item.News_id)}`]);
    }

    /**
    * save recent search data on server
    */
    saveRecentSearchData(text: any) {
        this.messageService.setHttpLoaderStatus(false);
        const postObj = {};

        if (text > 0) {
            postObj['News_id'] = text;
        } else {
            postObj['text'] = text;
        }

        this.homeService.saveRecentSearchData(postObj)
            .then((res: any) => {
                this.messageService.setHttpLoaderStatus(true);
                if (res['success']) {

                }
            }).catch((err: any) => {
                this.messageService.setHttpLoaderStatus(true);
            });
    }

    /**
    * Load more search news data when scroll down
    * @param event
    */
    onScroll(event: any) {
        console.log(event);
        if (this.nextPage && !this.isLoadMore) {
            this.messageService.setHttpLoaderStatus(false);
            this.isLoadMore = true;
            if (this.searchText !== null && this.searchText !== '') {
                this.getSearchnewsList('normal');
            } else {
                this.getSearchnewsList('advanced');
            }
        }
    }

    goBack() {
        this.location.back();
    }

    checkImageExistorNot(item: any) {
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

    /**
    * Show/Hide institution list dropdown
    */
    showInstitutionList() {
        if (this.showInstitution) {
            this.showInstitution = false;
        } else {
            this.showInstitution = true;
            this.manageInstituteSearchData();
        }
        this.showArea = false;
        this.instituteKeyword = '';
        this.institutionType = false;
    }

    manageInstituteSearchData() {
        if (this.existInstituteSearch.length > 0) {
            this.frequentInstituteList = this.existInstituteSearch.slice(0);
        }
        const res = this.allFrequentInstituteList.filter(n => !this.frequentInstituteList.some(n2 => n.id === n2.id));
        res.filter((item: any) => {
            if (this.frequentInstituteList.length <= 5) {
                item['selected'] = false;
                this.frequentInstituteList.push(item);
            }
        });
        if (this.existInstituteSearch.length > 0) {
            if (this.isClearInstitute) {
                this.frequentInstituteList.filter((item: any) => {
                    item['selected'] = false;
                });
                if (localStorage.getItem('KsearchInstituteData') !== null && localStorage.getItem('KsearchInstituteData') !== undefined) {
                    this.existInstituteSearch = JSON.parse(localStorage.getItem('KsearchInstituteData'));
                }
            } else {
                this.selectInstitute = true;
            }
        }
    }

    /**
    * Hide/Show area list dropdown
    */
    showAreaList() {
        if (this.showArea) {
            this.showArea = false;
        } else {
            this.showArea = true;
            this.manageAreaSearchData();
        }
        this.showInstitution = false;
        this.areaKeyword = '';
        this.areaType = false;
    }

    manageAreaSearchData() {
        if (this.existAreaSearch.length > 0) {
            this.frequentAreaList = this.existAreaSearch.slice(0);
        }
        const res = this.allFrequentAreaList.filter(n => !this.frequentAreaList.some(n2 => n.id === n2.id));
        res.filter((item: any) => {
            if (this.frequentAreaList.length <= 5) {
                item['selected'] = false;
                this.frequentAreaList.push(item);
            }
        });
        if (this.existAreaSearch.length > 0) {
            if (this.isClearArea) {
                this.frequentAreaList.filter((item: any) => {
                    item['selected'] = false;
                });
                if (localStorage.getItem('KsearchAreaData') !== null && localStorage.getItem('KsearchAreaData') !== undefined) {
                    this.existAreaSearch = JSON.parse(localStorage.getItem('KsearchAreaData'));
                }
            } else {
                this.selectArea = true;
            }
        }
    }

    /**
    * open intitute suto suggestions list and show match institute based on user type
    */
    searchInstitutionFromList(event: any) {
        if (this.instituteKeyword.length >= 3) {
            const searchData = [];
            this.utilService.cancelPendingRequests();
            this.isInsSearchAPIStart = true;
            this.getAllInstituteList(this.instituteKeyword);
            this.institutionType = true;
        } else {
            this.searchInstituteList = [];
            this.institutionType = false;
        }
    }

    /**
    * open area suto suggestions list and show match area based on user type
    */
    searchAreaFromList(event: any) {
        if (this.areaKeyword.length >= 3) {
            const searchData = [];
            this.utilService.cancelPendingRequests();
            this.isAreaSearchAPIStart = true;
            this.getAllAreaList(this.areaKeyword);
            this.areaType = true;
        } else {
            this.searchAreaList = [];
            this.areaType = false;
        }
    }

    /**
    * Get lit of institution that frequent search  by user
    */
    getAllFrequentInstituteList() {
        this.homeService.getAllFrequentInstituteList()
            .then((res: any) => {
                this.allFrequentInstituteList = res['data'];
                this.manageInstituteSearchData();
            }).catch((err: any) => {
                console.log(err);
            });
    }

    /**
    * Get lit of area that frequent search  by user
    */
    getAllFrequentAreaList() {
        this.homeService.getAllFrequentAreaList()
            .then((res: any) => {
                this.allFrequentAreaList = res['data'];
                this.manageAreaSearchData();
            }).catch((err: any) => {
                console.log(err);
            });
    }

    /**
    * Get all existing institution list without paginations
    */
    getAllInstituteList(searchKeyword: string) {
        this.messageService.setHttpLoaderStatus(false);
        this.allInstituteList = [];
        const getObj = {
            query: searchKeyword
        };
        this.homeService.getAllExistingInstituteList(getObj)
            .then((res: any) => {
                console.log(res);
                this.allInstituteList = res.data;
                this.searchInstituteList = res.data;
                this.isInsSearchAPIStart = false;
            }).catch((err: any) => {
                console.log(err);
                if (this.newsData.length === 0) {
                    this.isPageLoad = true;
                }
            });
    }

    /**
    * Get all existing institution list without paginations
    */
    getAllAreaList(searchKeyword: string) {
        this.messageService.setHttpLoaderStatus(false);
        this.allArearList = [];
        const getObj = {
            query: searchKeyword
        };
        this.homeService.getAllExistingAreaList(getObj)
            .then((res: any) => {
                this.allArearList = res.data;
                this.searchAreaList = res.data;
                this.isAreaSearchAPIStart = false;
            }).catch((err: any) => {
                console.log(err);
            });
    }

    selectAreaForSearch(item: any) {
        item.selected = true;
        let array = false;
        this.frequentAreaList.filter(list => {
            if (list['id'] === item['id']) {
                list['selected'] = true;
                array = true;
            }
        });
        if (!array) {
            this.frequentAreaList.push(item);
        }
        let array1 = false;
        this.existAreaList.filter((list: any) => {
            if (list['id'] === item['id']) {
                list['selected'] = true;
                array1 = true;
            }
        });
        if (!array1) {
            this.existAreaList.unshift(item);
        }
        this.areaType = false;
        this.areaKeyword = '';
        this.selectArea = true;
    }

    selectAreaSearch(item: any) {
        this.selectArea = true;
        if (item['selected']) {
            item['selected'] = false;
        } else {
            item['selected'] = true;
        }
        let isSelect = false;

// tslint:disable-next-line: no-shadowed-variable
        this.frequentAreaList.filter((item: any) => {
            if (item['selected']) {
                isSelect = true;
            }
        });

        if (!isSelect) {
            this.selectArea = false;
        }
    }

    clearAreaASearchData() {
        this.frequentAreaList.filter(item => {
            item['selected'] = false;
        });
        this.existAreaList.filter((item: any) => {
            item['selected'] = false;
        });
        this.selectArea = false;
        if (localStorage.getItem('KsearchAreaData') !== null && localStorage.getItem('KsearchAreaData') !== undefined) {
            this.existAreaSearch = JSON.parse(localStorage.getItem('KsearchAreaData'));
        }
        this.isClearArea = true;
    }

    cancelAreaASearchData() {
        this.showArea = false;
        this.isClearArea = false;
        this.frequentAreaList = this.allFrequentAreaList.slice(0);
    }

    selectInstituteForSearch(item: any) {
        item.selected = true;
        let array = false;
        this.frequentInstituteList.filter((list: any) => {
            if (list['id'] === item['id']) {
                list['selected'] = true;
                array = true;
            }
        });
        if (!array) {
            this.frequentInstituteList.push(item);
        }
        let array1 = false;
        this.existInstituteList.filter((list: any) => {
            if (list['id'] === item['id']) {
                list['selected'] = true;
                array1 = true;
            }
        });
        if (!array1) {
            this.existInstituteList.unshift(item);
        }
        this.institutionType = false;
        this.instituteKeyword = '';
        this.selectInstitute = true;
    }

    selectInstituteSearch(item: any) {
        this.selectInstitute = true;
        if (item['selected']) {
            item['selected'] = false;
        } else {
            item['selected'] = true;
        }
        let isSelect = false;

// tslint:disable-next-line: no-shadowed-variable
        this.frequentInstituteList.filter((item: any) => {
            if (item['selected']) {
                isSelect = true;
            }
        });

        if (!isSelect) {
            this.selectInstitute = false;
        }
    }

    clearInstituteASearchData() {
        this.frequentInstituteList.filter((item: any) => {
            item['selected'] = false;
        });
        this.existInstituteList.filter((item: any) => {
            item['selected'] = false;
        });
        this.selectInstitute = false;
        if (localStorage.getItem('KsearchInstituteData') !== null && localStorage.getItem('KsearchInstituteData') !== undefined) {
            this.existInstituteSearch = JSON.parse(localStorage.getItem('KsearchInstituteData'));
        }
        this.isClearInstitute = true;
    }

    cancelInstituteASearchData() {
        this.showInstitution = false;
        this.isClearInstitute = false;
        this.frequentInstituteList = this.allFrequentInstituteList.slice(0);
    }

    /**
    * Apply area data on search result
    */
    applyAearSearchOnData() {
        this.areaSearchCount = 0;
        this.searchCount = 0;
        this.isClearArea = false;
        if (this.institutionSearchCount !== 0) {
            this.searchCount = this.institutionSearchCount;
        }
        this.existAreaSearch = [];
        this.existArearIds = [];
        this.frequentAreaList.filter((item: any) => {
            if (item['selected']) {
                this.existAreaSearch.push(item);
                this.existArearIds.push(item.id);
                this.areaSearchCount = <any>this.areaSearchCount + 1;
            }
        });
        if (this.areaSearchCount > 0) {
            this.searchCount = <any>this.searchCount + this.areaSearchCount;
        }
        this.showArea = false;
        if (this.existArearIds.length === 0) {
            this.frequentAreaList = [];
        } else {
            if (this.allFrequentAreaList.length === 0) {
                this.allFrequentAreaList = this.existAreaSearch.slice(0);
            }
        }
        localStorage.setItem('KsearchAreaId', JSON.stringify(this.existArearIds));
        localStorage.setItem('KsearchAreaData', JSON.stringify(this.existAreaSearch));
        this.newsData = [];
        this.currentPage = 1;
        this.getSearchnewsList('normal');
    }

    /**
    * Apply institute data on search result
    */
    applyInstitueSearchOnData() {
        this.institutionSearchCount = 0;
        this.searchCount = 0;
        this.isClearInstitute = false;
        if (this.areaSearchCount !== 0) {
            this.searchCount = this.areaSearchCount;
        }
        this.existInstituteSearch = [];
        this.existInstituteIds = [];
        this.frequentInstituteList.filter(item => {
            if (item['selected']) {
                this.existInstituteSearch.push(item);
                this.existInstituteIds.push(item.id);
                this.institutionSearchCount = <any>this.institutionSearchCount + 1;
            }
        });
        if (this.institutionSearchCount > 0) {
            this.searchCount = <any>this.searchCount + this.institutionSearchCount;
        }
        if (this.existInstituteIds.length === 0) {
            this.frequentInstituteList = [];
        } else {
            if (this.allFrequentInstituteList.length === 0) {
                this.allFrequentInstituteList = this.existInstituteSearch.slice(0);
            }
        }
        this.showInstitution = false;
        localStorage.setItem('KsearchInstituteId', JSON.stringify(this.existInstituteIds));
        localStorage.setItem('KsearchInstituteData', JSON.stringify(this.existInstituteSearch));
        this.newsData = [];
        this.currentPage = 1;
        this.getSearchnewsList('normal');
    }

    imageLoadSuccess(item: any) {
        item['imageLoad'] = true;
    }

    openPageUrl(pageUrl: any) {
        return `${environment.appPrefix}/News-request`;        
    }
}
