import { Member } from 'src/app/workspace/models/member.model';

export interface AddDashboard {
  created_by: string;
  title: string;
  workspace_id: string;
  private?: boolean;
  team?: Array<Member>;
}
