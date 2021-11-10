import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/login/component/login.component';
import { RegisterComponent } from 'src/app/register/component/register.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [MessageService],
})
export class NavbarComponent {
  items: Array<MenuItem> = [
    { label: 'Home', icon: 'pi pi-fw pi-home' },
    { label: 'Contact', icon: 'pi pi-fw pi-phone' },
    { label: 'Workspaces', icon: 'pi pi-fw pi-calendar' },
    { label: 'Account', icon: 'pi pi-fw pi-user' },
    { label: 'Log in', icon: 'pi pi-fw pi-id-card' },
    { label: 'Sign up', icon: 'pi pi-user-plus' },
  ];

  constructor(
    public dialog: MatDialog,
    private messageService: MessageService
  ) {}

  openLoginDialog(): void {
    const dialogRefLogin = this.dialog.open(LoginComponent);
    dialogRefLogin.afterClosed().subscribe((result) => {
      if (result) {
        if (result.redirect) {
          this.openRegisterDialog();
        } else {
          if (result.data) {
            console.log(result.data);
          }
          console.log(result);
          this._showSnackbar('success', result.message);
        }
      }
    });
  }

  openRegisterDialog(): void {
    const dialogRefLogin = this.dialog.open(RegisterComponent);
    dialogRefLogin.afterClosed().subscribe((result) => {
      if (result) {
        if (result.redirect) {
          this.openLoginDialog();
        } else {
          this._showSnackbar('success', result.message);
        }
      }
    });
  }

  _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
