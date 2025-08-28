import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

// Written by AI because I cba to write seeding

const prisma = new PrismaClient();

// Car data for realistic seeding
const carMakes: string[] = [
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "Nissan",
  "BMW",
  "Mercedes",
  "Audi",
  "Volkswagen",
  "Hyundai",
  "Kia",
  "Mazda",
  "Subaru",
  "Lexus",
  "Acura",
];

const carModels: { [key: string]: string[] } = {
  Toyota: ["Camry", "Corolla", "RAV4", "Prius", "Highlander", "Tacoma"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "Odyssey", "Fit"],
  Ford: ["F-150", "Escape", "Explorer", "Mustang", "Focus", "Edge"],
  Chevrolet: ["Silverado", "Equinox", "Malibu", "Tahoe", "Cruze", "Camaro"],
  Nissan: ["Altima", "Sentra", "Rogue", "Pathfinder", "Murano", "370Z"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "Z4", "i3"],
  Mercedes: ["C-Class", "E-Class", "GLC", "GLE", "A-Class", "S-Class"],
  Audi: ["A3", "A4", "Q5", "Q7", "A6", "TT"],
  Volkswagen: ["Jetta", "Passat", "Tiguan", "Atlas", "Golf", "Beetle"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Genesis", "Veloster"],
  Kia: ["Optima", "Forte", "Sorento", "Sportage", "Soul", "Stinger"],
  Mazda: ["Mazda3", "Mazda6", "CX-5", "CX-9", "MX-5", "CX-3"],
  Subaru: ["Outback", "Forester", "Impreza", "Legacy", "Crosstrek", "WRX"],
  Lexus: ["ES", "RX", "NX", "GX", "IS", "LS"],
  Acura: ["TLX", "RDX", "MDX", "ILX", "NSX", "TLX"],
};

const colors: string[] = [
  "Red",
  "Blue",
  "Black",
  "White",
  "Silver",
  "Gray",
  "Green",
  "Yellow",
  "Orange",
  "Purple",
  "Brown",
  "Gold",
];

function generateRandomCar() {
  const make = faker.helpers.arrayElement(carMakes);
  const model = faker.helpers.arrayElement(carModels[make]);
  const year = faker.date
    .between({ from: "1990-01-01", to: "2024-12-31" })
    .getFullYear();
  const colour = faker.helpers.arrayElement(colors);

  return { make, model, year, colour };
}

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data
  console.log("🧹 Clearing existing data...");
  await prisma.car.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("👥 Creating 4,000 users...");

  // Create users in batches for better performance
  const batchSize = 200;
  const userBatches = Math.ceil(4000 / batchSize);

  for (let batch = 0; batch < userBatches; batch++) {
    const users = [];
    const currentBatchSize = Math.min(batchSize, 4000 - batch * batchSize);

    for (let i = 0; i < currentBatchSize; i++) {
      users.push({
        email: faker.internet.email(),
        full_name: faker.person.fullName(),
        age: faker.number.int({ min: 18, max: 80 }),
      });
    }

    await prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    });

    console.log(
      `   📝 Created batch ${batch + 1}/${userBatches} (${users.length} users)`,
    );
  }

  // Get all created users
  const allUsers = await prisma.user.findMany();
  console.log(`✅ Successfully created ${allUsers.length} users`);

  console.log("🚗 Creating 10,000 cars with specific distribution...");

  // Seeding requirements:
  // - 4,000 users total
  // - 100 users with 0 cars
  // - 3,900 users with 1+ cars
  // - 10,000 cars total
  // - 100 cars unassigned
  // - 9,900 cars assigned to the 3,900 users (average 2.54 cars per user with cars)

  const usersWithoutCars = allUsers.slice(0, 100); // First 100 users get no cars
  const usersWithCars = allUsers.slice(100); // Remaining 3,900 users get cars

  console.log(`   📋 Distribution plan:`);
  console.log(`      👥 Users without cars: ${usersWithoutCars.length}`);
  console.log(`      👥 Users with cars: ${usersWithCars.length}`);
  console.log(`      🚗 Cars to assign: 9,900`);
  console.log(`      🚫 Cars to leave unassigned: 100`);
  console.log(
    `      📊 Average cars per user with cars: ${(9900 / usersWithCars.length).toFixed(2)}`,
  );

  // Calculate distribution: 9,900 cars among 3,900 users
  // Average of 2.54 cars per user with cars
  // We'll vary this from 1 to about 8 cars per user for realistic distribution

  const carAssignments = [];
  let totalAssignedCars = 0;
  const targetAssignedCars = 9900;

  // Assign cars to each of the 3,900 users
  for (let i = 0; i < usersWithCars.length; i++) {
    const user = usersWithCars[i];
    const remainingUsers = usersWithCars.length - i;
    const remainingCars = targetAssignedCars - totalAssignedCars;

    // Calculate how many cars this user should get
    let carsForThisUser;
    if (i === usersWithCars.length - 1) {
      // Last user gets all remaining cars
      carsForThisUser = remainingCars;
    } else {
      // Most users get 1-5 cars, with some getting more for variation
      // This creates a realistic distribution around 2.5 average
      const avgCarsPerUser = remainingCars / remainingUsers;

      if (Math.random() < 0.7) {
        // 70% of users get 1-4 cars
        carsForThisUser = faker.number.int({ min: 1, max: 4 });
      } else if (Math.random() < 0.9) {
        // 20% of users get 2-6 cars
        carsForThisUser = faker.number.int({ min: 2, max: 6 });
      } else {
        // 10% of users get 3-8 cars
        carsForThisUser = faker.number.int({ min: 3, max: 8 });
      }

      // Ensure we don't exceed what's available
      const maxPossible = remainingCars - (remainingUsers - 1);
      carsForThisUser = Math.min(carsForThisUser, maxPossible);

      // Ensure at least 1 car
      carsForThisUser = Math.max(1, carsForThisUser);
    }

    carAssignments.push({
      userId: user.id,
      userName: user.full_name,
      carCount: carsForThisUser,
    });

    totalAssignedCars += carsForThisUser;
  }

  console.log(
    `   📊 Car assignment verification: ${totalAssignedCars} cars assigned`,
  );

  // Create all cars
  const carBatchSize = 500;
  const carBatches = Math.ceil(10000 / carBatchSize);
  let carIndex = 0;
  let assignmentIndex = 0;
  let carsAssignedToCurrentUser = 0;

  for (let batch = 0; batch < carBatches; batch++) {
    const cars = [];
    const currentBatchSize = Math.min(
      carBatchSize,
      10000 - batch * carBatchSize,
    );

    for (let i = 0; i < currentBatchSize; i++) {
      const car = generateRandomCar();
      let userId = null;

      // Determine if this car should be assigned
      if (carIndex < 9900) {
        // This car should be assigned to a user
        if (assignmentIndex < carAssignments.length) {
          const currentAssignment = carAssignments[assignmentIndex];
          userId = currentAssignment?.userId;
          carsAssignedToCurrentUser++;

          // Move to next user if current user has reached their quota
          if (carsAssignedToCurrentUser >= (currentAssignment?.carCount ?? 0)) {
            assignmentIndex++;
            carsAssignedToCurrentUser = 0;
          }
        }
      }
      // If carIndex >= 9900, userId remains null (unassigned cars)

      cars.push({
        ...car,
        user_id: userId,
      });

      carIndex++;
    }

    await prisma.car.createMany({
      data: cars,
    });

    console.log(
      `   🚙 Created batch ${batch + 1}/${carBatches} (${cars.length} cars)`,
    );
  }

  // Get final statistics
  const totalUsers = await prisma.user.count();
  const totalCars = await prisma.car.count();
  const assignedCars = await prisma.car.count({
    where: { user_id: { not: null } },
  });
  const unassignedCars = await prisma.car.count({ where: { user_id: null } });
  const usersWithoutAnyCars = await prisma.user.count({
    where: {
      cars: {
        none: {},
      },
    },
  });
  const usersWithAnyCars = await prisma.user.count({
    where: {
      cars: {
        some: {},
      },
    },
  });

  // Get users with car counts
  const userCarCounts = await prisma.user.findMany({
    select: {
      id: true,
      full_name: true,
      _count: {
        select: { cars: true },
      },
    },
    orderBy: {
      cars: {
        _count: "desc",
      },
    },
    take: 20,
  });

  console.log("\n📊 Final Seeding Statistics:");
  console.log(`   👥 Total Users: ${totalUsers}`);
  console.log(`   🚗 Total Cars: ${totalCars}`);
  console.log(`   🔗 Assigned Cars: ${assignedCars}`);
  console.log(`   🚫 Unassigned Cars: ${unassignedCars}`);
  console.log(`   😔 Users without cars: ${usersWithoutAnyCars}`);
  console.log(`   🚗 Users with cars: ${usersWithAnyCars}`);

  console.log("\n🏆 Top 20 Users by Car Count:");
  userCarCounts.forEach((user, index) => {
    console.log(`   ${index + 1}. ${user.full_name}: ${user._count.cars} cars`);
  });

  // Verify our requirements
  console.log("\n✅ Requirement Verification:");
  console.log(
    `   ✅ 4,000 users created: ${totalUsers === 4000 ? "PASS" : "FAIL"}`,
  );
  console.log(
    `   ✅ 10,000 cars created: ${totalCars === 10000 ? "PASS" : "FAIL"}`,
  );
  console.log(
    `   ✅ 100 users without cars: ${usersWithoutAnyCars === 100 ? "PASS" : "FAIL"}`,
  );
  console.log(
    `   ✅ 100 unassigned cars: ${unassignedCars === 100 ? "PASS" : "FAIL"}`,
  );
  console.log(
    `   ✅ 3,900 users with cars: ${usersWithAnyCars === 3900 ? "PASS" : "FAIL"}`,
  );

  console.log("\n🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
