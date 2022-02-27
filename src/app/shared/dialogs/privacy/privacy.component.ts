import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PRIVACY } from '../../data/privacy.data';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
})
export class PrivacyDialog {
  privacy: string = PRIVACY;

  constructor(public dialogRef: MatDialogRef<PrivacyDialog>) {}

  public onClose(): void {
    this.dialogRef.close();
  }
}
