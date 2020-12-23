import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { newsLikesListComponent } from './news-likes-list.component';

describe('newsLikesListComponent', () => {
  let component: newsLikesListComponent;
  let fixture: ComponentFixture<newsLikesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ newsLikesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(newsLikesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
