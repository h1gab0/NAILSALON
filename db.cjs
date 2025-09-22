const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

// Default data structure if db.json doesn't exist
const defaultData = {
  instances: {
    "default": {
      name: "Nail Scheduler Default",
      admins: [{ username: 'admin', password: 'password' }],
      coupons: [
        { code: 'SAVE10', discount: 10, usesLeft: 10, expiresAt: '2025-12-31' }
      ],
      appointments: [],
      availability: {}
    }
  }
};

const adapter = new JSONFile('db.json');
const db = new Low(adapter, defaultData);

// Read data from JSON file, this will set db.data.
// If file doesn't exist, the defaultData will be used.
db.read();

// Helper to get or create instance data and ensure it's written to the db
const getInstanceData = async (instanceId) => {
    await db.read(); // Always read latest data from file
    if (!db.data.instances[instanceId]) {
        db.data.instances[instanceId] = {
            name: `${instanceId}'s Scheduler`,
            admins: [{ username: 'admin', password: 'password' }],
            coupons: [],
            appointments: [],
            availability: {}
        };
        await db.write(); // Write back to file if a new instance was created
    }
    return db.data.instances[instanceId];
};

module.exports = { db, getInstanceData };
