import { TestBed } from '@angular/core/testing';

import { MemberWorkspaceGuard } from './member-workspace.guard';

describe('MemberWorkspaceGuard', () => {
  let guard: MemberWorkspaceGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MemberWorkspaceGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
