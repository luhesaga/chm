import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCarrerasComponent } from './edit-carreras.component';

describe('EditCarrerasComponent', () => {
  let component: EditCarrerasComponent;
  let fixture: ComponentFixture<EditCarrerasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCarrerasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCarrerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
