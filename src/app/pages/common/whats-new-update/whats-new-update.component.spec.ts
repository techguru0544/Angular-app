import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsNewUpdateComponent } from './whats-new-update.component';

describe('WhatsNewUpdateComponent', () => {
  let component: WhatsNewUpdateComponent;
  let fixture: ComponentFixture<WhatsNewUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsNewUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsNewUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
