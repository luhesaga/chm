import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrerasDetailComponent } from './carreras-detail.component';

describe('CarrerasDetailComponent', () => {
  let component: CarrerasDetailComponent;
  let fixture: ComponentFixture<CarrerasDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarrerasDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrerasDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
