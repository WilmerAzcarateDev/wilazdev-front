import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    CardModule,
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
