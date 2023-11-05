import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TitleService } from '../title.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  formRegistro!: FormGroup;
  enviado = false;
  carregando = false;
  senhaVisivel = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private titleService: TitleService
  ) {
    this.titleService.setTitle('- REGISTRO');
  }

  ngOnInit(): void {
    this.formRegistro = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      confirmarSenha: ['', Validators.required],
      cartaoID: ['', Validators.required],
      whats: ['', Validators.required],
    }, {
      validators: this.senhasCoincidem('senha', 'confirmarSenha')
    });

    this.formRegistro.get('confirmarSenha')?.valueChanges.subscribe(() => {
      this.verificarSenhas();
    });

    this.formRegistro.get('senha')?.valueChanges.subscribe(() => {
      this.verificarSenhas();
    });
  }

  verificarSenhas() {
    if (this.f['senha'].value !== this.f['confirmarSenha'].value && this.f['confirmarSenha'].value !== '') {
      this.snackBar.open('As senhas não coincidem.', 'Fechar', { duration: 1500 });
    }
  }

  senhasCoincidem(senha: string, confirmarSenha: string) {
    return (formGroup: FormGroup) => {
      const senhaControl = formGroup.controls[senha];
      const confirmarSenhaControl = formGroup.controls[confirmarSenha];
      if (senhaControl.value !== confirmarSenhaControl.value) {
        confirmarSenhaControl.setErrors({ naoCoincide: true });
      }
    };
  }

  get f() { return this.formRegistro.controls; }

  onSubmit() {
    this.enviado = true;

    if (this.formRegistro.invalid) {
      this.snackBar.open('Verifique todos os campos obrigatórios.', 'Fechar', { duration: 5000 });
      return;
    }

    if (this.carregando) {
      return;
    }

    this.carregando = true;

    const dadosRegistro = {
      nome: this.f['nome'].value,
      email: this.f['email'].value,
      senha: this.f['senha'].value,
      cartaoID: this.f['cartaoID'].value,
      whats: this.f['whats'].value,
    };

    this.http.post('http://localhost:3000/autenticacao/registro', dadosRegistro)
      .subscribe({
        next: data => {
          this.snackBar.open('Registro bem-sucedido!', 'Fechar', { duration: 5000 });
          this.router.navigate(['/login']);
        },
        error: error => {
          this.snackBar.open('Erro no registro. Por favor, tente novamente.', 'Fechar', { duration: 5000 });
          this.carregando = false;
        }
      });
  }
}
