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
    try {
        await db.read();
    } catch (e) {
        // If the file is corrupt or empty, it might throw an error.
        // We can log this and assume the db is empty.
        console.log("Could not read db.json, likely because it is empty or corrupt. Initializing with default data.");
        db.data = null; // Force re-initialization
    }

    // If the file didn't exist or was corrupt, db.data will be null.
    // Set it to default data and write to the file to create/fix it.
    if (!db.data) {
        db.data = defaultData;
        await db.write();
    }
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
