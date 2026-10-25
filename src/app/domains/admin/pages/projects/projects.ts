import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { Project } from '@shared/models/project.model';
import { ProjectApi } from '@shared/services/api/project/project';

@Component({
  selector: 'app-projects',
  imports: [
    DatePipe,
    FormsModule,
    ButtonModule,
    CardModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    TagModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './projects.html',
})
export class Projects implements OnInit {
  readonly projectApi = inject(ProjectApi);
  private readonly router = inject(Router);

  readonly isCreateModalOpen = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  // Campos del formulario de creación
  title = '';
  shortDescription = '';
  githubRepo = '';
  githubBranch = 'main';
  techStackInput = '';
  liveUrl = '';

  async ngOnInit(): Promise<void> {
    await this.projectApi.getAll();
  }

  openCreateModal(): void {
    this.title = '';
    this.shortDescription = '';
    this.githubRepo = '';
    this.githubBranch = 'main';
    this.techStackInput = '';
    this.liveUrl = '';
    this.errorMessage.set(null);
    this.isCreateModalOpen.set(true);
  }

  openProjectDetail(project: Project): void {
    this.router.navigate(['/admin/projects', project.id]);
  }

  async createProject(): Promise<void> {
    if (!this.title.trim() || !this.shortDescription.trim()) {
      this.errorMessage.set('El título y la descripción corta son obligatorios.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const techStack = this.techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const created = await this.projectApi.create({
        title: this.title.trim(),
        short_description: this.shortDescription.trim(),
        github_repo: this.githubRepo.trim() || null,
        github_branch: this.githubBranch.trim() || 'main',
        tech_stack: techStack,
        live_url: this.liveUrl.trim() || null,
        is_published: true,
      });
      this.isCreateModalOpen.set(false);
      await this.router.navigate(['/admin/projects', created.id]);
    } catch (err: any) {
      this.errorMessage.set(
        err?.error?.detail ?? 'Ocurrió un error al crear el proyecto. Verifica los datos.',
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
