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
import { UpdateRuleComponent } from './update-rule/update-rule.component';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { ViewRuleComponent } from './view-rule/view-rule.component';


/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'left',
			distance: 12
		},
		vertical: {
			position: 'bottom',
			distance: 12,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  imports: [BrowserModule, QueryBuilderModule, DialogModule,
    AppRoutingModule, HttpClientModule, DataTablesModule,
    NotifierModule.withConfig(customNotifierOptions)
    ], // Declaration of QueryBuilder module into NgModule.
  declarations: [AppComponent, RuleComponent, ListComponent, UpdateRuleComponent, ViewRuleComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }