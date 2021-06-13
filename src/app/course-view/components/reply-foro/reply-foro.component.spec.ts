import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyForoComponent } from './reply-foro.component';

describe('ReplyForoComponent', () => {
  let component: ReplyForoComponent;
  let fixture: ComponentFixture<ReplyForoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplyForoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyForoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
