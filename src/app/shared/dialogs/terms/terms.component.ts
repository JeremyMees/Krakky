import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TERMS } from '../../data/terms_conditions.data';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsDialog {
  terms: string = TERMS;

  constructor(public dialogRef: MatDialogRef<TermsDialog>) {}

  public onClose(): void {
    this.dialogRef.close();
  }
}
