import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsCursoComponent } from './ads-curso.component';

describe('AdsCursoComponent', () => {
  let component: AdsCursoComponent;
  let fixture: ComponentFixture<AdsCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdsCursoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
