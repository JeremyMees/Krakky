import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiTokenComponent } from './api-token.component';

describe('ApiTokenComponent', () => {
  let component: ApiTokenComponent;
  let fixture: ComponentFixture<ApiTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiTokenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
