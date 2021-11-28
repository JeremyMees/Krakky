import { AggregatedWorkspace } from 'src/app/workspace/models/aggregated-workspace.model';

export const AggregatedWorkspaceMock: AggregatedWorkspace = {
  _id: '619fd86efc9d6b482d067844',
  team: [
    {
      _id: '619a6965cdd9a5ed33b2cdb7',
      role: 'Owner',
    },
  ],
  workspace_id: '47d08665-6433-471d-b432-81bc9c1dcf0c',
  workspace: 'krakky',
  created_by: '619a6965cdd9a5ed33b2cdb7',
  __v: 0,
  dashboards: [
    {
      _id: '619ff02b35bdaae2a8e56ad5',
      workspace_id: '47d08665-6433-471d-b432-81bc9c1dcf0c',
      board_id: '3e5ae499-7671-4c21-86a9-bcef599a0f01',
      title: 'super length long na',
      created_by: '619a6965cdd9a5ed33b2cdb7',
      __v: 0,
    },
    {
      _id: '61a10bd665e4f536005d5ef7',
      workspace_id: '47d08665-6433-471d-b432-81bc9c1dcf0c',
      board_id: '7c53fd1d-39a1-48d1-b229-2d7f4bb16a01',
      title: 'dashboard',
      created_by: '619a6965cdd9a5ed33b2cdb7',
      __v: 0,
    },
    {
      _id: '61a2398765e4f536005d5f78',
      workspace_id: '47d08665-6433-471d-b432-81bc9c1dcf0c',
      board_id: 'e27ba414-d29c-4af7-b118-abbdac42c837',
      title: 'testertje',
      created_by: '619a6965cdd9a5ed33b2cdb7',
      __v: 0,
    },
  ],
};
