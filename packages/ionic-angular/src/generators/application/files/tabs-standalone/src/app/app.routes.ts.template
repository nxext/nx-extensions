import { NgModule } from '@angular/core';
import {Routes} from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then(r => r.routes)
  }
];
