import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TitleService } from '../title.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  formLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required])
  });

  enviado = false;
  senhaVisivel = false;

  constructor(private http: HttpClient, private titleService: TitleService, private snackBar: MatSnackBar) {
    this.titleService.setTitle('- LOGIN');
  }

  fazerLogin(): void {
    this.enviado = true;

    const email = this.formLogin.get('email');
    const senha = this.formLogin.get('senha');

    if (this.formLogin.invalid) {
      let mensagensErro = [];

      if (email?.invalid) {
        if (email.errors?.['required']) {
          mensagensErro.push('Por favor, insira um email.');
        } else if (email.errors?.['email']) {
          mensagensErro.push('Por favor, insira um email válido.');
        }
      }

      if (senha?.invalid && senha.errors?.['required']) {
        mensagensErro.push('Por favor, insira uma senha.');
      }
      this.snackBar.open(mensagensErro.join(' '), 'Fechar', { duration: 3000, panelClass: ['warning-snackbar'] });
      return;
    }

    const credenciais = this.formLogin.value;
    this.http.post('http://localhost:3000/autenticacao/login', credenciais)
      .subscribe({
        next: (resposta: any) => {
          console.log('Login bem-sucedido!', resposta);
          localStorage.setItem('token', resposta.token);
          this.snackBar.open('Login bem-sucedido!', 'Fechar', { duration: 3000, panelClass: ['success-snackbar'] });
        },
        error: (erro: HttpErrorResponse) => {
          console.error('Erro no login', erro);
          const mensagemErro = erro.error?.mensagem || erro.error?.message || erro.error?.error || 'Erro no login';
          this.snackBar.open(mensagemErro, 'Fechar', { duration: 3000, panelClass: ['error-snackbar'] });
        }
      });
  }

  toggleSenhaVisivel() {
    this.senhaVisivel = !this.senhaVisivel;
  }
}
