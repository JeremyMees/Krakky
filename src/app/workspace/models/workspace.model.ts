import { Member } from './member.model';

export interface Workspace {
  created_by: string;
  workspace: string;
  workspace_id?: string;
  color: string;
  bg_color: string;
  team: Array<Member>;
  _id?: string;
  __v?: number;
}
