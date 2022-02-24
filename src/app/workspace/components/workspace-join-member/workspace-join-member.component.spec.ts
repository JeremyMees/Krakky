import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceJoinMemberComponent } from './workspace-join-member.component';

describe('WorkspaceJoinMemberComponent', () => {
  let component: WorkspaceJoinMemberComponent;
  let fixture: ComponentFixture<WorkspaceJoinMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkspaceJoinMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceJoinMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
