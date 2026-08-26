import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { PaginationComponent } from './shared/components/pagination/pagination';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    PaginationComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { }