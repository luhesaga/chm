import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDocumentsComponent } from './modal-documents.component';

describe('ModalDocumentsComponent', () => {
  let component: ModalDocumentsComponent;
  let fixture: ComponentFixture<ModalDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
