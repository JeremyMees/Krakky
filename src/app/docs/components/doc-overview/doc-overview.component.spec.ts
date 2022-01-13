import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocOverviewComponent } from './doc-overview.component';

describe('DocOverviewComponent', () => {
  let component: DocOverviewComponent;
  let fixture: ComponentFixture<DocOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
