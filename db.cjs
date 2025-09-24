const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const defaultPassword = 'password';

// Default data structure, password hash will be added by initialization
const defaultData = {
  instances: {
    'default': {
      id: 'default',
      name: 'Default Salon',
      admin: {
        username: 'admin',
        passwordHash: null // To be filled in
      },
      appointments: [],
      availability: {},
      coupons: [],
      services: [],
      inventory: []
    }
  },
  superAdmins: {
    'superadmin': {
      passwordHash: null // To be filled in
    }
  }
};

const adapter = new JSONFile('db.json');
const db = new Low(adapter, defaultData);

async function initializeDatabase() {
  await db.read();
  db.data = db.data || defaultData;

  // Hash passwords if they are not already hashed
  if (!db.data.instances.default.admin.passwordHash) {
    const defaultPasswordHash = await bcrypt.hash(defaultPassword, saltRounds);
    db.data.instances.default.admin.passwordHash = defaultPasswordHash;
    db.data.superAdmins.superadmin.passwordHash = defaultPasswordHash;
  }

  await db.write();
  console.log('Database initialized successfully.');
}

module.exports = { db, initializeDatabase };