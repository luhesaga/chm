import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVistaAdsComponent } from './modal-vista-ads.component';

describe('ModalVistaAdsComponent', () => {
  let component: ModalVistaAdsComponent;
  let fixture: ComponentFixture<ModalVistaAdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalVistaAdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalVistaAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
