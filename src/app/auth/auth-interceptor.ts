import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{


    constructor(private authService: AuthService){

    }

    // Le contrat de cette interface est l'implémentation de la methode
    // intercept car Angular va appeler cette methode
    // Avec comme premier argument 'req' => qui est la request qu'on veut intercepter
    // Cette méthode fonctionne comme un middleware en Node JS
    intercept(req: HttpRequest<any>, next: HttpHandler){
        const authToken = this.authService.getToken();
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', "Bearer " +authToken)
        });
        return next.handle(authRequest);
    }
}