import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import bcrypt from 'bcrypt';

const saltRounds = 10;
const defaultPassword = 'password';
const defaultPasswordHash = await bcrypt.hash(defaultPassword, saltRounds);

// Default data structure
const defaultData = {
  instances: {
    'default': {
      id: 'default',
      name: 'Default Salon',
      admin: {
        username: 'admin',
        passwordHash: defaultPasswordHash
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
      passwordHash: defaultPasswordHash
    }
  }
};

const adapter = new JSONFile('db.json');
const db = new Low(adapter, defaultData);

async function initializeDatabase() {
  await db.read();
  db.data = db.data || defaultData;

  // Ensure default instance exists
  if (!db.data.instances.default) {
    db.data.instances.default = defaultData.instances.default;
  }
  if (!db.data.superAdmins.superadmin) {
    db.data.superAdmins.superadmin = defaultData.superAdmins.superadmin;
  }

  await db.write();
  console.log('Database initialized successfully with default data.');
}

initializeDatabase().catch(err => console.error('Failed to initialize database:', err));

export { db };