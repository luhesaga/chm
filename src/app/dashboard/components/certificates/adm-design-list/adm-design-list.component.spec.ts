import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmDesignListComponent } from './adm-design-list.component';

describe('AdmDesignListComponent', () => {
  let component: AdmDesignListComponent;
  let fixture: ComponentFixture<AdmDesignListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmDesignListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmDesignListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
