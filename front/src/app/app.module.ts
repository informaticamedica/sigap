import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SigninComponent } from './componentes/signin/signin.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from "@angular/common/http";
import { SignupComponent } from './componentes/signup/signup.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { ScatterChartComponent } from './componentes/scatter-chart/scatter-chart.component';
import { ChartsModule } from 'ng2-charts';
import { ChangepassComponent } from './componentes/changepass/changepass.component';
import { BubbleChartComponent } from './componentes/bubble-chart/bubble-chart.component';
import { GlobalComponent } from './componentes/global/global.component';
import { BarChartComponent } from './componentes/bar-chart/bar-chart.component';
import { LineChartComponent } from './componentes/line-chart/line-chart.component';
import { DoughnutChartComponent } from './componentes/doughnut-chart/doughnut-chart.component';
import { RadarChartComponent } from './componentes/radar-chart/radar-chart.component';
import { PieChartComponent } from './componentes/pie-chart/pie-chart.component';
@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    SigninComponent,
    SignupComponent,
    PrincipalComponent,
    ScatterChartComponent,
    ChangepassComponent,
    BubbleChartComponent,
    GlobalComponent,
    BarChartComponent,
    LineChartComponent,
    DoughnutChartComponent,
    RadarChartComponent,
    PieChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    NgbModule,
    HttpClientModule,
    ChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
