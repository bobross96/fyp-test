import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

import { Observable } from 'rxjs';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const jwtToken = localStorage.getItem('token_id');

    //cant modify url directly, must use clone. then send url in next handle
    if (jwtToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + jwtToken),
      });
      return next.handle(cloned)
    }

    else {
    return next.handle(req);
    }
}
}
