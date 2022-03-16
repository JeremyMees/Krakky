import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { environment } from 'src/environments/environment';
import { ContactMail } from '../models/contact-mail.model';
import { ForgotMail } from '../models/forgot-mail.model';
import { WelcomeMail } from '../models/welcome-mail.model';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  constructor(private http: HttpClient) {}

  public onSendVerifyEmail(mail: WelcomeMail): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `${environment.base_url}/mail/welcome`,
      mail
    );
  }

  public onSendContactEmail(mail: ContactMail): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `${environment.base_url}/mail/contact`,
      mail
    );
  }

  public onSendForgetEmail(mail: ForgotMail): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `${environment.base_url}/mail/forgot`,
      mail
    );
  }
}
