const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function seedUsers() {
    try {
        // Check if users already exist
        const existingUsers = await User.countDocuments();
        if (existingUsers > 0) {
            console.log('Users already seeded. Skipping...');
            return;
        }

        const hashedPassword = await bcrypt.hash('password', 10);

        const testUsers = [
            {
                email: 'citizen@test.com',
                password: hashedPassword,
                name: 'Test Citizen',
                role: 'CITIZEN',
                householdId: 'H001',
            },
            {
                email: 'collector@test.com',
                password: hashedPassword,
                name: 'Test Collector',
                role: 'COLLECTOR',
                assignedWard: 'Ward 4',
            },
            {
                email: 'admin@test.com',
                password: hashedPassword,
                name: 'Municipal Admin',
                role: 'ADMIN',
            },
        ];

        await User.insertMany(testUsers);
        console.log('✅ Test users seeded successfully');
        console.log('Login credentials:');
        console.log('  Citizen: citizen@test.com / password');
        console.log('  Collector: collector@test.com / password');
        console.log('  Admin: admin@test.com / password');
    } catch (err) {
        console.error('Error seeding users:', err);
    }
}

module.exports = { seedUsers };
