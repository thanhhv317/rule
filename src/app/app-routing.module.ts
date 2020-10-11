import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RuleComponent } from './rule/rule.component';
import { ListComponent } from './list/list.component';
import { UpdateRuleComponent } from './update-rule/update-rule.component'

const routes: Routes = [
  { path: 'create', component: RuleComponent },
  { path: 'list', component: ListComponent },
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  { path: 'detail/:id', component: UpdateRuleComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }