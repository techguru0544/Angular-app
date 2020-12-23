import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsEntityImageComponent } from './News-entity-image.component';

describe('NewsEntityImageComponent', () => {
  let component: NewsEntityImageComponent;
  let fixture: ComponentFixture<NewsEntityImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsEntityImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsEntityImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
