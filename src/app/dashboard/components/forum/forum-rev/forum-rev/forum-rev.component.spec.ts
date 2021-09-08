import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumRevComponent } from './forum-rev.component';

describe('ForumRevComponent', () => {
  let component: ForumRevComponent;
  let fixture: ComponentFixture<ForumRevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumRevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumRevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
