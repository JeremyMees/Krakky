import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/login/components/login/login.component';
import { RegisterComponent } from 'src/app/register/components/register/register.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { UserService } from 'src/app/user/services/user.service';
import { User } from 'src/app/user/models/user.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [MessageService],
})
export class NavbarComponent implements OnInit {
  user: User | null = null;

  constructor(
    public dialog: MatDialog,
    private messageService: MessageService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    const current_user = this.userService.onGetCurrentUser();
    current_user.subscribe((user) => {
      this.user = user;
    });
  }

  public openLoginDialog(): void {
    const dialogRefLogin = this.dialog.open(LoginComponent, {
      maxWidth: '750px',
    });
    dialogRefLogin.afterClosed().subscribe((result) => {
      if (result) {
        if (result.redirect) {
          this.openRegisterDialog();
        } else {
          if (result.message.includes('Reset token')) {
            this._showSnackbar('info', result.message);
          } else {
            this._onGetCurrentUser();
          }
        }
      }
    });
  }

  public openRegisterDialog(): void {
    const dialogRefLogin = this.dialog.open(RegisterComponent, {
      width: '100%',
      maxWidth: '750px',
    });
    dialogRefLogin.afterClosed().subscribe((result) => {
      if (result) {
        if (result.redirect) {
          this.openLoginDialog();
        } else {
          delete result.data.username;
          this.authService.login(result.data).subscribe({
            next: (res: HttpResponse) => {
              if (res.statusCode === 200) {
                this._onGetCurrentUser();
              } else {
                this._showSnackbar('error', res.message);
              }
            },
            error: () => {
              this._showSnackbar('error', "Error couldn't log in");
            },
          });
        }
      }
    });
  }

  public onLogout(): void {
    this.user = null;
    this.authService.logout();
    this._showSnackbar('success', 'Logged out successfully');
  }

  private _onGetCurrentUser(): void {
    this.userService
      .onGetUser()
      .pipe(take(1))
      .subscribe({
        next: (res: HttpResponse) => {
          this.user = res.data;
          this.userService.onSetCurrentUser(res.data);
        },
        error: () => {
          this._showSnackbar('error', "Coudn't find user");
        },
      });
  }

  public onNotImplemented(): void {
    this._showSnackbar('info', 'Coming soon');
  }

  private _navigate(component: string): void {
    this.router.navigateByUrl(component);
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }

  items: Array<MenuItem> = [
    {
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      command: () => {
        this._navigate('home');
      },
    },
    {
      label: 'Contact',
      icon: 'pi pi-fw pi-envelope',
      command: () => {
        this._navigate('contact');
      },
    },
    {
      label: 'Docs',
      icon: 'pi pi-fw pi-list',
      command: () => {
        this._navigate('docs');
      },
    },
    {
      label: 'Log in',
      icon: 'pi pi-fw pi-sign-in',
      command: () => {
        this.openLoginDialog();
      },
    },
    {
      label: 'Sign up',
      icon: 'pi pi-user-plus',
      command: () => {
        this.openRegisterDialog();
      },
    },
  ];
  itemsLoggedin: Array<MenuItem> = [
    {
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      command: () => {
        this._navigate('home');
      },
    },
    {
      label: 'Contact',
      icon: 'pi pi-fw pi-envelope',
      command: () => {
        this._navigate('contact');
      },
    },
    {
      label: 'Workspaces',
      icon: 'pi pi-fw pi-calendar',
      command: () => {
        this._navigate('workspace');
      },
    },
    {
      label: 'Account',
      icon: 'pi pi-fw pi-user',
      command: () => {
        this._navigate('account');
      },
    },
    {
      label: 'Docs',
      icon: 'pi pi-fw pi-list',
      command: () => {
        this._navigate('docs');
      },
    },
    {
      label: 'Log out',
      icon: 'pi pi-fw pi-sign-out',
      command: () => {
        this.onLogout();
      },
    },
  ];
}
