import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'src/app/core/service/message/message.service';

declare var $: any;

@Component({
    selector: 'app-share-modal',
    templateUrl: './share-modal.component.html',
    styleUrls: ['./share-modal.component.scss']
})
export class ShareModalComponent implements OnInit {
    @Input() url: string;
    @Input() title: string;
    @Input() newsItem: any;

    href = '';
    original_referer = encodeURI(location.href);
    mailBody = '';

    constructor(
        private activeModal: NgbActiveModal,
        private messageService: MessageService
        ) { }

    /**
     * This function will call when component is load first time
     * @memberof ShareModalComponent
     */
    public ngOnInit(): void {
        this.mailBody = this.title + ' \n \n ' + this.url;
        this.mailBody = encodeURIComponent(this.mailBody);
        this.href = this.url;
        const self = this;
        $(document).ready(function () {
            $('.share-icon').click(function (e) {
                e.preventDefault();
                if ($(this).attr('href') !== 'javascript:void(0)') {
                    // tslint:disable-next-line:max-line-length
                    window.open($(this).attr('href'), 'fbShareWindow', 'height=400, width=700, top=' + ($(window).height() / 2 - 200) + ', left=' + ($(window).width() / 2 - 225) + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
                }
                setTimeout(() => {
                    self.closeModal('success');
                }, 500);
                return false;
            });
        });
    }

    /**
    * close active modal
    * @memberof ShareModalComponent
    */
    public closeModal(type: string): void {
        this.messageService.setNewsShareStatus(this.newsItem);
        this.activeModal.close(type);
    }

    /**
    * Used for selected news to copy to clipboard
    * @param {any} item selected news item
    * @memberof ShareModalComponent
    */
    public copyToClipboard(item: any): void {
        document.addEventListener('copy', (e: ClipboardEvent) => {
            e.clipboardData.setData('text/plain', (item));
            e.preventDefault();
            document.removeEventListener('copy', null);
        });
        document.execCommand('copy');
    }

    /**
    * close share popup when click on email share icon
    * @memberof ShareModalComponent
    */
    public clickOnEmailShare(): void {
        setTimeout(() => {
            this.closeModal('success');
        }, 1000);
    }
}


