import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './core/auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { AnonymousGuardService } from './core/auth/anonymous-guard.service';
import { ResetPasswordComponent } from './auth//reset-password/reset-password.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { TermsOfServiceComponent } from './pages/common/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './pages/common/privacy-policy/privacy-policy.component';
import { SignupSuccessfullyComponent } from './auth/signup-successfully/signup-successfully.component';
import { HomeComponent } from './pages/home/home.component';
import { environment } from '../environments/environment';
import { ViewPolicyComponent } from './pages/common/view-policy/view-policy.component';

/**
 * App is using lazy loading techniques to load components
 * @type {{loadChildren: string; path: string}[]}
 */
const routes: Routes = [
    /** default route  */
    {
        path: '',
        canActivate: [AnonymousGuardService],
        component: HomeComponent
    },
    /** Home page route */
    {
        path: 'home',
        canActivate: [AuthGuard],
        loadChildren: './pages/pages.module#PagesModule',
    },
    /** Login page */
    {
        path: 'login',
        canActivate: [AnonymousGuardService],
        component: LoginComponent,
    },
    /** ragister(signup) page */
    {
        path: 'signup',
        canActivate: [AnonymousGuardService],
        component: SignUpComponent,
    },
    /** password reset page(User during forgot password process) */
    {
        path: 'password/reset',
        canActivate: [AnonymousGuardService],
        component: ResetPasswordComponent,
    },
    /** Route used before login(Like forgot password) */
    {
        path: 'auth',
        canActivate: [AnonymousGuardService],
        loadChildren: './auth/core-auth.module#CoreAuthModule',
    },
    /** privacy policy page */
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
    },
    /** terms and service page */
    {
        path: 'terms-of-service',
        component: TermsOfServiceComponent,
    },
    /** Signup success page (Used after do successfully signup) */
    {
        path: 'signup-success',
        component: SignupSuccessfullyComponent
    },
    /** Home page view policy page */
    {
        path: 'view-policy',
        component: ViewPolicyComponent
    },
    { path: '', redirectTo: `${environment.appPrefix}`, pathMatch: 'full' },
    { path: '**', redirectTo: `${environment.appPrefix}` },
];

/**
 * Route module configrations
 */
const config: ExtraOptions = {
    useHash: false,
    onSameUrlNavigation: 'reload'
};

/**
 * This module is used to load sub modules when it is requested.
 */
@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
