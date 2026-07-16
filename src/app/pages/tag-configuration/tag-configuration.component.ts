import { Component } from '@angular/core';
import { TopboxTestShellComponent } from '../../user-testing/topbox/topbox-test-shell.component';
import { PageHeaderComponent }      from '../../shared/ui/page-header/page-header.component';
import { BreadcrumbsComponent }     from '../../shared/ui/breadcrumbs/breadcrumbs.component';
import { CrumbComponent }           from '../../shared/ui/crumb/crumb.component';
import { PageTitleComponent }       from '../../shared/ui/page-title/page-title.component';

@Component({
  selector: 'app-tag-configuration',
  standalone: true,
  imports: [
    TopboxTestShellComponent, PageHeaderComponent,
    BreadcrumbsComponent, CrumbComponent, PageTitleComponent,
  ],
  templateUrl: './tag-configuration.component.html',
  styleUrl: './tag-configuration.component.scss',
})
export class TagConfigurationComponent {}
