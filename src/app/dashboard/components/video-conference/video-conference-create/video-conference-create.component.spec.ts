import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoConferenceCreateComponent } from './video-conference-create.component';

describe('VideoConferenceCreateComponent', () => {
  let component: VideoConferenceCreateComponent;
  let fixture: ComponentFixture<VideoConferenceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoConferenceCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoConferenceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
