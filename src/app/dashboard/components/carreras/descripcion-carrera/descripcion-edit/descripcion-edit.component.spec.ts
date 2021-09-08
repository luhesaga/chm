import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescripcionEditComponent } from './descripcion-edit.component';

describe('DescripcionEditComponent', () => {
  let component: DescripcionEditComponent;
  let fixture: ComponentFixture<DescripcionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescripcionEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescripcionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
