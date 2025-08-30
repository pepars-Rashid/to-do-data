'use server';
import { eq } from 'drizzle-orm';
import { db } from '@/database/db';
import {tasksTable, tasksTable2} from "@/database/schema"

export const getAllTasks= async () => {
    const tasks = await db.select().from(tasksTable);
    return tasks;
}

export const getAllTasks2= async () => {
    const tasks = await db.select().from(tasksTable2);
    return tasks;
}

export const insertTask = async (task) => {
    await db.insert(tasksTable).values(task) 
}

export const insertTask2 = async (task) => {
    await db.insert(tasksTable2).values(task) 
}

export const insertTodo = async (preState, data) => {
    try{
    const text = data.get("text")
    const number = data.get("number")
    const unit = data.get("unit")
    const time = `${number} ${unit}`
    
    await db.insert(tasksTable).values({text , time}) 
    } catch(err){
        return {err}
    }    
}

export const deleteRow = async (id) =>{
    await db.delete(tasksTable)
    .where(eq(tasksTable.id, id));
}

export const deleteRow2 = async (id) =>{
    await db.delete(tasksTable2)
    .where(eq(tasksTable2.id, id));
}

export const updateCheckbox = async (id) =>{
    const task = await db.select().from(tasksTable).where(eq(tasksTable.id, id)).then(rows => rows[0]);
    const checked = task.checked;
    await db.update(tasksTable)
    .set({ checked: !checked })
    .where(eq(tasksTable.id, id));
}

export const updateCheckbox2 = async (id) =>{
    const task = await db.select().from(tasksTable2).where(eq(tasksTable2.id, id)).then(rows => rows[0]);
    const checked = task.checked;
    await db.update(tasksTable2)
    .set({ checked: !checked })
    .where(eq(tasksTable2.id, id));
}

export const editText = async (preState, data) =>{
    const id = data.get("id")
    const newText = data.get("text")
    await db.update(tasksTable)
    .set({text: newText})
    .where(eq(tasksTable.id, id))
}
