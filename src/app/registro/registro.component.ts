import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'; // Importe HttpHeaders
import { FormGroup, FormControl, Validators } from '@angular/forms';
import notie from 'notie';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  formRegistro = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required]),
    nome: new FormControl('', [Validators.required]),
    cartaoID: new FormControl('', [Validators.required]),
    whats: new FormControl('', [Validators.required])
  });

  senhaVisivel = false;

  constructor(private http: HttpClient) { }

  registrar() {
    if (this.formRegistro.valid) {
      const dados = this.formRegistro.value;

      const jwtToken = localStorage.getItem('token');

      if (jwtToken) {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${jwtToken}`
        });

        this.http.post('http://localhost:3000/autenticacao/registro', dados, { headers })
          .subscribe({
            next: () => {
              notie.alert({ type: 'success', text: 'Registro bem-sucedido!' });
            },
            error: (erro: HttpErrorResponse) => {
              const mensagemErro = erro.error?.mensagem || erro.error?.message || erro.error?.error || 'Erro no registro';
              notie.alert({ type: 'error', text: mensagemErro });
            }
          });
      } else {
        notie.alert({ type: 'warning', text: 'Você precisa estar autenticado para registrar um usuário.' });
      }
    } else {
      notie.alert({ type: 'warning', text: 'Por favor, preencha todos os campos corretamente.' });
    }
  }

  toggleSenhaVisivel() {
    this.senhaVisivel = !this.senhaVisivel;
  }
}
