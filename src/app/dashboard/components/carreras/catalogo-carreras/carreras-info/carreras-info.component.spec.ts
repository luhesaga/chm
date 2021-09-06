import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrerasInfoComponent } from './carreras-info.component';

describe('CarrerasInfoComponent', () => {
  let component: CarrerasInfoComponent;
  let fixture: ComponentFixture<CarrerasInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarrerasInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrerasInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
