import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Layout as AuthLayout} from '@domains/auth/layout/layout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('wilazdev-front');
}
