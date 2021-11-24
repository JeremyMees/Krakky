import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';
import { CharacterComponent } from '../character/character.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  user!: User;
  constructor(private userService: UserService, public dialog: MatDialog) {}

  public ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      this.user = user as User;
    });
  }

  public openDialogCharacter(): void {
    this.dialog.open(CharacterComponent, {
      width: '100%',
      maxWidth: '600px',
      data: this.user,
    });
  }

  responsiveOptions = [
    {
      breakpoint: '500px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  workspaces = [
    { workspace: 'kaas', team: [1, 2, 3] },
    { workspace: 'haas', team: [1, 2, 3, 3, 4] },
    { workspace: 'paas', team: [1, 2] },
    { workspace: 'raas', team: [1, 2, 3, 3] },
    { workspace: 'paas', team: [1, 2] },
    { workspace: 'raas', team: [1, 2, 3, 3] },
  ];
}
