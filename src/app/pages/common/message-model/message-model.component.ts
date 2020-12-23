import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
     selector: 'app-message-model',
     templateUrl: './message-model.component.html',
     styleUrls: ['./message-model.component.scss']
})
export class MessageModelComponent implements OnInit {

     @Input() message: any;
     @Input() type: string;

     constructor(private activeModal: NgbActiveModal) { }

     /**
     * This function will call when component is load first time
     * @memberof MessageModelComponent
     */
     public ngOnInit(): void {
          /** intialize */
     }

     /**
     * close active modal
     * @memberof MessageModelComponent
     */
     closeModal() {
          if (this.type === 'web') {
               location.reload();
          }
          this.activeModal.close();
     }

}
