import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyDialog } from './privacy.component';

describe('PrivacyDialog', () => {
  let component: PrivacyDialog;
  let fixture: ComponentFixture<PrivacyDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivacyDialog],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
