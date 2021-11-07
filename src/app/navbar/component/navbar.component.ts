import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/login/component/login.component';
import { RegisterComponent } from 'src/app/register/component/register.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  items: Array<MenuItem> = [
    { label: 'Home', icon: 'pi pi-fw pi-home' },
    { label: 'Contact', icon: 'pi pi-fw pi-phone' },
    { label: 'Workspaces', icon: 'pi pi-fw pi-calendar' },
    { label: 'Account', icon: 'pi pi-fw pi-user' },
    { label: 'Log in', icon: 'pi pi-fw pi-id-card' },
    { label: 'Sign up', icon: 'pi pi-user-plus' },
  ];

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  openLoginDialog(): void {
    const dialogRefLogin = this.dialog.open(LoginComponent);

    dialogRefLogin.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openRegisterDialog(): void {
    const dialogRefLogin = this.dialog.open(RegisterComponent);

    dialogRefLogin.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
