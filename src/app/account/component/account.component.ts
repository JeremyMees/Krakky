import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  responsiveOptions = [
    {
      breakpoint: '1000px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '700px',
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

  constructor() {}

  ngOnInit(): void {}
}
