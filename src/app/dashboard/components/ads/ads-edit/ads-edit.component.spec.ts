import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsEditComponent } from './ads-edit.component';

describe('AdsEditComponent', () => {
  let component: AdsEditComponent;
  let fixture: ComponentFixture<AdsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
