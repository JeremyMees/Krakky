import { Member } from 'src/app/workspace/models/member.model';

export interface AddDashboard {
  created_by: string;
  title: string;
  workspace_id: string;
  private: boolean;
  inactive: boolean;
  team?: Array<Member>;
  color: string;
  bg_color: string;
}
