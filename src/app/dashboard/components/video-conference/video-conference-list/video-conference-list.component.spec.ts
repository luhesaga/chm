import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoConferenceListComponent } from './video-conference-list.component';

describe('VideoConferenceListComponent', () => {
  let component: VideoConferenceListComponent;
  let fixture: ComponentFixture<VideoConferenceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoConferenceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoConferenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
