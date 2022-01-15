import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { RandomColors } from 'src/app/shared/models/random-colors.model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';
import { Workspace } from '../../models/workspace.model';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'app-create-workspace',
  templateUrl: './create-workspace.component.html',
  styleUrls: ['./create-workspace.component.scss'],
  providers: [MessageService],
})
export class CreateWorkspaceComponent {
  constructor(
    private dialogRef: MatDialogRef<CreateWorkspaceComponent>,
    public messageService: MessageService,
    private workspaceService: WorkspaceService,
    private userService: UserService,
    private sharedService: SharedService
  ) {}

  public onAddWorkspace(form: NgForm): void {
    if (form.invalid) {
      form.reset();
      this._showSnackbar('error', "Form wasn't filled correctly");
      return;
    }
    const user = this.userService.getCurrentUser().value as User;
    const colors: RandomColors = this.sharedService.onGenerateRandomColors();
    const newWorkspace: Workspace = {
      created_by: user._id as string,
      workspace: form.value.workspace_name,
      team: [{ _id: user._id as string, role: 'Owner' }],
      color: colors.color,
      bg_color: colors.bg_color,
    };
    this.workspaceService.addWorkspace(newWorkspace).subscribe({
      next: (res: HttpResponse) => {
        this.dialogRef.close(res);
      },
      error: () => this._showSnackbar('error', "Couldn't create new workspace"),
    });
  }

  public onGoBack(): void {
    this.dialogRef.close();
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
