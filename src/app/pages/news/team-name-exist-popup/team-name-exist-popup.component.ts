import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-team-name-exist-popup',
    templateUrl: './team-name-exist-popup.component.html',
    styleUrls: ['./team-name-exist-popup.component.scss']
})
export class TeamNameExistPopupComponent implements OnInit {

    constructor(
        private activeModal: NgbActiveModal
    ) { }

    /**
     * This function will call when component is load first time
     * @memberof TeamNameExistPopupComponent
     */
    public ngOnInit(): void {
        /** intialize */
    }

    /**
     * close active modal
     * @memberof TeamNameExistPopupComponent
     */
    public closeModal(): void {
        this.activeModal.close();
    }

}
