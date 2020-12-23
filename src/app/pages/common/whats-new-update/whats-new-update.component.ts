import { Component, OnInit } from '@angular/core';
import { UserService } from './../../../core/service/user/user.service';
import { MessageService } from './../../../core/service/message/message.service';

@Component({
  selector: 'app-whats-new-update',
  templateUrl: './whats-new-update.component.html',
  styleUrls: ['./whats-new-update.component.scss']
})
export class WhatsNewUpdateComponent implements OnInit {

  currentPage = 1;
  nextPage = false;
  allUpdateList: any = [];
  isAPIRun = false;

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) { }

  /**
   * This function will call when component is load first time
   * @memberof WhatsNewUpdateComponent
   */
  public ngOnInit(): void {
    this.getListOfWhatsNewUpdate();
  }

  /**
   * Get all the list of what's new update
   * @memberof WhatsNewUpdateComponent
   */
  public getListOfWhatsNewUpdate(): void {
    const getObj = {
      page: this.currentPage
    };
    this.userService.getListOfNewUpdate(getObj)
    .then((res: any) => {
      console.log(res);
      if (res.success) {
        this.nextPage = res.data.next_page;
      }

      if (this.nextPage) {
        this.currentPage++;
      }
      res.data.data.filter((item: any) => {
        this.allUpdateList.push(item);
      });
      this.isAPIRun = false;
      if (this.currentPage) {
        this.updateReadStatus();
      }
    }).catch((err: any) => {
      console.log(err);
      this.isAPIRun = false;
    });
  }

  /**
   * Update notification read status
   * @memberof WhatsNewUpdateComponent
   */
  public updateReadStatus(): void {
    this.messageService.setHttpLoaderStatus(false);
    this.userService.updateReadStatusForNewUpdate()
    .then((res: any) => {
      console.log(res);
    }).catch((err: any) => {
      console.log(err);
    });
  }

  /**
   * Called when user scroll
   * @param {any} event window scroll event
   * @memberof WhatsNewUpdateComponent
   */
  public onScroll(event: any): void {
    if (this.nextPage) {
      if (!this.isAPIRun) {
        this.messageService.setHttpLoaderStatus(false);
        this.getListOfWhatsNewUpdate();
      }
    }
  }

  /**
   * Show more/less data
   * @param {number} index
   * @memberof WhatsNewUpdateComponent
   */
  public showMoreLessData(index: number): void {
    const tag = document.getElementById(`news_item_${index}`);
    const btnText = document.getElementById(`myBtn_${index}`);
    if (tag.style.maxHeight === 'none') {
        btnText.innerHTML = 'Read more';
        tag.style.maxHeight = '7.6em';
    } else {
      btnText.innerHTML = 'Read less';
      tag.style.maxHeight = 'none';
    }
}


}
