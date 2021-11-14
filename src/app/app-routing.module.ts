import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/components/account.component';
import { LandingComponent } from './landing/components/landing.component';
import { WorkspaceComponent } from './workspace/components/workspace-parent/workspace.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: LandingComponent },
  { path: 'account', component: AccountComponent },
  { path: 'workspace', component: WorkspaceComponent },
  { path: 'workspace/:id', component: WorkspaceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
