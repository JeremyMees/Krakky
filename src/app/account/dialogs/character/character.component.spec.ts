import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterDialog } from './character.component';

describe('CharacterComponent', () => {
  let component: CharacterDialog;
  let fixture: ComponentFixture<CharacterDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterDialog],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
