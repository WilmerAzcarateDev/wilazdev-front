import { Component, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { LoginModel } from '@domains/auth/models/login';
import { form, FormField, FormRoot, required, email } from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  imports: [InputTextModule, IftaLabelModule, ButtonModule, FormField, FormRoot],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginModel = signal<LoginModel>({
    email: '',
    password: '',
  });

  loginForm = form(
    this.loginModel,
    (schemaPath) => {
      required(schemaPath.email, { message: 'Please enter an email!' });
      email(schemaPath.email,{ message: "Please enter a valid email!"})
      required(schemaPath.password);
    },
    {
      submission: {
        action: async (formValue) => {
          console.log(formValue().value());
        },
      },
    },
  );
}
