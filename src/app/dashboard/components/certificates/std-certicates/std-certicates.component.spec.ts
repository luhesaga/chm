import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StdCerticatesComponent } from './std-certicates.component';

describe('StdCerticatesComponent', () => {
  let component: StdCerticatesComponent;
  let fixture: ComponentFixture<StdCerticatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StdCerticatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StdCerticatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
