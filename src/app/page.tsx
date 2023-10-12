"use client";

import React, { useState, useEffect } from 'react';
import { Button, TextField, List, ListItem, ListItemText, IconButton, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

type TodoType = {
  id: string;
  text: string;
  done: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    const fetchTodos = async () => {
      const querySnapshot = await getDocs(collection(db, "todos"));
      const fetchedTodos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        text: doc.data().todo,
        done: doc.data().done
      }));
      setTodos(fetchedTodos);
    };
    
    fetchTodos();
  }, []);

  const addTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const newTodo = {
        id: Math.random().toString(36).substring(7),
        text: input,
        done: false
      };
      const newTodos = [...todos, newTodo];
      setTodos(newTodos);
      await addDoc(collection(db, "todos"), {
        todo: input,
        done: false
      });
      setInput('');
    } catch (e) {
      console.error("Error adding todo: ", e);
    }
  };

  const toggleDone = async (index: number) => {
    const todo = todos[index];
    const updatedDoneStatus = !todo.done;
    const newTodos = [...todos];
    newTodos[index].done = updatedDoneStatus;
    setTodos(newTodos);
    
    try {
      await updateDoc(doc(db, "todos", todo.id), {
        done: updatedDoneStatus
      });
    } catch (e) {
      console.error("Error updating todo status: ", e);
    }
  };

  const deleteTodo = async (index: number) => {
    try {
      const todoId = todos[index].id;
      const newTodos = [...todos];
      newTodos.splice(index, 1);
      setTodos(newTodos);
      await deleteDoc(doc(db, "todos", todoId));
    } catch (e) {
      console.error("Error deleting todo: ", e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <form>
        <TextField value={input} onChange={e => setInput(e.target.value)} label="New Todo" />
        <Button type="submit" onClick={addTodo} variant="contained" color="primary" disabled={!input}>
          Add Todo
        </Button>
      </form>
      <List style={{ width: '300px', marginTop: '20px' }}>
        {todos.map((todo, index) => (
          <ListItem key={todo.id} role={undefined} dense>
            <Checkbox
              edge="start"
              checked={todo.done}
              tabIndex={-1}
              disableRipple
              onClick={() => toggleDone(index)}
            />
            <ListItemText primary={todo.text} style={todo.done ? { textDecoration: 'line-through' } : {}} />
            <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(index)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
