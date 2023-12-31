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
  carregando = false;

  constructor(
    private http: HttpClient,
    private titleService: TitleService,
    private snackBar: MatSnackBar
  ) {
    this.titleService.setTitle('| LOGIN');
  }

  fazerLogin(): void {
    this.enviado = true;
    if (this.formLogin.invalid || this.carregando) {
      this.exibirMensagensErro();
      return;
    }

    this.carregando = true;
    const credenciais = this.formLogin.value;

    this.http.post('http://localhost:3000/autenticacao/login', credenciais)
      .subscribe({
        next: this.processarSucessoLogin.bind(this),
        error: this.processarErroLogin.bind(this)
      });
  }

  private exibirMensagensErro() {
    const mensagensErro = this.getMensagensErro();
    this.snackBar.open(mensagensErro.join(' '), 'Fechar', {
      duration: 5000,
      panelClass: ['warning-snackbar']
    });
  }

  private getMensagensErro(): string[] {
    const email = this.formLogin.get('email');
    const senha = this.formLogin.get('senha');

    let mensagensErro = [];

    if (email?.invalid) {
      mensagensErro.push(email.errors?.['required'] ? 'Por favor, insira um email.' : 'Por favor, insira um email válido.');
    }

    if (senha?.invalid) {
      mensagensErro.push('Por favor, insira uma senha.');
    }

    if (this.carregando) {
      mensagensErro.push('Estamos enviando sua requisição, aguarde...');
    }

    if (!email?.value && !senha?.value) {
      mensagensErro = ['Verifique todos os campos obrigatórios.'];
    }

    return mensagensErro;
  }

  private processarSucessoLogin(resposta: any) {
    console.log('Login bem-sucedido!', resposta);
    localStorage.setItem('token', resposta.token);
    this.snackBar.open('Login bem-sucedido!', 'Fechar', { duration: 5000, panelClass: ['success-snackbar'] });
    this.carregando = false;
  }

  private processarErroLogin(erro: HttpErrorResponse) {
    console.error('Erro no login', erro);
    const mensagemErro = erro.error?.mensagem || erro.error?.message || erro.error?.error || 'Erro no login';
    this.snackBar.open(mensagemErro, 'Fechar', { duration: 5000, panelClass: ['error-snackbar'] });
    this.carregando = false;
  }

  toggleSenhaVisivel() {
    this.senhaVisivel = !this.senhaVisivel;
  }
}
