import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { RecuperarSenhaComponent } from './recuperar-senha/recuperar-senha.component';
import { RedefinirSenhaComponent } from './redefinir-senha/redefinir-senha.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'recuperar-senha', component: RecuperarSenhaComponent },
  { path: 'redefinir-senha', component: RedefinirSenhaComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
