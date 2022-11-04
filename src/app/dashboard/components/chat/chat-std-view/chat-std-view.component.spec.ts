import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatStdViewComponent } from './chat-std-view.component';

describe('ChatStdViewComponent', () => {
  let component: ChatStdViewComponent;
  let fixture: ComponentFixture<ChatStdViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatStdViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatStdViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
