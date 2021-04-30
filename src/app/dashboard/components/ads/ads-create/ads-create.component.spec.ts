import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsCreateComponent } from './ads-create.component';

describe('AdsCreateComponent', () => {
  let component: AdsCreateComponent;
  let fixture: ComponentFixture<AdsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdsCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
