import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PhoneEntity } from './phone.entity';

export enum DocumentType {
  CC = 'cc',
  CE = 'ce',
  PASSPORT = 'passport',
  NIT = 'nit'
}

@Entity('customers')
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  firstName!: string;

  @Column({ length: 100 })
  lastName!: string;

  @Column({ unique: true, length: 150 })
  email!: string;

  @Column({ length: 20 })
  phone!: string;

  @Column({ length: 255, nullable: true })
  address?: string;

  @Column({
    type: 'enum',
    enum: DocumentType
  })
  documentType!: DocumentType;

  @Column({ unique: true, length: 50 })
  documentNumber!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => PhoneEntity, phone => phone.customer)
  phones!: PhoneEntity[];
}