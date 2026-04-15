import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from './entities/subscriber.entity';
import { SubscribeDto } from './dto/subscribe.dto';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly repo: Repository<Subscriber>,
  ) {}

  async subscribe(dto: SubscribeDto): Promise<void> {
    const existing = await this.repo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already subscribed');

    const subscriber = this.repo.create(dto);
    await this.repo.save(subscriber);
  }

  findAll(): Promise<Subscriber[]> {
    return this.repo.find({ order: { subscribedAt: 'DESC' } });
  }
}
