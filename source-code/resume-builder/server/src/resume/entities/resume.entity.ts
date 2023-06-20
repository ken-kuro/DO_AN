import { Basics, Metadata, Section, User } from '@reactive-resume/schema';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
@Unique(['user', 'slug'])
export class Resume {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  shortId: string;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'jsonb', default: {} })
  user: User;

  @Column({ type: 'jsonb', default: {} })
  basics: Basics;

  @Column({ type: 'jsonb', default: {} })
  sections: Partial<Record<string, Section>>;

  @Column({ type: 'jsonb', default: {} })
  metadata: Metadata;

  @Column({ default: false })
  public: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<Resume>) {
    Object.assign(this, partial);
  }
}
