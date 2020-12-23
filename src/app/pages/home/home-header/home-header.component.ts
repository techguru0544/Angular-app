import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
    selector: 'app-home-header',
    templateUrl: './home-header.component.html',
    styleUrls: ['./home-header.component.scss']
})
export class HomeHeaderComponent implements OnInit {

    constructor() { }

    /**
     * This function will call when component is load first time
     * @memberof HomeHeaderComponent
     */
    public ngOnInit(): void {
        if ($('.prefix_banner-container').length > 0) {
            $('body').addClass('demo-landing');
        }
    }

}
