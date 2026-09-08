import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { Cognito } from '@shared/services/auth/cognito';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    InputTextModule,
    IftaLabelModule,
    ButtonModule,
    ProgressSpinner
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(Cognito);
  router = inject(Router);
}
