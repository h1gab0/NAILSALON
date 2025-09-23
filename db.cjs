const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

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

const initDb = async () => {
    await db.read();
    // If the file didn't exist, db.data will be null, so we need to set it
    db.data = db.data || defaultData;
    await db.write(); // Write the default data if the file was new
};

const getInstanceData = async (instanceId) => {
    await db.read();
    if (!db.data.instances[instanceId]) {
        db.data.instances[instanceId] = {
            name: `${instanceId}'s Scheduler`,
            admins: [{ username: 'admin', password: 'password' }],
            coupons: [],
            appointments: [],
            availability: {}
        };
        await db.write();
    }
    return db.data.instances[instanceId];
};

module.exports = { db, getInstanceData, initDb };
