import Dexie from "dexie";

const localDB = new Dexie('MyDatabase');

// Declare tables, IDs and indexes
localDB.version(1).stores({
    tasks: '++id, text, checked, time, PendingState',
    queueTasks: 'id, text, checked, time, action' 
});

const localDB2 = new Dexie('MyDatabase2');

// Declare tables, IDs and indexes for localDB2
localDB2.version(1).stores({
    tasks: '++id, text, checked, time, PendingState',
    queueTasks: '++id, taskID, text, checked, time, action' 
});

export { localDB, localDB2 };