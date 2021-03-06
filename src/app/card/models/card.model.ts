import { Tag } from 'src/app/shared/models/tag.model';
import { Comment } from './comment.model';
export interface Card {
  board_id: string;
  title: string;
  content?: string;
  list_id: string;
  created_by: string;
  created_at?: number;
  updated_at?: number;
  start_date?: Date;
  due_date?: Date;
  completion_date?: Date;
  index: number;
  color: string;
  tags: Array<Tag>;
  assignees?: Array<{ _id: string }>;
  comments?: Array<Comment>;
  _id?: string;
  __v?: number;
}
