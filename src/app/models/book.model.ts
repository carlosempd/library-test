export interface Book {
  id: number;
  title: string;
  authorId: number;
  description: string;
  published: boolean;
  yearPublished: number;
  registeredAt: Date;
}
