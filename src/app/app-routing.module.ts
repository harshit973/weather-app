import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherforecastComponent } from './weatherforecast/weatherforecast.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {path:"",component:WelcomeComponent},
  {path:"weatherforecast",component:WeatherforecastComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
