import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TitleService } from '../title.service';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss']
})
export class RecuperarSenhaComponent implements OnInit {
  formRecuperarSenha!: FormGroup;
  enviado = false;
  carregando = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private titleService: TitleService
  ) {
    this.titleService.setTitle('- RECUPERAÇÃO DE SENHA');
  }

  ngOnInit(): void {
    this.formRecuperarSenha = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() { return this.formRecuperarSenha.controls; }

  onSubmit() {
    this.enviado = true;

    if (this.formRecuperarSenha.invalid) {
      this.snackBar.open('Por favor, insira um e-mail válido.', 'Fechar', { duration: 5000 });
      return;
    }

    if (this.carregando) {
      return;
    }

    this.carregando = true;

    const dadosRecuperacao = {
      email: this.f['email'].value,
    };

    this.http.post('http://localhost:3000/autenticacao/solicitar-recuperacao-senha', dadosRecuperacao)
      .subscribe({
        next: data => {
          this.snackBar.open('Instruções de recuperação de senha enviadas para o e-mail informado.', 'Fechar', { duration: 5000 });
        },
        error: (erro: HttpErrorResponse) => {
          console.error('Erro no envio', erro);
          const mensagemErro = erro.error?.mensagem || erro.error?.message || erro.error?.error || 'Erro no registro';
          this.snackBar.open(mensagemErro, 'Fechar', { duration: 5000, panelClass: ['error-snackbar'] });
          this.carregando = false;
        }
      });
  }

}