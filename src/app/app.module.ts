import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DoBootstrap, ApplicationRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/** Import required component */
import { AppComponent } from './app.component';
import { FooterComponent } from './auth/footer/footer.component';

/** Import HTTP models (used for calling API in server) */
import { HttpClientModule } from '@angular/common/http';
import { NgHttpLoaderModule } from 'ng-http-loader';

/** Import Routing model */
import { AppRoutingModule } from './app-routing.module';

/** Import guard services */
import { AuthGuard } from './core/auth/auth.guard';
import { AnonymousGuardService } from './core/auth/anonymous-guard.service';

/** Import all required models */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreAuthModule} from './auth/core-auth.module';
import { PagesModule } from './pages/pages.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/** Import all pipe */
import { DatePipe } from '@angular/common';

@NgModule({
    declarations: [
        AppComponent,
        FooterComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        CoreAuthModule,
        PagesModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        BrowserAnimationsModule,
        NgHttpLoaderModule,
    ],
    entryComponents: [AppComponent],
    providers: [
        AuthGuard,
        AnonymousGuardService,
        DatePipe
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule implements DoBootstrap {
    ngDoBootstrap(appRef: ApplicationRef) {
        appRef.bootstrap(AppComponent);
    }
}
