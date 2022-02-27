import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteDialog {
  blocked: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<DeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string; title: string }
  ) {}

  public checkName(name: string): void {
    name === this.data.name ? (this.blocked = false) : (this.blocked = true);
  }

  public onDelete(): void {
    !this.blocked ? this.dialogRef.close(true) : null;
  }

  public onGoBack(): void {
    this.dialogRef.close(false);
  }
}
