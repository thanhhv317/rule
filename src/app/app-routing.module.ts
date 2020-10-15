import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { UpdateRuleComponent } from './update-rule/update-rule.component'
import { ViewRuleComponent } from './view-rule/view-rule.component';
import { CreateComponent } from './create/create.component';

const routes: Routes = [
  { path: 'create', component: CreateComponent },
  { path: 'list', component: ListComponent },
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  { path: 'update/:id', component: UpdateRuleComponent },
  { path: 'detail/:id', component: ViewRuleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }