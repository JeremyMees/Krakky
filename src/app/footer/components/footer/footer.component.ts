import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PrivacyComponent } from 'src/app/shared/modals/privacy/privacy.component';
import { TermsComponent } from 'src/app/shared/modals/terms/terms.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  constructor(public dialog: MatDialog) {}

  public openDialogTerms(): void {
    this.dialog.open(TermsComponent, { autoFocus: false });
  }

  public openDialogPrivacy(): void {
    this.dialog.open(PrivacyComponent, { autoFocus: false });
  }
}
