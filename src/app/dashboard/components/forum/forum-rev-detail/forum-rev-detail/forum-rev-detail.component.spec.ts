import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumRevDetailComponent } from './forum-rev-detail.component';

describe('ForumRevDetailComponent', () => {
  let component: ForumRevDetailComponent;
  let fixture: ComponentFixture<ForumRevDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumRevDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumRevDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
