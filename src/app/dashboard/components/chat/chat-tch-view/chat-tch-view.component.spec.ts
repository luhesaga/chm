import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatTchViewComponent } from './chat-tch-view.component';

describe('ChatTchViewComponent', () => {
  let component: ChatTchViewComponent;
  let fixture: ComponentFixture<ChatTchViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatTchViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatTchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
