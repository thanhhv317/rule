import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Importing QueryBuilderModule from ej2-angular-querybuilder package.
import { QueryBuilderModule } from '@syncfusion/ej2-angular-querybuilder';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ListComponent } from './components/list/list.component';
import { UpdateRuleComponent } from './components/update-rule/update-rule.component';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { ViewRuleComponent } from './components/view-rule/view-rule.component';

import { FormsModule } from '@angular/forms';

// ng bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateComponent } from './components/create/create.component';

// import the DateTimePickerModule for the DateTimePicker component
import { DateTimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { CurrencyPipe } from '@angular/common';
import { LoginComponent } from './components/login/login.component';

import { CookieService } from 'ngx-cookie-service';


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
    NotifierModule.withConfig(customNotifierOptions),
    NgbModule, FormsModule, DateTimePickerModule,
  ], // Declaration of QueryBuilder module into NgModule.
  declarations: [AppComponent, ListComponent, UpdateRuleComponent, ViewRuleComponent, CreateComponent, LoginComponent],
  bootstrap: [AppComponent],
  providers: [CurrencyPipe, CookieService],

})
export class AppModule { }