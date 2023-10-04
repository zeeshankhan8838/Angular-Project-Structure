import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from './shared/routes/app.routes';
import { AuthGuard } from './shared/services/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: AppRoutes.Auth },
  {
    path: AppRoutes.Auth,
    loadChildren: () => import('../app/auth/auth.module').then(m => m.AuthModule),
  },
  {
    canActivate: [AuthGuard],
    path: '' || AppRoutes.DashBoard.RootDashBoard,
    loadChildren: () => import('../app/modules/dashboard/dashboard.module').then(m => m.DashboardModule),
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
