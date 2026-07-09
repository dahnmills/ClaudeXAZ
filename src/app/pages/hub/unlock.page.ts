import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HubAdminService } from './hub-admin.service';

@Component({ selector: 'app-unlock', standalone: true, template: '' })
export class UnlockPage implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private admin  = inject(HubAdminService);

  ngOnInit() {
    const key = this.route.snapshot.paramMap.get('key') ?? '';
    this.admin.unlock(key);
    this.router.navigate(['/'], { replaceUrl: true });
  }
}
