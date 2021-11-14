import { Dashboard } from 'src/app/dashboard/models/dashboard.model';
import { Member } from './member.model';

export interface AggregatedWorkspace {
  created_by: string;
  workspace: string;
  workspace_id: string;
  dashboards?: Array<Dashboard>;
  team: Array<Member>;
  _id?: string;
  __v?: number;
}
