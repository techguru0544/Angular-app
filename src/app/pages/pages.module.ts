import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/** Import all required module */
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { PagesRoutingModule } from './pages-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ToasterModule } from 'angular2-toaster';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FlexLayoutModule } from '@angular/flex-layout';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { FileUploadModule } from 'ng2-file-upload';

/** Import all components */
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { NewsEntityComponent } from './News/News-entity/News-entity.component';
import { newsLikesListComponent } from './common/news-likes-list/news-likes-list.component';
import { WriteNotesComponent } from './common/write-notes/write-notes.component';
import { NotesListComponent } from './common/notes-list/notes-list.component';
import { SaveNoteModalComponent } from './News/save-note-modal/save-note-modal.component';
import { NotificationComponent } from './common/notification/notification.component';
import { CounterRequestComponent } from './News/counter-request/counter-request.component';
import { RequestSuccessComponent } from './News/request-success/request-success.component';
import { ShareModalComponent } from './common/share-modal/share-modal.component';
import { newsStarViewComponent } from './News/news-star-view/news-star-view.component';
import { newsSearchListComponent } from './News/news-search-list/news-search-list.component';
import { NewsRequestComponent } from './News/News-request/News-request.component';
import { NewsRequestSubmissionComponent } from './News/News-request-submission/News-request-submission.component';
import { TermsOfServiceComponent } from './common/terms-of-service/terms-of-service.component';
import { SearchResultListComponent } from './News/search-result-list/search-result-list.component';
import { PrivacyPolicyComponent } from './common/privacy-policy/privacy-policy.component';
import { CookiePolicyComponent } from './common/cookie-policy/cookie-policy.component';
import { FeedbackComponent } from './common/feedback/feedback.component';
import { SignOutModalComponent } from './common/sign-out-modal/sign-out-modal.component';
import { NewsTrialRelatedNewsComponent } from './News/News-trial-related-news/News-trial-related-news.component';
import { BookmarknewsComponent } from './News/bookmark-news/bookmark-news.component';
import { HomeComponent } from './home/home.component';
import { HomeHeaderComponent } from './home/home-header/home-header.component';
import { HomeFooterComponent } from './home/home-footer/home-footer.component';
import { ViewPolicyComponent } from './common/view-policy/view-policy.component';
import { MySubscriptionsListComponent } from './common/my-subscriptions-list/my-subscriptions-list.component';
import { MessageModelComponent } from './common/message-model/message-model.component';
import { MySubscriptionsDetailComponent } from './News/my-subscriptions-detail/my-subscriptions-detail.component';
import { PremiumNewsPopupComponent } from './News/premium-News-popup/premium-News-popup.component';
import { PremiumCounterPopupComponent } from './News/premium-counter-popup/premium-counter-popup.component';
import { NewsEntityImageComponent } from './common/News-entity-image/News-entity-image.component';
import { TeamNameExistPopupComponent } from './News/team-name-exist-popup/team-name-exist-popup.component';
import { GroupDeletePopupComponent } from './News/group-delete-popup/group-delete-popup.component';
import { GroupExistModalComponent } from './News/group-exist-modal/group-exist-modal.component';
import { DrugLandingPageComponent } from './drug/drug-landing-page/drug-landing-page.component';
import { DrugEntityPageComponent } from './drug/drug-entity-page/drug-entity-page.component';
import { BiomarkerEntityPageComponent } from './biomarker/biomarker-entity-page/biomarker-entity-page.component';
import { DrugTrialRelatedNewsComponent } from './drug/drug-trial-related-news/drug-trial-related-news.component';
import { DrugStarViewComponent } from './drug/drug-star-view/drug-star-view.component';
import { NewsSocialFeaturesComponent } from './common/news-social-features/news-social-features.component';
import { NotesUpdatePopupComponent } from './notes-update-popup/notes-update-popup.component';
import { NotesDeletePopupComponent } from './notes-delete-popup/notes-delete-popup.component';
import { DrugNotesComponent } from './drug/drug-notes/drug-notes.component';
import { DrugSearchListComponent } from './drug/drug-search-list/drug-search-list.component';
import { DrugSearchResultListComponent } from './drug/drug-search-result-list/drug-search-result-list.component';
import { DrugRequestComponent } from './drug/drug-request/drug-request.component';
import { DrugRequestSubmissionComponent } from './drug/drug-request-submission/drug-request-submission.component';
import { DrugSubscriptionDetailComponent } from './drug/drug-subscription-detail/drug-subscription-detail.component';
import { ConferenceDetailComponent } from './News/conference-detail/conference-detail.component';
import { NewsAnalyticsComponent } from './News/News-analytics/News-analytics.component';
import { DrugAttributeComponent } from './drug/drug-attribute/drug-attribute.component';
import { ConferenceLandingPageComponent } from './conferences/conference-landing-page/conference-landing-page.component';
import { ConferenceEntityPageComponent } from './conferences/conference-entity-page/conference-entity-page.component';
import { ConferenceSearchListComponent } from './conferences/conference-search-list/conference-search-list.component';
import { ConferenceSearchResultListComponent } from './conferences/conference-search-result-list/conference-search-result-list.component';
import { ConferenceRequestComponent } from './conferences/conference-request/conference-request.component';
import { ConferenceRequestSubmissionComponent } from './conferences/conference-request-submission/conference-request-submission.component';
import { NewsPaymentTabComponent } from './News/News-payment-tab/News-payment-tab.component';
import { SubHeaderComponent } from './common/sub-header/sub-header.component';
import { WhatsNewUpdateComponent } from './common/whats-new-update/whats-new-update.component';
import { ContentLandingLageComponent } from './content/content-landing-lage/content-landing-lage.component';
import { ContentFiltersComponent } from './content/content-filters/content-filters.component';
import { ContentNewsTagsComponent } from './content/content-news-tags/content-news-tags.component';
import { ContentNewsSocialFeatureComponent } from './content/content-news-social-feature/content-news-social-feature.component';
import { ConferenceAddNoteComponent } from './conferences/conference-add-note/conference-add-note.component';
import { ConferenceAbstractAdvancedSearchComponent } from './conferences/conference-abstract-advanced-search/conference-abstract-advanced-search.component';

/** Import Pipes */
import { TimeAgoPipe } from './../core/pipes/time-ago.pipe';
import { TrimstrPipe } from './../core/pipes/trimstr/trimstr.pipe';
import { ReversePipe } from './../core/pipes/reverse/reverse.pipe';
import { SafeHtmlPipe } from './../core/pipes/safeHtml/safe-html.pipe';
import { DateFormatPipe } from './../core/pipes/dateFormat/date-format.pipe';
import { CustomDateFormatPipe } from './../core/pipes/customDateFormat/custom-date-format.pipe';
import { OrderByPipe } from './../core/pipes/orderBy/order-by.pipe';

/** Import Directive */
import { AutoFocusDirective } from './../core/directive/autoFocus/auto-focus.directive';

const PAGES_COMPONENTS = [
    PagesComponent,
    DashboardComponent,
    HeaderComponent,
    NewsEntityComponent,
    newsLikesListComponent,
    SaveNoteModalComponent,
    ShareModalComponent,
    NotificationComponent,
    CounterRequestComponent,
    newsStarViewComponent,
    newsSearchListComponent,
    RequestSuccessComponent,
    NewsRequestComponent,
    NewsRequestSubmissionComponent,
    TermsOfServiceComponent,
    SearchResultListComponent,
    WriteNotesComponent,
    NotesListComponent,
    PrivacyPolicyComponent,
    CookiePolicyComponent,
    FeedbackComponent,
    SignOutModalComponent,
    NewsTrialRelatedNewsComponent,
    BookmarknewsComponent,
    HomeComponent,
    HomeHeaderComponent,
    HomeFooterComponent,
    ViewPolicyComponent,
    MessageModelComponent,
    ViewPolicyComponent,
    MySubscriptionsListComponent,
    NewsEntityImageComponent,
    MySubscriptionsDetailComponent,
    PremiumNewsPopupComponent,
    PremiumCounterPopupComponent,
    GroupDeletePopupComponent,
    GroupExistModalComponent,
    DrugLandingPageComponent,
    DrugEntityPageComponent,
    BiomarkerEntityPageComponent,
    DrugTrialRelatedNewsComponent,
    TeamNameExistPopupComponent,
    DrugStarViewComponent,
    NewsSocialFeaturesComponent,
    NotesUpdatePopupComponent,
    NotesDeletePopupComponent,
    DrugNotesComponent,
    DrugSearchListComponent,
    DrugSearchResultListComponent,
    DrugRequestComponent,
    DrugRequestSubmissionComponent,
    DrugSubscriptionDetailComponent,
    ConferenceDetailComponent,
    NewsAnalyticsComponent,
    DrugAttributeComponent,
    ConferenceLandingPageComponent,
    ConferenceEntityPageComponent,
    ConferenceSearchListComponent,
    ConferenceSearchResultListComponent,
    ConferenceRequestComponent,
    ConferenceRequestSubmissionComponent,
    SubHeaderComponent,
    NewsPaymentTabComponent,
    WhatsNewUpdateComponent,
    ContentLandingLageComponent,
    ContentFiltersComponent,
    ContentNewsTagsComponent,
    ContentNewsSocialFeatureComponent,
    ConferenceAbstractAdvancedSearchComponent,
    ConferenceAddNoteComponent
];

const PIPES = [
    TimeAgoPipe,
    TrimstrPipe,
    ReversePipe,
    SafeHtmlPipe,
    DateFormatPipe,
    CustomDateFormatPipe,
    OrderByPipe
];

const DIRECTIVES = [
    AutoFocusDirective
];

/** Pages module */
@NgModule({
    imports: [
        CommonModule,
        PagesRoutingModule,
        ScrollingModule,
        MatTabsModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        InfiniteScrollModule,
        ToasterModule,
        SlickCarouselModule,
        FlexLayoutModule,
        VirtualScrollerModule,
        MatDatepickerModule,
        NgxEchartsModule,
        MatNativeDateModule,
        FileUploadModule,
        MatSelectModule
    ],
    declarations: [
        ...PAGES_COMPONENTS,
        ...PIPES,
        ...DIRECTIVES,
    ],
    entryComponents: [
        HeaderComponent,
        newsLikesListComponent,
        SaveNoteModalComponent,
        newsSearchListComponent,
        ShareModalComponent,
        SignOutModalComponent,
        HomeHeaderComponent,
        HomeFooterComponent,
        MessageModelComponent,
        PremiumNewsPopupComponent,
        PremiumCounterPopupComponent,
        NewsEntityImageComponent,
        GroupDeletePopupComponent,
        GroupExistModalComponent,
        TeamNameExistPopupComponent,
        NotesUpdatePopupComponent,
        NotesDeletePopupComponent,
        DrugLandingPageComponent,
        TeamNameExistPopupComponent,
        DrugStarViewComponent,
        NewsPaymentTabComponent,
        ConferenceAbstractAdvancedSearchComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { }
