import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotMemberComponent } from './not-member.component';

describe('NotMemberComponent', () => {
  let component: NotMemberComponent;
  let fixture: ComponentFixture<NotMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
