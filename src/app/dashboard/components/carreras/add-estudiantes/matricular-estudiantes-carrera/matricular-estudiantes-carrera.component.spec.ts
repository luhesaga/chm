import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatricularEstudiantesCarreraComponent } from './matricular-estudiantes-carrera.component';

describe('MatricularEstudiantesCarreraComponent', () => {
  let component: MatricularEstudiantesCarreraComponent;
  let fixture: ComponentFixture<MatricularEstudiantesCarreraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatricularEstudiantesCarreraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatricularEstudiantesCarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
