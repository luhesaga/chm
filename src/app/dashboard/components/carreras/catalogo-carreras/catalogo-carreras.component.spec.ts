import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoCarrerasComponent } from './catalogo-carreras.component';

describe('CatalogoCarrerasComponent', () => {
  let component: CatalogoCarrerasComponent;
  let fixture: ComponentFixture<CatalogoCarrerasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoCarrerasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoCarrerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
