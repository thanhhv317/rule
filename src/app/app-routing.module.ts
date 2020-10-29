import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './components/create/create.component';
import { ListComponent } from './components/list/list.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UpdateRuleComponent } from './components/update-rule/update-rule.component';
import { ViewRuleComponent } from './components/view-rule/view-rule.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'create', component: CreateComponent },
  { path: 'list', component: ListComponent },
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  { path: 'update/:id', component: UpdateRuleComponent },
  { path: 'detail/:id', component: ViewRuleComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }