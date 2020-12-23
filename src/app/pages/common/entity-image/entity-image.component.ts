import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-News-entity-image',
    templateUrl: './News-entity-image.component.html',
    styleUrls: ['./News-entity-image.component.scss']
})
export class NewsEntityImageComponent implements OnInit {

    @Input() news_images: any;

    slideConfig = {
        enabled: true,
        autoplay: false,
        arrows: true,
        dots: false,
        speed: 1000,
        draggable: false,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    constructor(
        private activeModal: NgbActiveModal
    ) { }

   /**
     * This function will call when component is load first time
     * @memberof NewsEntityImageComponent
     */
    public ngOnInit(): void {
        /** intialize */
    }

    /**
     * Close the popup
     * @memberof NewsEntityImageComponent
     */
    public closeModal(): void {
        this.activeModal.close();
    }

    /**
     * called when slick intialize
     * @param {any} e click intialize object
     * @memberof NewsEntityImageComponent
     */
    public slickInit(e: any): void {
        console.log('slick initialized');
    }

    public breakpoint(e: any): void {
        console.log('breakpoint');
    }

    public afterChange(e: any): void {
        console.log('afterChange');
    }

    beforeChange(e: any) {
        console.log('beforeChange');
    }

}
