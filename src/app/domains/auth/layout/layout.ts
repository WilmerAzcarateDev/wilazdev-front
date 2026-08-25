import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card'

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    CardModule
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
