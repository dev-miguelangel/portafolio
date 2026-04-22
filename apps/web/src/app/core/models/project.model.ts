export type ProjectStatus = 'idea' | 'demo' | 'production';

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  tags: string[];
  demoUrl: string | null;
  productionUrl: string | null;
  imageUrl: string | null;
  projectHtml: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSummary
  extends Pick<
    Project,
    | 'id'
    | 'title'
    | 'description'
    | 'status'
    | 'tags'
    | 'demoUrl'
    | 'productionUrl'
    | 'imageUrl'
    | 'projectHtml'
  > { }
