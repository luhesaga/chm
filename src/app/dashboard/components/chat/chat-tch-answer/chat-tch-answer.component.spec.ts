import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatTchAnswerComponent } from './chat-tch-answer.component';

describe('ChatTchAnswerComponent', () => {
  let component: ChatTchAnswerComponent;
  let fixture: ComponentFixture<ChatTchAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatTchAnswerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatTchAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
