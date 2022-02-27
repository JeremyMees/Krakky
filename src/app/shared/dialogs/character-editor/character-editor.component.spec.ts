import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterEditorDialog } from './character-editor.component';

describe('CharacterEditorDialog', () => {
  let component: CharacterEditorDialog;
  let fixture: ComponentFixture<CharacterEditorDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterEditorDialog],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterEditorDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
