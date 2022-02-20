import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { filter, tap } from 'rxjs/operators';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: any
  ): Observable<HttpEvent<unknown>> {
    request = request.clone({
      withCredentials: true,
    });
    return next.handle(request).pipe(
      filter((event) => event instanceof HttpResponse),
      tap((event: any) => {
        if (event.message && event.message === 'Unauthorized') {
          console.log('token expired');
          this.authService.logout();
        }
      })
    );
  }
}
