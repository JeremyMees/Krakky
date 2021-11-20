import { Member } from './member.model';

export interface Workspace {
  created_by: string;
  workspace: string;
  workspace_id?: string;
  team: Array<Member>;
  _id?: string;
  __v?: number;
}
