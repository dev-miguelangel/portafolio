export interface Newsletter {
  id: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSummary
  extends Pick<
    Newsletter,
    'id' | 'title' | 'summary' | 'publishedAt' | 'isPublished' | 'createdAt'
  > { }

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}
