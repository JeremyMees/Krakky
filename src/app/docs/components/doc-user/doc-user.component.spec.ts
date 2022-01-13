import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocUserComponent } from './doc-user.component';

describe('DocUserComponent', () => {
  let component: DocUserComponent;
  let fixture: ComponentFixture<DocUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
