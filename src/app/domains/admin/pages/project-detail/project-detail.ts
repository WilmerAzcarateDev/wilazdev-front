import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Project } from '@shared/models/project.model';
import { ProjectApi } from '@shared/services/api/project/project';

@Component({
  selector: 'app-project-detail',
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    InputTextModule,
    TextareaModule,
    TabsModule,
    TagModule,
    ToggleSwitchModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './project-detail.html',
})
export class ProjectDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectApi = inject(ProjectApi);

  readonly project = signal<Project | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly isSaving = signal<boolean>(false);
  readonly isSyncingReadme = signal<boolean>(false);
  readonly isDeleting = signal<boolean>(false);

  readonly feedbackMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  // Campos editables (Tab 1: General)
  title = '';
  slug = '';
  shortDescription = '';
  techStackInput = '';
  githubRepo = '';
  githubBranch = 'main';
  liveUrl = '';
  coverImageUrl = '';

  // Campo editable (Tab 2: Contexto IA)
  aiExtraContext = '';

  // Campos editables (Tab 3: Configuración y Borrado)
  isPublished = true;
  readonly deleteConfirmationInput = signal<string>('');

  readonly canConfirmDelete = computed(() => {
    const current = this.project();
    if (!current) return false;
    return this.deleteConfirmationInput().trim() === current.title.trim();
  });

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      await this.router.navigate(['/admin/projects']);
      return;
    }
    await this.loadProject(id);
  }

  private async loadProject(id: string): Promise<void> {
    this.isLoading.set(true);
    try {
      const data = await this.projectApi.getById(id);
      this.applyProjectToForm(data);
    } catch {
      await this.router.navigate(['/admin/projects']);
    } finally {
      this.isLoading.set(false);
    }
  }

  private applyProjectToForm(data: Project): void {
    this.project.set(data);
    this.title = data.title;
    this.slug = data.slug;
    this.shortDescription = data.short_description;
    this.techStackInput = (data.tech_stack ?? []).join(', ');
    this.githubRepo = data.github_repo ?? '';
    this.githubBranch = data.github_branch ?? 'main';
    this.liveUrl = data.live_url ?? '';
    this.coverImageUrl = data.cover_image_url ?? '';
    this.aiExtraContext = data.ai_extra_context ?? '';
    this.isPublished = data.is_published;
  }

  async saveGeneralInfo(): Promise<void> {
    const current = this.project();
    if (!current) return;

    this.isSaving.set(true);
    this.feedbackMessage.set(null);

    const techStack = this.techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const updated = await this.projectApi.update(current.id, {
        title: this.title.trim(),
        slug: this.slug.trim(),
        short_description: this.shortDescription.trim(),
        tech_stack: techStack,
        github_repo: this.githubRepo.trim() || null,
        github_branch: this.githubBranch.trim() || 'main',
        live_url: this.liveUrl.trim() || null,
        cover_image_url: this.coverImageUrl.trim() || null,
      });
      this.applyProjectToForm(updated);
      this.feedbackMessage.set({
        type: 'success',
        text: 'Información general del proyecto actualizada correctamente.',
      });
    } catch (err: any) {
      this.feedbackMessage.set({
        type: 'error',
        text: err?.error?.detail ?? 'Error al guardar los cambios del proyecto.',
      });
    } finally {
      this.isSaving.set(false);
    }
  }

  async syncGithubReadme(): Promise<void> {
    const current = this.project();
    if (!current) return;

    this.isSyncingReadme.set(true);
    this.feedbackMessage.set(null);

    try {
      const res = await this.projectApi.syncReadme(current.id);
      this.applyProjectToForm(res.project);
      this.feedbackMessage.set({
        type: 'success',
        text: res.message,
      });
    } catch (err: any) {
      this.feedbackMessage.set({
        type: 'error',
        text: err?.error?.detail ?? 'No fue posible sincronizar el README desde GitHub.',
      });
    } finally {
      this.isSyncingReadme.set(false);
    }
  }

  async saveAiContext(): Promise<void> {
    const current = this.project();
    if (!current) return;

    this.isSaving.set(true);
    this.feedbackMessage.set(null);

    try {
      const updated = await this.projectApi.update(current.id, {
        ai_extra_context: this.aiExtraContext.trim() || null,
      });
      this.applyProjectToForm(updated);
      this.feedbackMessage.set({
        type: 'success',
        text: 'Contexto adicional para la IA guardado correctamente.',
      });
    } catch (err: any) {
      this.feedbackMessage.set({
        type: 'error',
        text: err?.error?.detail ?? 'Error al guardar el contexto de IA.',
      });
    } finally {
      this.isSaving.set(false);
    }
  }

  async togglePublished(): Promise<void> {
    const current = this.project();
    if (!current) return;

    this.isSaving.set(true);
    this.feedbackMessage.set(null);

    try {
      const updated = await this.projectApi.update(current.id, {
        is_published: this.isPublished,
      });
      this.applyProjectToForm(updated);
      this.feedbackMessage.set({
        type: 'success',
        text: updated.is_published
          ? 'El proyecto ahora está publicado.'
          : 'El proyecto pasó a estado borrador.',
      });
    } catch (err: any) {
      this.feedbackMessage.set({
        type: 'error',
        text: err?.error?.detail ?? 'No se pudo cambiar la visibilidad del proyecto.',
      });
    } finally {
      this.isSaving.set(false);
    }
  }

  async confirmDeleteProject(): Promise<void> {
    const current = this.project();
    if (!current || !this.canConfirmDelete()) return;

    this.isDeleting.set(true);
    try {
      await this.projectApi.delete(current.id);
      await this.router.navigate(['/admin/projects']);
    } catch (err: any) {
      this.feedbackMessage.set({
        type: 'error',
        text: err?.error?.detail ?? 'No fue posible eliminar el proyecto.',
      });
      this.isDeleting.set(false);
    }
  }
}
