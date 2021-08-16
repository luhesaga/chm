import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCarrerasComponent } from './create-carreras.component';

describe('CreateCarrerasComponent', () => {
  let component: CreateCarrerasComponent;
  let fixture: ComponentFixture<CreateCarrerasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCarrerasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCarrerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
