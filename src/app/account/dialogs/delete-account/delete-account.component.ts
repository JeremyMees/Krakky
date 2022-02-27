import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/user/models/user.model';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss'],
})
export class DeleteAccountDialog {
  blocked: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<DeleteAccountDialog>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {}

  public onCheckName(name: string): void {
    name === this.data.email ? (this.blocked = false) : (this.blocked = true);
  }

  public onDelete(): void {
    !this.blocked ? this.dialogRef.close(true) : null;
  }

  public onGoBack(): void {
    this.dialogRef.close(false);
  }
}
