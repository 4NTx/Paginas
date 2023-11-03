import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TitleService } from '../title.service';
import notie from 'notie';

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
  constructor(private http: HttpClient, private titleService: TitleService) {
    this.titleService.setTitle("- Login");
  }

  fazerLogin(): void {
    this.enviado = true;

    if (this.formLogin.invalid) {
      return;
    }
    if (this.formLogin.valid) {
      const credenciais = this.formLogin.value;
      this.http.post('http://localhost:3000/autenticacao/login', credenciais)
        .subscribe({
          next: (resposta: any) => {
            console.log('Login bem-sucedido!', resposta);
            localStorage.setItem('token', resposta.token);
            notie.alert({ type: 'success', text: 'Login bem-sucedido!' });
          },
          error: (erro: HttpErrorResponse) => {
            console.error('Erro no login', erro);
            const mensagemErro = erro.error?.mensagem || erro.error?.message || erro.error?.error || 'Erro no login';
            notie.alert({ type: 'error', text: mensagemErro });
          }
        });
    } else {
      if (this.formLogin.get('email')?.invalid) {
        notie.alert({ type: 'warning', text: 'Por favor, insira um email válido.' });
      }
      if (this.formLogin.get('senha')?.invalid) {
        notie.alert({ type: 'warning', text: 'Por favor, insira uma senha.' });
      }
    }
  }

  toggleSenhaVisivel() {
    this.senhaVisivel = !this.senhaVisivel;
  }
}
