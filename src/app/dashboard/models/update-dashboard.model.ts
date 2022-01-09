import { Member } from 'src/app/workspace/models/member.model';

export interface UpdateDashboard {
  title?: string;
  board_id: string;
  team?: Array<Member>;
  private?: boolean;
}
