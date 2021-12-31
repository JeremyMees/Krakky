export interface AddCard {
  board_id: string;
  title: string;
  content?: string;
  list_id: string;
  created_by: string;
  created_at: number;
  color?: string;
  priority?: string;
  assignees?: Array<string>;
}
