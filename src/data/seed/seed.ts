import { envs } from '../../config';
import { MySQLDatabase } from '../mysql/mysql-database';
import { UserEntity, UserRole } from '../mysql/entities/user.entity';
import { CustomerEntity, DocumentType } from '../mysql/entities/customer.entity';
import { PhoneEntity, PhoneCondition } from '../mysql/entities/phone.entity';
import { RepairEntity, RepairStatus, RepairPriority } from '../mysql/entities/repair.entity';
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
  console.log('🌱 Starting comprehensive database seeding...');

  // Obtener repositorios
  const userRepository = MySQLDatabase.connection.getRepository(UserEntity);
  const customerRepository = MySQLDatabase.connection.getRepository(CustomerEntity);
  const phoneRepository = MySQLDatabase.connection.getRepository(PhoneEntity);
  const repairRepository = MySQLDatabase.connection.getRepository(RepairEntity);

  // 0. Limpiar todas las tablas (orden importante por FK)
  await repairRepository.clear();
  await phoneRepository.clear();
  await customerRepository.clear();
  await userRepository.clear();
  console.log('🗑️  All tables cleared');

  // 1. Crear usuarios
  const superAdmin = new UserEntity();
  superAdmin.username = 'superadmin';
  superAdmin.email = 'superadmin@repairshop.com';
  superAdmin.fullName = 'Super Administrador';
  superAdmin.password = bcryptAdapter.hash('admin123');
  superAdmin.role = UserRole.SUPER_ADMIN;
  superAdmin.isActive = true;

  const admin1 = new UserEntity();
  admin1.username = 'admin1';
  admin1.email = 'admin1@repairshop.com';
  admin1.fullName = 'Juan Carlos Técnico';
  admin1.password = bcryptAdapter.hash('admin123');
  admin1.role = UserRole.ADMIN;
  admin1.isActive = true;

  const savedUsers = await userRepository.save([superAdmin, admin1]);
  console.log(`👤 Created ${savedUsers.length} users`);

  // 2. Crear clientes
  const customersData = [
    {
      firstName: 'Juan Carlos',
      lastName: 'Pérez García',
      email: 'juan.perez@email.com',
      phone: '+57 300 123 4567',
      address: 'Calle 15 #23-45, Bucaramanga',
      documentType: DocumentType.CC,
      documentNumber: '1098765432',
      isActive: true,
      notes: 'Cliente frecuente, prefiere reparaciones rápidas'
    },
    {
      firstName: 'María Elena',
      lastName: 'Rodríguez Martínez',
      email: 'maria.rodriguez@email.com',
      phone: '+57 301 987 6543',
      address: 'Carrera 27 #45-67, Bucaramanga',
      documentType: DocumentType.CC,
      documentNumber: '1087654321',
      isActive: true,
      notes: 'Empresaria, tiene varios dispositivos'
    },
    {
      firstName: 'Carlos Alberto',
      lastName: 'González López',
      email: 'carlos.gonzalez@email.com',
      phone: '+57 302 456 7890',
      address: 'Avenida 33 #12-34, Floridablanca',
      documentType: DocumentType.CE,
      documentNumber: 'CE123456789',
      isActive: false,
      notes: 'Cliente internacional, comunicación en inglés'
    },
    {
      firstName: 'Ana Sofía',
      lastName: 'Hernández Ruiz',
      email: 'ana.hernandez@email.com',
      phone: '+57 303 789 0123',
      address: 'Calle 42 #18-25, Girón',
      documentType: DocumentType.CC,
      documentNumber: '1076543210',
      isActive: true,
      notes: 'Estudiante universitaria, cuidadosa con sus dispositivos'
    },
    {
      firstName: 'Roberto',
      lastName: 'Mendoza Silva',
      email: 'roberto.mendoza@email.com',
      phone: '+57 304 555 1234',
      address: 'Carrera 35 #67-89, Piedecuesta',
      documentType: DocumentType.CC,
      documentNumber: '1065432109',
      isActive: true,
      notes: 'Ingeniero, conoce bien de tecnología'
    }
  ];

  const savedCustomers = [];
  for (const customerData of customersData) {
    const customer = new CustomerEntity();
    Object.assign(customer, customerData);
    const savedCustomer = await customerRepository.save(customer);
    savedCustomers.push(savedCustomer);
  }
  console.log(`👥 Created ${savedCustomers.length} customers`);

  // 3. Crear teléfonos
  const phonesData = [
    {
      customerId: savedCustomers[0].id,
      brand: 'Samsung',
      model: 'Galaxy S23',
      imei: '123456789012345',
      color: 'Negro',
      purchaseDate: new Date('2023-03-15'),
      warrantyExpiry: new Date('2025-03-15'),
      condition: PhoneCondition.GOOD,
      isActive: true,
      notes: 'Protector de pantalla instalado'
    },
    {
      customerId: savedCustomers[0].id,
      brand: 'iPhone',
      model: '14 Pro',
      imei: '987654321098765',
      color: 'Azul',
      purchaseDate: new Date('2023-09-22'),
      warrantyExpiry: new Date('2024-09-22'),
      condition: PhoneCondition.EXCELLENT,
      isActive: true,
      notes: 'Dispositivo en excelente estado'
    },
    {
      customerId: savedCustomers[1].id,
      brand: 'Xiaomi',
      model: 'Redmi Note 12',
      imei: '456789012345678',
      color: 'Blanco',
      condition: PhoneCondition.FAIR,
      isActive: true,
      notes: 'Pequeños rayones en la pantalla'
    },
    {
      customerId: savedCustomers[1].id,
      brand: 'Samsung',
      model: 'Galaxy A54',
      imei: '111222333444555',
      color: 'Rosa',
      purchaseDate: new Date('2023-12-10'),
      condition: PhoneCondition.GOOD,
      isActive: true,
      notes: 'Teléfono de trabajo'
    },
    {
      customerId: savedCustomers[2].id,
      brand: 'Huawei',
      model: 'P50 Pro',
      imei: '789012345678901',
      color: 'Dorado',
      condition: PhoneCondition.DAMAGED,
      isActive: false,
      notes: 'Pantalla quebrada, necesita reemplazo'
    },
    {
      customerId: savedCustomers[3].id,
      brand: 'iPhone',
      model: '13',
      imei: '666777888999000',
      color: 'Verde',
      purchaseDate: new Date('2022-10-15'),
      condition: PhoneCondition.GOOD,
      isActive: true,
      notes: 'Uso cuidadoso, estudiante'
    },
    {
      customerId: savedCustomers[4].id,
      brand: 'OnePlus',
      model: '11',
      imei: '555666777888999',
      color: 'Negro',
      purchaseDate: new Date('2023-06-20'),
      condition: PhoneCondition.EXCELLENT,
      isActive: true,
      notes: 'Ingeniero, manejo técnico excelente'
    }
  ];

  const savedPhones = [];
  for (const phoneData of phonesData) {
    const phone = new PhoneEntity();
    Object.assign(phone, phoneData);
    const savedPhone = await phoneRepository.save(phone);
    savedPhones.push(savedPhone);
  }
  console.log(`📱 Created ${savedPhones.length} phones`);

  const repairsData = [
    {
      phoneId: savedPhones[0].id,
      customerId: savedCustomers[0].id,
      issue: 'Pantalla quebrada',
      description: 'Pantalla completamente fragmentada después de caída. Touch no responde.',
      status: RepairStatus.COMPLETED,
      priority: RepairPriority.HIGH,
      estimatedCost: 150000,
      finalCost: 145000,
      estimatedDuration: 4,
      actualDuration: 3.5,
      startDate: new Date('2024-01-20'),
      estimatedCompletionDate: new Date('2024-01-24'),
      completionDate: new Date('2024-01-23'),
      technicianNotes: 'Reemplazo de pantalla original. Calibración exitosa.',
      clientNotes: 'Cliente satisfecho con la reparación'
    },
    {
      phoneId: savedPhones[0].id,
      customerId: savedCustomers[0].id,
      issue: 'Batería se agota rápido',
      description: 'La batería dura menos de 4 horas con uso normal.',
      status: RepairStatus.IN_PROGRESS,
      priority: RepairPriority.MEDIUM,
      estimatedCost: 80000,
      estimatedDuration: 2,
      startDate: new Date('2024-04-15'),
      estimatedCompletionDate: new Date('2024-04-17'),
      technicianNotes: 'Diagnóstico: batería degradada. Reemplazo necesario.'
    },
    {
      phoneId: savedPhones[1].id,
      customerId: savedCustomers[0].id,
      issue: 'No carga',
      description: 'El dispositivo no responde al conectar el cargador.',
      status: RepairStatus.WAITING_PARTS,
      priority: RepairPriority.HIGH,
      estimatedCost: 120000,
      estimatedDuration: 6,
      startDate: new Date('2024-04-10'),
      estimatedCompletionDate: new Date('2024-04-16'),
      technicianNotes: 'Puerto de carga dañado. Esperando repuesto original.'
    },
    {
      phoneId: savedPhones[2].id,
      customerId: savedCustomers[1].id,
      issue: 'Cámara borrosa',
      description: 'Las fotos salen borrosas y con manchas.',
      status: RepairStatus.PENDING,
      priority: RepairPriority.LOW,
      estimatedCost: 95000,
      estimatedDuration: 3,
      startDate: new Date('2024-04-18'),
      estimatedCompletionDate: new Date('2024-04-21'),
      technicianNotes: 'Pendiente revisión de lente de cámara'
    },
    {
      phoneId: savedPhones[2].id,
      customerId: savedCustomers[1].id,
      issue: 'Audio distorsionado',
      description: 'El altavoz principal presenta distorsión en volumen alto.',
      status: RepairStatus.COMPLETED,
      priority: RepairPriority.MEDIUM,
      estimatedCost: 65000,
      finalCost: 60000,
      estimatedDuration: 2,
      actualDuration: 1.5,
      startDate: new Date('2024-03-05'),
      estimatedCompletionDate: new Date('2024-03-07'),
      completionDate: new Date('2024-03-06'),
      technicianNotes: 'Reemplazo de altavoz. Pruebas de audio exitosas.',
      clientNotes: 'Problema resuelto completamente'
    },
    {
      phoneId: savedPhones[3].id,
      customerId: savedCustomers[1].id,
      issue: 'Actualización fallida',
      description: 'El sistema se quedó bloqueado durante una actualización.',
      status: RepairStatus.COMPLETED,
      priority: RepairPriority.URGENT,
      estimatedCost: 45000,
      finalCost: 40000,
      estimatedDuration: 1,
      actualDuration: 0.5,
      startDate: new Date('2024-02-28'),
      estimatedCompletionDate: new Date('2024-03-01'),
      completionDate: new Date('2024-02-28'),
      technicianNotes: 'Recuperación de sistema exitosa. Reinstalación completa.',
      clientNotes: 'Reparación muy rápida, excelente servicio'
    },
    {
      phoneId: savedPhones[4].id,
      customerId: savedCustomers[2].id,
      issue: 'Pantalla completamente rota',
      description: 'Dispositivo cayó desde segundo piso, múltiples fracturas.',
      status: RepairStatus.CANCELLED,
      priority: RepairPriority.HIGH,
      estimatedCost: 280000,
      estimatedDuration: 8,
      startDate: new Date('2024-04-12'),
      estimatedCompletionDate: new Date('2024-04-20'),
      technicianNotes: 'Costo de reparación excede valor del dispositivo. Cliente decidió no proceder.',
      clientNotes: 'Muy costoso, prefiero comprar nuevo'
    },
    {
      phoneId: savedPhones[5].id,
      customerId: savedCustomers[3].id,
      issue: 'Limpieza por líquido',
      description: 'Dispositivo expuesto a líquido, funciona pero presenta ralentización.',
      status: RepairStatus.DELIVERED,
      priority: RepairPriority.MEDIUM,
      estimatedCost: 85000,
      finalCost: 75000,
      estimatedDuration: 3,
      actualDuration: 2,
      startDate: new Date('2024-03-25'),
      estimatedCompletionDate: new Date('2024-03-28'),
      completionDate: new Date('2024-03-27'),
      technicianNotes: 'Limpieza profunda de componentes. Secado completo. Funcionalidad restaurada.',
      clientNotes: 'Muy profesional, el teléfono funciona como nuevo'
    }
  ];


  const workingHoursPerDay = 8;
  
  const savedRepairs = [];
  for (const repairData of repairsData) {
    const repair = new RepairEntity();
    Object.assign(repair, repairData);
    
    if (!repair.estimatedCompletionDate) {
      const daysNeeded = Math.ceil(repair.estimatedDuration / workingHoursPerDay);
      const estimatedDate = new Date(repair.startDate);
      estimatedDate.setDate(repair.startDate.getDate() + daysNeeded);
      repair.estimatedCompletionDate = estimatedDate;
    }
    
    const savedRepair = await repairRepository.save(repair);
    savedRepairs.push(savedRepair);
  }
  console.log(`🔧 Created ${savedRepairs.length} repairs`);

  console.log('✅ Comprehensive database seeding completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   👤 Users: ${savedUsers.length}`);
  console.log(`   👥 Customers: ${savedCustomers.length}`);
  console.log(`   📱 Phones: ${savedPhones.length}`);
  console.log(`   🔧 Repairs: ${savedRepairs.length}`);
  console.log('');
  console.log('🔑 Login credentials:');
  console.log('   Super Admin: superadmin / admin123');
  console.log('   Admin: admin1 / admin123');
  console.log('');
  console.log('📋 Test data includes:');
  console.log('   - 5 customers with different document types');
  console.log('   - 7 phones from various brands');
  console.log('   - 8 repairs with complete timeline');
  console.log('   - Realistic repair statuses and priorities');
}