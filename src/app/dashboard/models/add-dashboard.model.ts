import { Tag } from 'src/app/shared/models/tag.model';
import { Member } from 'src/app/workspace/models/member.model';

export interface AddDashboard {
  created_by: string;
  title: string;
  workspace_id: string;
  private: boolean;
  inactive: boolean;
  team?: Array<Member>;
  recent_tags: Array<Tag>;
  color: string;
  bg_color: string;
}
