import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Newsletter } from './entities/newsletter.entity';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(Newsletter)
    private readonly repo: Repository<Newsletter>,
  ) {}

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: Newsletter[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.repo.findAndCount({
      select: ['id', 'title', 'summary', 'publishedAt', 'createdAt'],
      where: { publishedAt: undefined },
      order: { publishedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findAllPublished(page: number, limit: number) {
    const [data, total] = await this.repo
      .createQueryBuilder('n')
      .select(['n.id', 'n.title', 'n.summary', 'n.publishedAt', 'n.createdAt'])
      .where('n.publishedAt IS NOT NULL')
      .orderBy('n.publishedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Newsletter> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Newsletter ${id} not found`);
    return item;
  }

  async create(dto: CreateNewsletterDto): Promise<Newsletter> {
    const item = this.repo.create({
      ...dto,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
    });
    return this.repo.save(item);
  }

  async update(id: string, dto: UpdateNewsletterDto): Promise<Newsletter> {
    const item = await this.findOne(id);
    Object.assign(item, {
      ...dto,
      publishedAt: dto.publishedAt !== undefined
        ? (dto.publishedAt ? new Date(dto.publishedAt) : null)
        : item.publishedAt,
    });
    return this.repo.save(item);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.repo.remove(item);
  }
}
