import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilService } from './../../../core/service/util.service';
import { Router } from '@angular/router';
import { MessageService } from './../../../core/service/message/message.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {

    previousUrl: string;
    headerTitle = '';
    backTitle = 'Back';
    isHeaderShow = true;

    constructor(
        private utilService: UtilService,
        private messageService: MessageService,
        private location: Location,
        private router: Router) {
        if (this.headerTitle === '') {
            this.headerTitle = localStorage.getItem('header_title');
        }
        localStorage.setItem('header_title', 'Privacy Policy');
        this.messageService.setnewsData('Privacy Policy');
    }

    /**
     * This function will call when component is load first time
     * @memberof PrivacyPolicyComponent
     */
    public ngOnInit(): void {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        if (this.utilService.isLoggedIn()) {
            this.backTitle = 'Back to Home';
            this.isHeaderShow = false;
        } else {
            this.backTitle = 'Back';
            this.isHeaderShow = true;
        }
        this.previousUrl = this.utilService.previousUrl;
        console.log(this.headerTitle);
    }

    /**
     * This function will call when component is destroy
     * @memberof PrivacyPolicyComponent
     */
    public ngOnDestroy(): void {
        this.messageService.setnewsData(this.headerTitle);
        localStorage.setItem('header_title', this.headerTitle);
    }

    /**
     * Used for go back
     * @memberof PrivacyPolicyComponent
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
