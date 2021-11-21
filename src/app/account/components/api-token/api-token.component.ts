import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-api-token',
  templateUrl: './api-token.component.html',
  styleUrls: ['./api-token.component.scss'],
  providers: [MessageService],
})
export class ApiTokenComponent implements OnInit {
  @Input() user!: User;
  api_key: string | undefined;
  is_loading: boolean = true;

  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  public ngOnInit(): void {
    const current_user = this.userService.getCurrentUser();
    this.user = current_user.value as User;
    this.accountService
      .getApiKey({
        user_id: this.user._id as string,
      })
      .subscribe({
        next: (res: HttpResponse) => {
          res.statusCode === 200 ? (this.api_key = res.data.token) : null;
        },
        error: () => {
          this.showSnackbar('error', 'Error while fetching api key');
        },
        complete: () => {
          this.is_loading = false;
        },
      });
  }

  public onCreateApiKey(): void {
    this.is_loading = true;
    this.accountService
      .createApiKey({
        user_id: this.user._id as string,
      })
      .subscribe({
        next: (res: HttpResponse) => {
          res.statusCode === 201 ? (this.api_key = res.data.token) : null;
        },
        error: () => {
          this.showSnackbar('error', 'Error while creating api key');
        },
        complete: () => {
          this.is_loading = false;
        },
      });
  }

  public showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
