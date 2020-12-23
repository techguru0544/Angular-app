import { Component, OnInit, Input } from '@angular/core';
import { newsService } from './../../../core/service/news/news.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from './../../../core/service/message/message.service';
import { UtilService } from './../../../core/service/util.service';

@Component({
    selector: 'app-news-likes-list',
    templateUrl: './news-likes-list.component.html',
    styleUrls: ['./news-likes-list.component.scss']
})
export class newsLikesListComponent implements OnInit {

    @Input() newsData: any;
    likesData: any = [];
    totalLikes = 0;
    nextPage: any;
    isLoad = false;
    likesAllData: any;

    constructor(
        private newsService: newsService,
        private activeModal: NgbActiveModal,
        private messageService: MessageService,
        private utilService: UtilService
    ) { }

    /**
     * This function will call when component is load first time
     * @memberof newsLikesListComponent
     */
    public ngOnInit(): void {
        if (this.likesAllData !== undefined) {
            this.isLoad = true;
            for (const x of Object.keys(this.likesAllData['data']['data'])) {
                this.likesData.push(this.likesAllData['data']['data'][x]);
            }
            this.nextPage = this.likesAllData['data']['next'];
            this.totalLikes = this.likesAllData['data']['total_likes'];
        }
    }

    /**
     * close active modal
     * @memberof newsLikesListComponent
     */
    public closeModal(): void {
        this.activeModal.close();
        this.messageService.setHttpLoaderStatus(true);
    }

    /**
     * Get all Likes data by news Id
     * @memberof newsLikesListComponent
     */
    public getLikesData(): void {
        let data = {};
        if (this.nextPage !== undefined && this.nextPage !== null) {
            data = {
                'next': this.nextPage,
            };
        }
        this.newsService.getLikedForNews(this.newsData['id'], data)
        .then((res: any) => {
            this.isLoad = true;
            if (res['success']) {
                for (const x of Object.keys(res['data']['data'])) {
                    this.likesData.push(res['data']['data'][x]);
                }
                this.nextPage = res['data']['next'];
                this.totalLikes = res['data']['total_likes'];
            }
        }).catch((err: any) => {
            this.isLoad = true;
            console.log(err);
        });
    }

    /**
     * Load more likes data when user scroll down
     * @param {any} event window scroll event object
     * @memberof newsLikesListComponent
     */
    public onScroll(event: any): void {
        if (this.nextPage !== undefined && this.nextPage !== null) {
            this.messageService.setHttpLoaderStatus(false);
            this.getLikesData();
        }
    }

    /**
     * Used for get user imag with his name
     * @param {any} item selected user data
     * @memberof newsLikesListComponent
     */
    public getNameInitials(item: any): string {
        return `${item.first_name.split(' ')[0][0]}${item.last_name.split(' ')[0][0]}`;
    }
}
