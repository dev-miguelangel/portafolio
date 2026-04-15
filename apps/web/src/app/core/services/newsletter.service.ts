import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Newsletter, NewsletterSummary, Subscriber } from '../models/newsletter.model';
import { PaginatedResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  private readonly base = `${environment.apiUrl}/newsletters`;
  private readonly subscribersBase = `${environment.apiUrl}/subscribers`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 10): Observable<PaginatedResponse<NewsletterSummary>> {
    return this.http.get<PaginatedResponse<NewsletterSummary>>(this.base, {
      params: { page, limit },
    });
  }

  getById(id: string): Observable<Newsletter> {
    return this.http.get<Newsletter>(`${this.base}/${id}`);
  }

  create(payload: Partial<Newsletter>): Observable<Newsletter> {
    return this.http.post<Newsletter>(this.base, payload);
  }

  update(id: string, payload: Partial<Newsletter>): Observable<Newsletter> {
    return this.http.patch<Newsletter>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  subscribe(email: string): Observable<void> {
    return this.http.post<void>(this.subscribersBase, { email });
  }

  getSubscribers(): Observable<Subscriber[]> {
    return this.http.get<Subscriber[]>(this.subscribersBase);
  }
}
