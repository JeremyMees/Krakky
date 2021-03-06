import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs/operators';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss'],
  providers: [MessageService],
})
export class DeleteUserComponent implements OnInit {
  user_id!: string;

  constructor(
    private messageService: MessageService,
    public router: Router,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this._onGetParamId();
  }

  public onDeleteUser(): void {
    this.userService
      .onDeleteUser(this.user_id)
      .pipe(take(1))
      .subscribe({
        next: (res: HttpResponse) => {
          if (res.statusCode === 200) {
            this._showSnackbar('info', 'Deleted user successfully');
            setTimeout(() => {
              this.router.navigateByUrl('home');
            }, 2000);
          } else {
            this._showSnackbar('info', "User doesn't exist");
          }
        },
        error: () => {
          this._showSnackbar('error', "Couldn't delete user");
        },
      });
  }

  private _onGetParamId(): void {
    this.route.params.pipe(take(1)).subscribe((params) => {
      if (params.id) {
        this.user_id = params.id;
      } else {
        this.router.navigateByUrl('home');
      }
    });
  }

  public onGoBack(): void {
    this.router.navigateByUrl('home');
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
