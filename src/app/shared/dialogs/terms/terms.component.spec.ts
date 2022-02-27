import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsDialog } from './terms.component';

describe('TermsDialog', () => {
  let component: TermsDialog;
  let fixture: ComponentFixture<TermsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TermsDialog],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
