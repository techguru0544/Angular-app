import { Component, OnInit } from '@angular/core';
import { LoginService } from './../../core/service/login/login.service';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { UtilService } from './../../core/service/util.service';
import { MessageService } from './../../core/service/message/message.service';
import { environment } from '../../../environments/environment';
import { PushNotificationsService } from './../../core/service/push-notifications/push-notifications.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    passwordType = 'password';
    errorMsg = '';
    // tslint:disable-next-line:max-line-length
    emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    constructor(
        private loginService: LoginService,
        private utilService: UtilService,
        private formBuilder: FormBuilder,
        private router: Router,
        private messageService: MessageService,
        private _notificationService: PushNotificationsService,
    ) {
        this.createForm();
    }

    /**
     * This function will call when component is load first time
     * @memberof LoginComponent
     */
    public ngOnInit(): void {
        this.messageService.setHttpLoaderStatus(true);
    }

    /**
     * Create login form structure with require validations
     * @memberof LoginComponent
     */
    private createForm(): void {
        this.loginForm = this.formBuilder.group({
            username: [
                '',
                [
                    Validators.required,
                    Validators.email,
                    Validators.pattern(this.emailPattern)
                ]
            ],
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6),
                ]
            ],
        });
    }

    /**
     * Check user enter data and call login API
     * @memberof LoginComponent
     */
    public login(): void {
        if (this.loginForm.valid) {
            this.messageService.setHttpLoaderStatus(true);
            if (!this.utilService.isLoggedIn()) {
              this.loginService.login(this.loginForm.value)
              .then(loginRes => {
                  if (loginRes['success']) {
                      this.utilService.setToken(loginRes['data']['api_token']);
                      this.utilService.setLoggedUserData(JSON.stringify(loginRes['data']['user']));
                      this._notificationService.requestPermission(loginRes['data']['user']['id']);
                      this.router.navigate([`${environment.appPrefix}`]);
                  } else {
                      this.errorMsg = loginRes['message'];
                  }
              }).catch(err => {
                  this.errorMsg = 'Something went wrong. Please try again later';
              });
            } else {
              this.router.navigate([`${environment.appPrefix}`]);
            }
        } else {
            (<any>Object).values(this.loginForm.controls).forEach(control => {
                control.markAsTouched();
            });
            return;
        }
    }

    /**
     * hide/show password data
     * @memberof LoginComponent
     */
    public hideShowPassword(): void {
        if (this.passwordType === 'password') {
            this.passwordType = 'text';
        } else {
            this.passwordType = 'password';
        }
    }
}
