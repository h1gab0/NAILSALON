const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const Steno = require('steno');

class JSONFileWithSteno {
    constructor(filename) {
        this.filename = filename;
        this.writer = new Steno(filename);
    }

    async read() {
        try {
            const data = await require('fs').promises.readFile(this.filename, 'utf-8');
            return JSON.parse(data);
        } catch (e) {
            if (e.code === 'ENOENT') {
                return null;
            }
            throw e;
        }
    }

    async write(data) {
        await this.writer.write(JSON.stringify(data, null, 2));
    }
}

const adapter = new JSONFileWithSteno('db.json');
const db = new Low(adapter);

// Function to set default data if the database is empty
const setDefaultData = async () => {
    await db.read();
    if (!db.data) {
        db.data = {
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
        await db.write();
    }
};

// Initialize and set default data
setDefaultData();

module.exports = { db, getInstanceData: async (instanceId) => {
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
}};
