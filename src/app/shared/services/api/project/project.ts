import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  Project,
  ProjectCreatePayload,
  ProjectUpdatePayload,
  SyncReadmeResponse,
} from '@shared/models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectApi {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/projects';

  readonly projects = signal<Project[]>([]);
  readonly isLoading = signal<boolean>(false);

  async getAll(): Promise<Project[]> {
    this.isLoading.set(true);
    try {
      const items = await firstValueFrom(this.http.get<Project[]>(this.url));
      this.projects.set(items);
      return items;
    } finally {
      this.isLoading.set(false);
    }
  }

  async getById(id: string): Promise<Project> {
    return firstValueFrom(this.http.get<Project>(`${this.url}/${id}`));
  }

  async create(payload: ProjectCreatePayload): Promise<Project> {
    const created = await firstValueFrom(this.http.post<Project>(this.url, payload));
    this.projects.update((prev) => [created, ...prev]);
    return created;
  }

  async update(id: string, payload: ProjectUpdatePayload): Promise<Project> {
    const updated = await firstValueFrom(this.http.patch<Project>(`${this.url}/${id}`, payload));
    this.projects.update((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.url}/${id}`));
    this.projects.update((prev) => prev.filter((item) => item.id !== id));
  }

  async syncReadme(id: string): Promise<SyncReadmeResponse> {
    const response = await firstValueFrom(
      this.http.post<SyncReadmeResponse>(`${this.url}/${id}/sync-readme`, {}),
    );
    this.projects.update((prev) =>
      prev.map((item) => (item.id === id ? response.project : item)),
    );
    return response;
  }
}
