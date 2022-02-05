import { Component, Input } from '@angular/core';
import { Tag } from '../../models/tag.model';

@Component({
  selector: 'card-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent {
  @Input() tag!: Tag;
}
