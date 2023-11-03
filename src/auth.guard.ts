import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import notie from 'notie';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        const token = localStorage.getItem('token');
        const isAdmin = this.checandoSeEadmin(token);

        if (token && isAdmin) {
            return true;
        } else {
            notie.alert({ type: 'error', text: 'Acesso negado. Você precisa estar autenticado como administrador.' });
            this.router.navigate(['/']);
            return false;
        }
    }

    private checandoSeEadmin(token: string | null): boolean {
        if (!token) {
            return false;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload && payload.cargo === 'admin';
        } catch (err) {
            return false;
        }
    }
}