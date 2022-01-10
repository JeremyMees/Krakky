import { Card } from 'src/app/card/models/card.model';
import { List } from 'src/app/list/models/list.model';
import { Member } from 'src/app/workspace/models/member.model';

export interface AggregatedDashboard {
  _id: string;
  workspace_id: string;
  board_id: string;
  title: string;
  team: Array<Member>;
  created_by: string;
  __v: number;
  cards: Array<Card>;
  lists: Array<List>;
  private: boolean;
  inactive: boolean;
}