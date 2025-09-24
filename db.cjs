import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// Default data
const defaultData = {
  instances: {
    'default': {
      id: 'default',
      admin: {
        username: 'admin',
        passwordHash: '$2b$10$f.v..g/b5k2C5aCMWOKp2eN2yvF8.3rditB1kL9M9KzG5Yk.sA5/S' // "password"
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
      passwordHash: '$2b$10$f.v..g/b5k2C5aCMWOKp2eN2yvF8.3rditB1kL9M9KzG5Yk.sA5/S' // "password"
    }
  }
};

const adapter = new JSONFile('db.json');
const db = new Low(adapter, defaultData);

async function initializeDatabase() {
  await db.read();
  db.data = db.data || defaultData;
  await db.write();
}

initializeDatabase().catch(err => console.error('Failed to initialize database:', err));

export { db };
