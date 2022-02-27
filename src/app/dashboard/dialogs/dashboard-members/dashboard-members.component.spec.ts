import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMembersDialog } from './dashboard-members.component';

describe('DashboardMembersDialog', () => {
  let component: DashboardMembersDialog;
  let fixture: ComponentFixture<DashboardMembersDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardMembersDialog],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMembersDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
