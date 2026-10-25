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
