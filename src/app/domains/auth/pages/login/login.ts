import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  imports: [
    InputTextModule,
    IftaLabelModule,
    ButtonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
}
