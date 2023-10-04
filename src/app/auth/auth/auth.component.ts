import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppName } from 'src/app/shared/constants/common';
import { AppRoutes } from 'src/app/shared/routes/app.routes';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private titleService: Title,
  ) {}

  async ngOnInit() {
    this.titleService.setTitle(AppName + ' - User Authentication');
    if (this.authService.isAuthenticated()) {
      await this.router.navigate([AppRoutes.DashBoard.RootDashBoard + '/' + AppRoutes.DashBoard.DashBoard]);
    }
  }
}
