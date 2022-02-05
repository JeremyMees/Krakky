import { Tag } from 'src/app/shared/models/tag.model';
import { Member } from 'src/app/workspace/models/member.model';

export interface UpdateDashboard {
  title?: string;
  board_id: string;
  team?: Array<Member>;
  private?: boolean;
  inactive?: boolean;
  color?: string;
  bg_color?: string;
  recent_tags?: Array<Tag>;
}
