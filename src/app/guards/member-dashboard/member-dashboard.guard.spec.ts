import { TestBed } from '@angular/core/testing';
import { MemberDashboardGuard } from './member-dashboard.guard';

describe('MemberGuard', () => {
  let guard: MemberDashboardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MemberDashboardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
