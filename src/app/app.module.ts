import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Importing QueryBuilderModule from ej2-angular-querybuilder package.
import { QueryBuilderModule } from '@syncfusion/ej2-angular-querybuilder';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { AppComponent } from './app.component';
import { RuleComponent } from './rule/rule.component';

@NgModule({
  imports: [BrowserModule, QueryBuilderModule, DialogModule], // Declaration of QueryBuilder module into NgModule.
  declarations: [AppComponent, RuleComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }