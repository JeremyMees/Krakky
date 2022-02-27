import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAccountDialog } from './delete-account.component';

describe('DeleteAccountDialog', () => {
  let component: DeleteAccountDialog;
  let fixture: ComponentFixture<DeleteAccountDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteAccountDialog],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAccountDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
