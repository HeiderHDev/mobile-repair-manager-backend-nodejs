import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { PhoneEntity } from './phone.entity';
    
export enum RepairStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  WAITING_PARTS = 'waiting_parts',
  WAITING_CLIENT = 'waiting_client',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DELIVERED = 'delivered'
}

export enum RepairPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

@Entity('repairs')
export class RepairEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  phoneId!: string;

  @Column()
  customerId!: string;

  @Column({ length: 255 })
  issue!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({
    type: 'enum',
    enum: RepairStatus,
    default: RepairStatus.PENDING
  })
  status!: RepairStatus;

  @Column({
    type: 'enum',
    enum: RepairPriority,
    default: RepairPriority.MEDIUM
  })
  priority!: RepairPriority;

  @Column('decimal', { precision: 12, scale: 2 })
  estimatedCost!: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  finalCost?: number;

  @Column('decimal', { precision: 5, scale: 2 })
  estimatedDuration!: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  actualDuration?: number;

  @Column()
  startDate!: Date;

  @Column()
  estimatedCompletionDate!: Date;

  @Column({ nullable: true })
  completionDate?: Date;

  @Column({ type: 'text', nullable: true })
  technicianNotes?: string;

  @Column({ type: 'text', nullable: true })
  clientNotes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => PhoneEntity, phone => phone.repairs)
  @JoinColumn({ name: 'phoneId' })
  phone!: PhoneEntity;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customerId' })
  customer!: CustomerEntity;
}