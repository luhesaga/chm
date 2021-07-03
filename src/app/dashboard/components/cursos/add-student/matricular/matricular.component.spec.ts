import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatricularComponent } from './matricular.component';

describe('MatricularComponent', () => {
  let component: MatricularComponent;
  let fixture: ComponentFixture<MatricularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatricularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatricularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
