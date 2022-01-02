export interface Card {
  board_id: string;
  title: string;
  content?: string;
  list_id: string;
  created_by: string;
  created_at?: number;
  start_date?: Date;
  due_date?: Date;
  completion_date?: Date;
  index: number;
  color: string;
  priority?: string;
  assignees?: Array<{ _id: string }>;
  _id?: string;
  __v?: number;
}
