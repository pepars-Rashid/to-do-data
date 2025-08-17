import Dexie from "dexie";

const localDB = new Dexie('MyDatabase');

// Declare tables, IDs and indexes
localDB.version(1).stores({
    tasks: '++id, text, checked, time, PendingState',
    queueTasks: 'id, text, checked, time, action' 
});

export { localDB };