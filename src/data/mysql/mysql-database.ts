import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { envs } from '../../config/envs';

// Importar entidades
import { UserEntity } from './entities/user.entity';
import { CustomerEntity } from './entities/customer.entity';
import { PhoneEntity } from './entities/phone.entity';
import { RepairEntity } from './entities/repair.entity';

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
        
        // Configuración para desarrollo
        synchronize: envs.NODE_ENV === 'development', // Solo en desarrollo
        logging: envs.NODE_ENV === 'development',
        
        // Entidades
        entities: [
          UserEntity,
          CustomerEntity,
          PhoneEntity,
          RepairEntity
        ],
        
        // Migraciones
        migrations: ['src/data/migrations/*.ts'],
        
        // Configuración adicional
        extra: {
          charset: 'utf8mb4_unicode_ci',
        },
        
        // Configuración de pool de conexiones
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