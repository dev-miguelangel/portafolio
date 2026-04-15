import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project, ProjectSummary } from '../models/project.model';
import { PaginatedResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly base = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 12): Observable<PaginatedResponse<ProjectSummary>> {
    return this.http.get<PaginatedResponse<ProjectSummary>>(this.base, {
      params: { page, limit },
    });
  }

  getById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.base}/${id}`);
  }

  create(payload: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(this.base, payload);
  }

  update(id: string, payload: Partial<Project>): Observable<Project> {
    return this.http.patch<Project>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
