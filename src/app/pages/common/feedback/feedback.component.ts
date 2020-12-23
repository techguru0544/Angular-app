import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { UtilService } from './../../../core/service/util.service';
import { Router } from '@angular/router';
import { MessageService } from './../../../core/service/message/message.service';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { UserService } from './../../../core/service/user/user.service';
import {FileUploader, FileLikeObject} from "ng2-file-upload";

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit, OnDestroy {

    previousUrl: string;
    headerTitle = '';
    feedbackForm: FormGroup;
    @ViewChild('feedbackImage') feedbackImageRef: ElementRef;
    formData = new FormData();

    errorMessage: string;
    public uploader:FileUploader = new FileUploader({
        isHTML5: true,
        maxFileSize : 2*1024*1024,
        allowedFileType: ["doc","image","pdf"]
      });

    constructor(
        private utilService: UtilService,
        private messageService: MessageService,
        private location: Location,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private router: Router) {
        if (this.headerTitle === '') {
            this.headerTitle = localStorage.getItem('header_title');
        }

        localStorage.setItem('header_title', 'Feedback');
        this.messageService.setnewsData('Feedback');

        this.feedbackForm = this.formBuilder.group({
            feedback: ['', [Validators.required]],
            image: [''],
        });
    }

    /**
     * This function will call when component is load first time
     * @memberof FeedbackComponent
     */
    public ngOnInit(): void {
      this.uploader.onWhenAddingFileFailed = (item, filter, options) => this.onWhenAddingFileFailed(item, filter, options);
    }

    /**
     * This function will call when component is destroy
     * @memberof FeedbackComponent
     */
    public ngOnDestroy(): void {
        this.messageService.setnewsData(this.headerTitle);
        localStorage.setItem('header_title', this.headerTitle);
        if (this.feedbackForm.value.feedback !== '' && this.feedbackForm.value.feedback !== null) {
            localStorage.setItem('kfeedback_text', this.feedbackForm.value.feedback);
        } else {
            localStorage.removeItem('kfeedback_text');
        }
    }

    /**
     * Called when user click on go back button
     * @memberof FeedbackComponent
     */
    public goBack(): void {
        this.location.back();
    }

    public triggerUpload(): void {
        this.errorMessage = '';
        this.feedbackImageRef.nativeElement.click();
    }

    /**
	 * Upload feedback image
	 * @param {any} event selected image object
     * @memberof FeedbackComponent
	 */
    public uploadFeedbackPic(event: any): void {
        const srcEle = event.srcElement;
        if (srcEle.files && srcEle.files[0]) {
            this.feedbackForm.controls.image.setValue(srcEle.files[0].name);
            this.formData.append('image', srcEle.files[0]);
        }
    }

    /**
     * submit feedback data
     * @memberof FeedbackComponent
     */
    public submitFeedback(): void {
        if (this.feedbackForm.valid) {
            this.formData.append('feedback', this.feedbackForm.value.feedback);

            for (var j = 0; j < this.uploader.queue.length; j++) {
              let fileItem = this.uploader.queue[j]._file;
              this.formData.append('files[]', fileItem);
            }

            this.userService.sendFeedback(this.formData)
            .then(res => {
                if (res['success']) {
                    this.feedbackForm.value.feedback = '';
                    localStorage.removeItem('kfeedback_text');
                    this.utilService.showSuccess('Success', 'Feedback submitted successfully!');
                    this.router.navigate(['']);
                }
            }).catch(err => {
                console.log(err);
                if(this.uploader.queue.length > 0){
                 this.errorMessage = "Upload failed";
                }
            });
        }
    }

    onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any) {
      switch (filter.name) {
          case 'fileSize'://(${item.size} of ${this.maxFileSize}
              this.errorMessage = "File size exceeds 2MB";
          break;
          case 'fileType':
              this.errorMessage = "File type not supported";
          break;
          default:
              this.errorMessage = "Upload failed";
       }
    }

}
