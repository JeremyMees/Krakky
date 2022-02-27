import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccountDialog } from './edit-account.component';

describe('EditAccountDialog', () => {
  let component: EditAccountDialog;
  let fixture: ComponentFixture<EditAccountDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditAccountDialog],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAccountDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
