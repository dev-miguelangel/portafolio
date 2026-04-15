import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ProjectStatus = 'idea' | 'demo' | 'production';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', default: 'idea' })
  status: ProjectStatus;

  @Column({ type: 'simple-array', default: '' })
  tags: string[];

  @Column({ nullable: true, type: 'varchar' })
  demoUrl: string | null;

  @Column({ nullable: true, type: 'varchar' })
  productionUrl: string | null;

  @Column({ nullable: true, type: 'varchar' })
  imageUrl: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
