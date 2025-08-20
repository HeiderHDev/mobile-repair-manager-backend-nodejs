import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { RepairEntity } from './repair.entity';

export enum PhoneCondition {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  DAMAGED = 'damaged'
}

@Entity('phones')
export class PhoneEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  customerId!: string;

  @Column({ length: 50 })
  brand!: string;

  @Column({ length: 100 })
  model!: string;

  @Column({ unique: true, length: 15 })
  imei!: string;

  @Column({ length: 30, nullable: true })
  color?: string;

  @Column({ nullable: true })
  purchaseDate?: Date;

  @Column({ nullable: true })
  warrantyExpiry?: Date;

  @Column({
    type: 'enum',
    enum: PhoneCondition,
    default: PhoneCondition.GOOD
  })
  condition!: PhoneCondition;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => CustomerEntity, customer => customer.phones)
  @JoinColumn({ name: 'customerId' })
  customer!: CustomerEntity;

  @OneToMany(() => RepairEntity, repair => repair.phone)
  repairs!: RepairEntity[];
}