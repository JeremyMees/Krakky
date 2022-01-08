import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-member',
  templateUrl: './not-member.component.html',
  styleUrls: ['./not-member.component.scss'],
})
export class NotMemberComponent {
  constructor(public router: Router) {}
}
