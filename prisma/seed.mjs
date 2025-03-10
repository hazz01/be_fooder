import { PrismaClient, Role, Category, Payment, Status } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Function to create a user
async function createUser(data) {
  return await prisma.user.create({
    data: {
      uuid: uuidv4(),
      ...data
    }
  });
}

// Function to create a menu item
async function createMenuItem(data) {
  return await prisma.menu.create({
    data: {
      uuid: uuidv4(),
      ...data
    }
  });
}

// Function to create an order
async function createOrder(data) {
  return await prisma.order.create({
    data: {
      uuid: uuidv4(),
      ...data
    }
  });
}

// Main seeding function
async function main() {
  try {
    // Clean existing data
    await prisma.orderList.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.menu.deleteMany({});
    await prisma.user.deleteMany({});

    // Create Users
    const manager = await createUser({
      name: 'John Manager',
      email: 'manager@restaurant.com',
      password: 'hashedpassword123',
      profile_picture: 'manager.jpg',
      role: Role.MANAGER
    });

    const cashier = await createUser({
      name: 'Alice Cashier',
      email: 'cashier@restaurant.com',
      password: 'hashedpassword456',
      profile_picture: 'cashier.jpg',
      role: Role.CASHIER
    });

    // Create Menu Items
    const nasiGoreng = await createMenuItem({
      name: 'Nasi Goreng',
      price: 25000,
      category: Category.FOOD,
      picture: 'nasi-goreng.jpg',
      description: 'Indonesian fried rice with chicken and vegetables'
    });

    const iceTea = await createMenuItem({
      name: 'Ice Tea',
      price: 8000,
      category: Category.DRINK,
      picture: 'ice-tea.jpg',
      description: 'Refreshing cold tea with ice'
    });

    const frenchFries = await createMenuItem({
      name: 'French Fries',
      price: 15000,
      category: Category.SNACK,
      picture: 'french-fries.jpg',
      description: 'Crispy potato fries with salt'
    });

    // Create Orders
    await createOrder({
      customer: 'Table 1 Customer',
      table_number: '1',
      total_price: 48000,
      payment_method: Payment.CASH,
      status: Status.PAID,
      userId: cashier.id,
      orderLists: {
        create: [
          {
            quantity: 1,
            note: 'Extra spicy',
            menuId: nasiGoreng.id
          },
          {
            quantity: 1,
            note: 'Less ice',
            menuId: iceTea.id
          }
        ]
      }
    });

    await createOrder({
      customer: 'Table 2 Customer',
      table_number: '2',
      total_price: 38000,
      payment_method: Payment.QRIS,
      status: Status.NEW,
      userId: cashier.id,
      orderLists: {
        create: [
          {
            quantity: 1,
            note: 'Extra crispy',
            menuId: frenchFries.id
          },
          {
            quantity: 2,
            note: 'Regular ice',
            menuId: iceTea.id
          }
        ]
      }
    });

    console.log('✅ Seed data created successfully');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the seed function
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
