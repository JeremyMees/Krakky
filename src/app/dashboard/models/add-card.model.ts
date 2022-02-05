import { Tag } from 'src/app/shared/models/tag.model';

export interface AddCard {
  board_id: string;
  title: string;
  content?: string;
  list_id: string;
  created_by: string;
  created_at: number;
  color?: string;
  tags: Array<Tag>;
  assignees?: Array<string>;
}
