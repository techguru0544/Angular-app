import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-premium-counter-popup',
  templateUrl: './premium-counter-popup.component.html',
  styleUrls: ['./premium-counter-popup.component.scss']
})
export class PremiumCounterPopupComponent implements OnInit {
  @Input() count: string;
  @Input() entity: string;

  constructor(
    private activeModal: NgbActiveModal
  ) { }

  /**
   * This function will call when component is load first time
   * @memberof PremiumCounterPopupComponent
   */
  public ngOnInit(): void {
    /** intialize */
  }

  /**
   * close active modal
   * @memberof PremiumCounterPopupComponent
   */
  public closeModal(): void {
    this.activeModal.close();
  }

}
