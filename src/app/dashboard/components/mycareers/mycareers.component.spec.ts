import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MycareersComponent } from './mycareers.component';

describe('MycareersComponent', () => {
  let component: MycareersComponent;
  let fixture: ComponentFixture<MycareersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MycareersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MycareersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
