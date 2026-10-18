import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Breadcrumb } from '@shared/components/breadcrumb/breadcrumb';
import { Sidebar } from '@shared/components/sidebar/sidebar';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar, Breadcrumb],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
