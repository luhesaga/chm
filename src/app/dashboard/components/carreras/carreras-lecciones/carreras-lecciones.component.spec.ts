import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrerasLeccionesComponent } from './carreras-lecciones.component';

describe('CarrerasLeccionesComponent', () => {
  let component: CarrerasLeccionesComponent;
  let fixture: ComponentFixture<CarrerasLeccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarrerasLeccionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrerasLeccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
