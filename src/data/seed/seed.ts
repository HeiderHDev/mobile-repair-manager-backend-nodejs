import { envs } from '../../config';
import { MySQLDatabase } from '../mysql/mysql-database';
import { UserEntity, UserRole } from '../mysql/entities/user.entity';
import { bcryptAdapter } from '../../config';

(async () => {
  await MySQLDatabase.connect({
    host: envs.DB_HOST,
    port: envs.DB_PORT,
    username: envs.DB_USERNAME,
    password: envs.DB_PASSWORD,
    database: envs.DB_DATABASE,
  });

  await main();

  await MySQLDatabase.disconnect();
})();

async function main() {

  console.log('🌱 Starting database seeding...');

  const userRepository = MySQLDatabase.connection.getRepository(UserEntity);

  await userRepository.clear();

  const superAdmin = new UserEntity();
  superAdmin.username = 'superadmin';
  superAdmin.email = 'superadmin@repairshop.com';
  superAdmin.fullName = 'Super Administrador';
  superAdmin.password = bcryptAdapter.hash('admin123');
  superAdmin.role = UserRole.SUPER_ADMIN;
  superAdmin.isActive = true;

  await userRepository.save(superAdmin);
  console.log('👤 Super Admin created: superadmin / admin123');

  const users = [
    {
      username: 'admin1',
      email: 'admin1@repairshop.com',
      fullName: 'Juan Pérez',
      password: bcryptAdapter.hash('admin123'),
      role: UserRole.ADMIN,
      isActive: true,
    },
    {
      username: 'admin2',
      email: 'admin2@repairshop.com',
      fullName: 'María García',
      password: bcryptAdapter.hash('admin123'),
      role: UserRole.ADMIN,
      isActive: true,
    },
    {
      username: 'admin3',
      email: 'admin3@repairshop.com',
      fullName: 'Carlos Rodriguez',
      password: bcryptAdapter.hash('admin123'),
      role: UserRole.ADMIN,
      isActive: false,
    }
  ];

  const savedUsers = [];
  for (const userData of users) {
    const user = new UserEntity();
    Object.assign(user, userData);
    const savedUser = await userRepository.save(user);
    savedUsers.push(savedUser);
  }

  console.log(`👥 Created ${savedUsers.length} admin users`);
  console.log('✅ Database seeding completed!');
  console.log('');
  console.log('🔑 Login credentials:');
  console.log('   Super Admin: superadmin / admin123');
  console.log('   Admin 1: admin1 / admin123');
  console.log('   Admin 2: admin2 / admin123');
  console.log('   Admin 3: admin3 / admin123 (inactive)');
}