import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdsCursoComponent } from './edit-ads-curso.component';

describe('EditAdsCursoComponent', () => {
  let component: EditAdsCursoComponent;
  let fixture: ComponentFixture<EditAdsCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAdsCursoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAdsCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
