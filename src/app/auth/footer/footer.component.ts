import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

    currentYear: Number;

    constructor() { }

    /**
     * This function will call when component is load first time
     * @memberof FooterComponent
     */
    public ngOnInit(): void {
        const date = new Date();
        this.currentYear = date.getFullYear();
    }

}
