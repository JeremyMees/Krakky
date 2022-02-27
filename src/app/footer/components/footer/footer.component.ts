import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PrivacyDialog } from 'src/app/shared/dialogs/privacy/privacy.component';
import { TermsDialog } from 'src/app/shared/dialogs/terms/terms.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  constructor(public dialog: MatDialog) {}

  public openDialogTerms(): void {
    this.dialog.open(TermsDialog, { autoFocus: false });
  }

  public openDialogPrivacy(): void {
    this.dialog.open(PrivacyDialog, { autoFocus: false });
  }
}
