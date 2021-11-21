import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/components/account/account.component';
import { LoginGuard } from './guards/login/login.guard';
import { LandingComponent } from './landing/components/landing.component';
import { TeamComponent } from './team/components/team.component';
import { WorkspaceComponent } from './workspace/components/workspace-parent/workspace.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: LandingComponent },
  { path: 'account', component: AccountComponent, canActivate: [LoginGuard] },
  {
    path: 'workspace',
    component: WorkspaceComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'workspace/:id',
    component: WorkspaceComponent,
    canActivate: [LoginGuard],
  },
  { path: 'team/:id', component: TeamComponent, canActivate: [LoginGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
