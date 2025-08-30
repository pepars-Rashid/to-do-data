"use client"
import { AnimatePresence, useAnimate, usePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FiClock, FiPlus, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { localDB } from "@/database/localDB";
import { deleteRow, getAllTasks, insertTask, updateCheckbox } from "@/app/action";
import { useLiveQuery } from "dexie-react-hooks";

 async function initialFetchTasks() {
      try {
    // 1. Fetch tasks from server
    const serverTasks = await getAllTasks();
    
    // 2. Get pending operations from queue
    const pendingOperations = await localDB.queueTasks.toArray();
    
    // 3. Start a transaction for atomic updates
    await localDB.transaction('rw', localDB.tasks, async () => {
      // 4. Clear existing tasks
      await localDB.tasks.clear();
      
      // 5. Add server tasks to localDB, preserving pending states
      for (const serverTask of serverTasks) {
        // Check if this task has pending operations
        const isPending = pendingOperations.some(op => op.id === serverTask.id);
        
        await localDB.tasks.add({
          ...serverTask,
          PendingState: isPending ? 'Syncing...' : ''
        });
      }
      
      // 6. Add any local-only tasks that are pending creation
      const pendingAdds = pendingOperations.filter(op => op.action === 'addTask');
      for (const pendingAdd of pendingAdds) {
        const exists = serverTasks.some(t => t.id === pendingAdd.id);
        if (!exists) {
          await localDB.tasks.add({
            id: pendingAdd.id,
            text: pendingAdd.text,
            checked: pendingAdd.checked,
            time: pendingAdd.time,
            PendingState: 'Adding...'
          });
        }
      }
    });
    
    console.log('LocalDB successfully synced with server');
  } catch (error) {
    console.error('Failed to sync server tasks to localDB:', error);
  }
};

// Queue processing function
const processQueue = async () => {
  console.log('!!!')
  const queue = await localDB.queueTasks.toArray();
  if (!queue.length) return;
  
  for (const task of queue) {
    try {
      switch (task.action) {
        case "addTask":
          await insertTask({ id: task.id, ...task });
          await localDB.tasks.update(task.id, { PendingState: '' });
          break;
        case "updateCheckbox":
          await updateCheckbox(task.id);
          await localDB.tasks.update(task.id, { PendingState: '' });
          break;
        case "deleteRow":
          await deleteRow(task.id);
          await localDB.tasks.delete(task.id);
          break;
      }
      await localDB.queueTasks.delete(task.id);
    } catch (err) {
      console.error("Queue processing error:", err);
      break; // Stop processing on failure
    }
  }
};

export const VanishList = () => {
  const todos = useLiveQuery(() => localDB.tasks.toArray(), []);

  useEffect(() => {
    initialFetchTasks();
    processQueue();
    const intervalId = setInterval(processQueue, 10 * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleCheck = async(id) => {
    // localDb
    console.log('id', id, 'type:', typeof id)
    await localDB.tasks.update(id, {  
    checked: !(todos.find(task => task.id === id).checked),
    PendingState: 'checking...'
    });
    try{
      await updateCheckbox(id)
      await localDB.tasks.update(id, { PendingState:'' });
    }
    catch(err){
      console.log("checkerr:",err)
      await localDB.queueTasks.put({id, action:"updateCheckbox"})
    }
  };

  const removeElement = async(id) => {
    // localDb
    await localDB.tasks.update(id,{PendingState: 'Deleting...'});
    try{
      await deleteRow(id)
      await localDB.tasks.delete(id)
    }
    catch(err){
      console.log("deleteErr:",err)
      await localDB.queueTasks.put({id, action:"deleteRow"})
    }
  };

  return (
    <section
      className="min-h-screen bg-zinc-950 py-24"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%2318181b'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
      }}
    >
      <div className="mx-auto w-full max-w-xl px-4">
        <Header />
        <Todos
          removeElement={removeElement}
          todos={todos}
          handleCheck={handleCheck}
        />
      </div>
      <Form />
    </section>
  );
};

const Header = () => {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-medium text-white">Good morning! ☀️</h1>
      <p className="text-zinc-400">Let's see what we've got to do today.</p>
    </div>
  );
};

const Form = () => {
  const [visible, setVisible] = useState(false);

  const [time, setTime] = useState(15);
  const [text, setText] = useState("");
  const [unit, setUnit] = useState("mins");

  const handleSubmit = async() => {
    if (!text.length) {
      return;
    }
    // localDb
    const task = {text: text, checked:false, time: `${time} ${unit}`}
    const id = await localDB.tasks.add({...task , PendingState:'Adding...'});
    try{
      await insertTask({id:id, ...task})
      await localDB.tasks.update(id, { PendingState:'' })
    } catch(err){
        console.log("adderr:",err)
        await localDB.queueTasks.put({id:id, ...task, action:"addTask"});
    }
    setTime(15);
    setText("");
    setUnit("mins");
  };

  return (
    <div className="fixed bottom-6 left-1/2 w-full max-w-xl -translate-x-1/2 px-4">
      <AnimatePresence>
        {visible && (
          <motion.form
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="mb-6 w-full rounded border border-zinc-700 bg-zinc-900 p-3"
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What do you need to do?"
              className="h-24 w-full resize-none rounded bg-zinc-900 p-3 text-sm text-zinc-50 placeholder-zinc-500 caret-zinc-50 focus:outline-0"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  className="w-24 rounded bg-zinc-700 px-1.5 py-1 text-sm text-zinc-50 focus:outline-0"
                  value={time}
                  onChange={(e) => setTime(parseInt(e.target.value))}
                />
                <button
                  type="button"
                  onClick={() => setUnit("mins")}
                  className={`rounded px-1.5 py-1 text-xs ${unit === "mins" ? "bg-white text-zinc-950" : "bg-zinc-300/20 text-zinc-300 transition-colors hover:bg-zinc-600 hover:text-zinc-200"}`}
                >
                  mins
                </button>
                <button
                  type="button"
                  onClick={() => setUnit("hrs")}
                  className={`rounded px-1.5 py-1 text-xs ${unit === "hrs" ? "bg-white text-zinc-950" : "bg-zinc-300/20 text-zinc-300 transition-colors hover:bg-zinc-600 hover:text-zinc-200"}`}
                >
                  hrs
                </button>
              </div>
              <button
                type="submit"
                className="rounded bg-indigo-600 px-1.5 py-1 text-xs text-indigo-50 transition-colors hover:bg-indigo-500"
              >
                Submit
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      <button
        onClick={() => setVisible((pv) => !pv)}
        className="grid w-full place-content-center rounded-full border border-zinc-700 bg-zinc-900 py-3 text-lg text-white transition-colors hover:bg-zinc-800 active:bg-zinc-900"
      >
        <FiPlus
          className={`transition-transform ${visible ? "rotate-45" : "rotate-0"}`}
        />
      </button>
    </div>
  );
};

const Todos = ({ todos, handleCheck, removeElement }) => {
  return (
    <div className="w-full space-y-3">
      <AnimatePresence>
        {todos?.map((t) => (
          <Todo
            handleCheck={handleCheck}
            removeElement={removeElement}
            id={t.id}
            key={t.id}
            checked={t.checked}
            time={t.time}
            PendingState={t.PendingState}

          >
            {t.text}
          </Todo>
        ))}
      </AnimatePresence>
    </div>
  );
};

const Todo = ({ removeElement, handleCheck, id, children, checked, time, PendingState}) => {
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (!isPresent) {
      const exitAnimation = async () => {
        animate(
          "p",
          {
            color: checked ? "#6ee7b7" : "#fca5a5",
          },
          {
            ease: "easeIn",
            duration: 0.125,
          }
        );
        await animate(
          scope.current,
          {
            scale: 1.025,
          },
          {
            ease: "easeIn",
            duration: 0.125,
          }
        );

        await animate(
          scope.current,
          {
            opacity: 0,
            x: checked ? 24 : -24,
          },
          {
            delay: 0.75,
          }
        );
        safeToRemove();
      };

      exitAnimation();
    }
  }, [isPresent]);

  return (
    <motion.div
      ref={scope}
      layout
      className="relative flex w-full h-fit items-center gap-3 rounded border border-zinc-700 bg-zinc-900 p-3"
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => handleCheck(id)}
        disabled={PendingState !== ''}
        className={`size-4 accent-indigo-400 ${PendingState !== '' ? 'cursor-not-allowed opacity-50' : ''}`}
      />

      <p
        className={`text-white transition-colors ${checked && "text-zinc-400"}`}
      >
        {children}
      </p>
      <p className={`transition-colors ${PendingState==="Deleting..."? 'text-red-400':'text-white'}`}>
        {PendingState}
      </p>
      <div className="ml-auto flex gap-1.5">
        <div className="flex items-center gap-1.5 whitespace-nowrap rounded bg-zinc-800 px-1.5 py-1 text-xs text-zinc-400">
          <FiClock />
          <span>{time}</span>
        </div>
        <button
          onClick={() => removeElement(id)}
          disabled={PendingState !== ''}
          className={`rounded px-1.5 py-1 text-xs transition-colors ${
            PendingState !== '' 
              ? 'bg-zinc-600/20 text-zinc-500 cursor-not-allowed' 
              : 'bg-red-300/20 text-red-300 hover:bg-red-600 hover:text-red-200'
          }`}
        >
          <FiTrash2 />
        </button>
      </div>
    </motion.div>
  );
};