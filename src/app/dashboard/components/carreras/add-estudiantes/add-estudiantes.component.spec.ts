import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEstudiantesComponent } from './add-estudiantes.component';

describe('AddEstudiantesComponent', () => {
  let component: AddEstudiantesComponent;
  let fixture: ComponentFixture<AddEstudiantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEstudiantesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
