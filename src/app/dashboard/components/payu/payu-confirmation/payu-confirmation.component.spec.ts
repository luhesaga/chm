import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayuConfirmationComponent } from './payu-confirmation.component';

describe('PayuConfirmationComponent', () => {
  let component: PayuConfirmationComponent;
  let fixture: ComponentFixture<PayuConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayuConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayuConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
