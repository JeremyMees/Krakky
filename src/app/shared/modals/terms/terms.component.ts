import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TERMS } from '../../data/terms_conditions.data';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent {
  terms: string = TERMS;

  constructor(public dialogRef: MatDialogRef<TermsComponent>) {}

  public onClose(): void {
    this.dialogRef.close();
  }
}
