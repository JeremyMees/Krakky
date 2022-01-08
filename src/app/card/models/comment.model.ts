import { Assignee } from './assignee.model';

export interface Comment {
  user_id: string;
  user?: Assignee;
  created_at: number;
  updated_at: number;
  content: string;
}
