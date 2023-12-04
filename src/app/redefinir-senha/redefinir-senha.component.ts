import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TitleService } from '../title.service';

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.scss']
})
export class RedefinirSenhaComponent implements OnInit {
  carregando = false;
  tokenRecuperacaoSenha?: string;
  formRedefinirSenha!: FormGroup;
  senhaVisivel = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private titleService: TitleService
  ) {
    this.titleService.setTitle('| REDEFINIR SENHA');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.tokenRecuperacaoSenha = params['tokenRecuperacaoSenha'];
      if (this.tokenRecuperacaoSenha) {
        this.obterEmailAssociadoAoToken(this.tokenRecuperacaoSenha);
      }
    });

    this.formRedefinirSenha = this.formBuilder.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmacaoSenha: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: this.checarSenhas });
  }

  private obterEmailAssociadoAoToken(token: string): void {
    this.http.get<{ email: string }>(`http://localhost:3000/autenticacao/obter-email`, {
      params: { tokenRecuperacaoSenha: token }
    }).subscribe({
      next: (resposta) => {
        this.formRedefinirSenha.get('email')?.setValue(resposta.email);
        this.formRedefinirSenha.get('email')?.disable();
      },
      error: (erro) => {
        this.snackBar.open(erro.error.message || 'Não foi possível recuperar o e-mail.', 'Fechar', { duration: 5000 });
        this.router.navigate(['/solicitar-recuperacao-senha']);
      }
    });
  }

  onSubmit(): void {
    this.formRedefinirSenha.get('email')?.enable();

    if (!this.formRedefinirSenha.valid || !this.tokenRecuperacaoSenha) {
      this.snackBar.open('Por favor, preencha todos os campos corretamente.', 'Fechar', { duration: 5000 });
      this.formRedefinirSenha.get('email')?.disable();
      return;
    }

    this.carregando = true;
    const email = this.formRedefinirSenha.get('email')?.value;
    const novaSenha = this.formRedefinirSenha.get('novaSenha')?.value;
    const confirmacaoSenha = this.formRedefinirSenha.get('confirmacaoSenha')?.value;

    const payload = {
      email,
      novaSenha,
      confirmacaoSenha
    };
    this.http.post<{ mensagem: string }>(`http://localhost:3000/autenticacao/redefinir-senha`, payload, {
      params: { tokenRecuperacaoSenha: this.tokenRecuperacaoSenha }
    }).subscribe({
      next: (resposta) => {
        this.snackBar.open(resposta.mensagem, 'Fechar', { duration: 5000 });
        this.router.navigate(['/login']);
      },
      error: (erro) => {
        this.snackBar.open(erro.error.message || 'Erro ao redefinir senha.', 'Fechar', { duration: 5000 });
        this.carregando = false;
      }
    });

    this.formRedefinirSenha.get('email')?.disable();
  }


  private checarSenhas(group: FormGroup) {
    const novaSenha = group.controls['novaSenha'].value;
    const confirmacaoSenha = group.controls['confirmacaoSenha'].value;

    if (novaSenha && confirmacaoSenha && novaSenha !== confirmacaoSenha) {
      group.controls['confirmacaoSenha'].setErrors({ notSame: true });
    } else {
      group.controls['confirmacaoSenha'].setErrors(null);
    }
  }

  toggleSenhaVisivel(): void {
    this.senhaVisivel = !this.senhaVisivel;
  }
}
