import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdsCursoComponent } from './create-ads-curso.component';

describe('CreateAdsCursoComponent', () => {
  let component: CreateAdsCursoComponent;
  let fixture: ComponentFixture<CreateAdsCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAdsCursoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAdsCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
