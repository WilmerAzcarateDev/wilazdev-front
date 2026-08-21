import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Theme as ThemeService} from '@shared/services/ui/theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  themeService = inject(ThemeService);

  changeTheme(){
    this.themeService.toggleTheme();
  }
}
