import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cognito } from '@shared/services/auth/cognito';
import { Theme as ThemeService} from '@shared/services/ui/theme';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ButtonDirective
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  themeService = inject(ThemeService);
  authService = inject(Cognito);

  changeTheme(){
    this.themeService.toggleTheme();
  }
}
