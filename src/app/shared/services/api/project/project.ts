import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  tech_stack: string[];
  github_repo: string | null;
  github_branch: string;
  live_url: string | null;
  cover_image_url: string | null;
  readme_content: string | null;
  readme_sha: string | null;
  readme_synced_at: string | null;
  ai_extra_context: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreatePayload {
  title: string;
  slug?: string;
  short_description: string;
  tech_stack: string[];
  github_repo?: string | null;
  github_branch?: string;
  live_url?: string | null;
  cover_image_url?: string | null;
  ai_extra_context?: string | null;
  is_published?: boolean;
}

export interface ProjectUpdatePayload {
  title?: string;
  slug?: string;
  short_description?: string;
  tech_stack?: string[];
  github_repo?: string | null;
  github_branch?: string;
  live_url?: string | null;
  cover_image_url?: string | null;
  readme_content?: string | null;
  ai_extra_context?: string | null;
  is_published?: boolean;
}

export interface SyncReadmeResponse {
  project: Project;
  updated: boolean;
  message: string;
}

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
