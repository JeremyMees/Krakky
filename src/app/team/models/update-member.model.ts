import { Member } from 'src/app/workspace/models/member.model';

export interface UpdateMember {
  workspace_id: string;
  team: Array<Member>;
}
