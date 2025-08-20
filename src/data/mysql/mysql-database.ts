import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { envs } from '../../config/envs';

import { UserEntity } from './entities/user.entity';

interface Options {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export class MySQLDatabase {
  
  private static dataSource: DataSource;

  static async connect(options: Options): Promise<boolean> {
    const { host, port, username, password, database } = options;

    try {
      this.dataSource = new DataSource({
        type: 'mysql',
        host,
        port,
        username,
        password,
        database,
        
        synchronize: envs.NODE_ENV === 'development',
        logging: envs.NODE_ENV === 'development',
        
        entities: [
          UserEntity
        ],
        
        migrations: ['src/data/migrations/*.ts'],
        
        extra: {
          charset: 'utf8mb4_unicode_ci',
        },
        
        poolSize: 10,
        acquireTimeout: 60000,
        connectTimeout: 60000,
      });

      await this.dataSource.initialize();
      console.log('✅ MySQL Database connected successfully');
      
      return true;

    } catch (error) {
      console.error('❌ MySQL connection error:', error);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    try {
      if (this.dataSource && this.dataSource.isInitialized) {
        await this.dataSource.destroy();
        console.log('✅ MySQL Database disconnected successfully');
      }
    } catch (error) {
      console.error('❌ Error disconnecting from MySQL:', error);
      throw error;
    }
  }

  static get connection(): DataSource {
    if (!this.dataSource || !this.dataSource.isInitialized) {
      throw new Error('Database not initialized. Call connect() first.');
    }
    return this.dataSource;
  }
}