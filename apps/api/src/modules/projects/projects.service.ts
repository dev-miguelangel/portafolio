import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly repo: Repository<Project>,
  ) { }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: Project[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.repo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findAllPublished(
    page: number,
    limit: number,
  ): Promise<{ data: Project[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.repo.findAndCount({
      where: { isPublished: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.repo.findOne({ where: { id } });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async create(dto: CreateProjectDto): Promise<Project> {
    const project = this.repo.create({
      ...dto,
      isPublished: dto.isPublished ?? false,
    });
    return this.repo.save(project);
  }

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, dto);
    return this.repo.save(project);
  }

  async togglePublish(id: string): Promise<Project> {
    const project = await this.findOne(id);
    project.isPublished = !project.isPublished;
    return this.repo.save(project);
  }
}
