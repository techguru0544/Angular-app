import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilService } from './../../../core/service/util.service';
import { Router } from '@angular/router';
import { MessageService } from './../../../core/service/message/message.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { newsService } from './../../../core/service/news/news.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-counter-request',
    templateUrl: './counter-request.component.html',
    styleUrls: ['./counter-request.component.scss']
})
export class CounterRequestComponent implements OnInit, OnDestroy {

    previousUrl: string;
    headerTitle = '';
    counterRequestForm: FormGroup;
    // tslint:disable-next-line:max-line-length
    emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    constructor(
        private utilService: UtilService,
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private newsService: newsService,
        private router: Router) {
        if (this.headerTitle === '') {
            this.headerTitle = localStorage.getItem('header_title');
        }
        localStorage.setItem('header_title', 'Contact Sales Team');
        this.messageService.setnewsData('Contact Sales Team');
        this.createForm();
    }

    /** 
     * This function will call when component is load first time
     * @memberof CounterRequestComponent
     */
    public ngOnInit(): void {
        this.previousUrl = this.utilService.previousUrl;
    }

    /**
     * This function will call when component is destory
     * @memberof CounterRequestComponent
     */
    public ngOnDestroy(): void {
        this.messageService.setnewsData(this.headerTitle);
        localStorage.setItem('header_title', this.headerTitle);
    }

    /**
     * Create News request form structure
     * @memberof CounterRequestComponent
     */
    private createForm(): void {
        this.counterRequestForm = this.formBuilder.group({
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
            phone_no: ['', [Validators.required, Validators.maxLength(10)]]
        });
    }

    /**
     * on submit counter request form
     * @memberof CounterRequestComponent
     */
    public onSubmit(): void {
        if (this.counterRequestForm.valid) {
            this.newsService.submitCounterRequest(this.counterRequestForm.value)
            .then(res => {
                if (res['success']) {
                    localStorage.setItem('KisRequestExist', 'true');
                    this.router.navigate([`${environment.appPrefix}/request-success`]);
                } else {
                    this.utilService.showError('Error', res['message']);
                }
            }).catch(err => {
                this.utilService.showError('Error', err.message);
            });
        } else {
            (<any>Object).values(this.counterRequestForm.controls).forEach(control => {
                control.markAsTouched();
            });
            return;
        }
    }

    /**
     * Accept only number in phone number field
     * @param {any} event
     * @memberof CounterRequestComponent
     */
    public numberOnly(event: any): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
        return true;
    }
}
