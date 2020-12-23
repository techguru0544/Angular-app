import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilService } from './../../../core/service/util.service';
import { Router } from '@angular/router';
import { MessageService } from './../../../core/service/message/message.service';
import { Location } from '@angular/common';
import { UserService } from './../../../core/service/user/user.service';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
    selector: 'app-terms-of-service',
    templateUrl: './terms-of-service.component.html',
    styleUrls: ['./terms-of-service.component.scss']
})
export class TermsOfServiceComponent implements OnInit, OnDestroy {

    previousUrl: string;
    headerTitle = '';
    backTitle = 'Back';
    isHeaderShow = true;
    termsData: any;
    isDataLoad = false;

    constructor(
        private utilService: UtilService,
        private messageService: MessageService,
        private location: Location,
        private router: Router,
        private userService: UserService
    ) {
        if (this.headerTitle === '') {
            this.headerTitle = localStorage.getItem('header_title');
        }
        localStorage.setItem('header_title', 'Terms Of Service');
        this.messageService.setnewsData('Terms Of Service');
    }

    /**
    * This function will call when component is load first time
    * @memberof TermsOfServiceComponent
    */
    public ngOnInit(): void {
        this.getTermsServiceData();
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        if (this.utilService.isLoggedIn()) {
            this.backTitle = 'Back to Home';
            this.isHeaderShow = false;
        } else {
            this.backTitle = 'Back';
            this.isHeaderShow = true;
        }
        this.previousUrl = this.utilService.previousUrl;
    }

    /**
    * This function will call when component is destroy
    * @memberof TermsOfServiceComponent
    */
    public ngOnDestroy(): void {
        this.messageService.setnewsData(this.headerTitle);
        localStorage.setItem('header_title', this.headerTitle);
    }

    /**
    * Get terms and service data from server
    * @memberof TermsOfServiceComponent
    */
    public getTermsServiceData(): void {
        this.userService.getTermsServiceData()
            .then((res: any) => {
                if (res.success) {
                    this.termsData = res.data;
                }
                this.isDataLoad = true;
                const self = this;
                $(document).ready(function () {
                    $('.font-purple').on('click', function (event: any) {
                        self.router.navigate(['/privacy-policy']);
                    });
                });
            }).catch((err: any) => {
                console.log(err);
                this.isDataLoad = true;
            });
    }

    /**
    * Used for go back
    * @memberof TermsOfServiceComponent
    */
    public goBack(): void {
        if (this.utilService.isLoggedIn()) {
            // this.router.navigate(['']);
            localStorage.setItem('selectedEntity', 'News');
            this.messageService.setSelectedEntityData('News');
            this.router.navigate([`${environment.appPrefix}`]);
        } else {
            this.location.back();
        }
    }
}
