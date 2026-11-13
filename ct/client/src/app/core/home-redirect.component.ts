import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-home-redirect',
  standalone: true,
  template: '',
})
export class HomeRedirectComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    const role = this.auth.role();
    if (role === 'admin' || role === 'super_admin') {
      this.router.navigate(['/admin/dashboard'], { replaceUrl: true });
    } else if (role === 'assessor') {
      this.router.navigate(['/assessor/dashboard'], { replaceUrl: true });
    } else {
      this.router.navigate(['/dashboard'], { replaceUrl: true });
    }
  }
}
