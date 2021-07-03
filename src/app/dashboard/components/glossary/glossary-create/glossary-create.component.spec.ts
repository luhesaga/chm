import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlossaryCreateComponent } from './glossary-create.component';

describe('GlossaryCreateComponent', () => {
  let component: GlossaryCreateComponent;
  let fixture: ComponentFixture<GlossaryCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlossaryCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlossaryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
