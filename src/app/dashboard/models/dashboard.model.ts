import { Member } from 'src/app/workspace/models/member.model';

export interface Dashboard {
  _id?: string;
  __v?: number;
  created_by: string;
  title: string;
  team: Array<Member>;
  board_id: string;
  workspace_id: string;
  private: boolean;
  inactive: boolean;
}
