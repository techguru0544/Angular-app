import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signup-successfully',
    templateUrl: './signup-successfully.component.html',
    styleUrls: ['./signup-successfully.component.scss']
})
export class SignupSuccessfullyComponent implements OnInit {

    constructor(private router: Router) { }

    /**
     * This function will call when component is load first time
     * @memberof SignupSuccessfullyComponent
     */
    public ngOnInit(): void {
        setTimeout(() => {
           this.router.navigate(['']);
        }, 4000);
    }
}
