import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescripcionCarreraComponent } from './descripcion-carrera.component';

describe('DescripcionCarreraComponent', () => {
  let component: DescripcionCarreraComponent;
  let fixture: ComponentFixture<DescripcionCarreraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescripcionCarreraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescripcionCarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
