import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumUsersAnswersComponent } from './forum-users-answers.component';

describe('ForumUsersAnswersComponent', () => {
  let component: ForumUsersAnswersComponent;
  let fixture: ComponentFixture<ForumUsersAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumUsersAnswersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumUsersAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
