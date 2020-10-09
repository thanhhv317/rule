import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Importing QueryBuilderModule from ej2-angular-querybuilder package.
import { QueryBuilderModule } from '@syncfusion/ej2-angular-querybuilder';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { HttpClientModule } from '@angular/common/http';

import { DataTablesModule } from 'angular-datatables';

import { AppComponent } from './app.component';
import { RuleComponent } from './rule/rule.component';
import { AppRoutingModule } from './app-routing.module';
import { ListComponent } from './list/list.component';
import { ServerSideAngularWayComponent } from './server-side-angular-way/server-side-angular-way.component';

@NgModule({
  imports: [BrowserModule, QueryBuilderModule, DialogModule,
    AppRoutingModule, HttpClientModule, DataTablesModule], // Declaration of QueryBuilder module into NgModule.
  declarations: [AppComponent, RuleComponent, ListComponent, ServerSideAngularWayComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }