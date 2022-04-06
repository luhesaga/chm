import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmDesignViewComponent } from './adm-design-view.component';

describe('AdmDesignViewComponent', () => {
  let component: AdmDesignViewComponent;
  let fixture: ComponentFixture<AdmDesignViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmDesignViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmDesignViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
