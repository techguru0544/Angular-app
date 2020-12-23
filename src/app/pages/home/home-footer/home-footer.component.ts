import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
declare var $: any;

@Component({
    selector: 'app-home-footer',
    templateUrl: './home-footer.component.html',
    styleUrls: ['./home-footer.component.scss']
})
export class HomeFooterComponent implements OnInit {

    cookieValue = '';
    cookieName = 'cookie-accepted';
    isShow = true;
    currentYear: Number;

    constructor(private cookieService: CookieService) {
        const date = new Date();
        this.currentYear = date.getFullYear();
    }

    /**
     * This function will call when component is load first time
     * @memberof HomeFooterComponent
     */
    public ngOnInit(): void {
        this.cookieValue = this.cookieService.get(this.cookieName);
        if (this.cookieValue !== '') {
            this.isShow = false;
        }

        $(document).ready(function () {
            $('#nav-icon4').click(function () {
                $(this).toggleClass('open');
            });
        });
    }

    /**
     * Called when used accept the cookie
     * @memberof HomeFooterComponent
     */
    public acceptCookie(): void {
        this.cookieService.set( this.cookieName, 'accepted' );
        this.cookieValue = this.cookieService.get(this.cookieName);
        if (this.cookieValue !== '') {
            this.isShow = false;
        }
    }

    /**
     * Used for close show cookie section
     * @memberof HomeFooterComponent
     */
    public close(): void {
        this.isShow = false;
    }

}
