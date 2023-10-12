"use client";
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { Button, TextField, List, ListItem, ListItemText, IconButton, Checkbox, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

type TodoType = {
  id: string;
  text: string;
  done: boolean;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const StyledList = styled(List)`
  width: 100%;
  margin-top: 20px;
`;

const Title = styled(Typography)`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

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
      const docRef = await addDoc(collection(db, "todos"), {
        todo: input,
        done: false
      });
      const newTodo = {
        id: docRef.id,
        text: input,
        done: false
      };
      setTodos([...todos, newTodo]);
      setInput('');
    } catch (e) {
      console.error("Error adding todo: ", e);
    }
  };

  const toggleDone = async (id: string) => {
    const index = todos.findIndex(todo => todo.id === id);
    const todo = todos[index];
    const updatedDoneStatus = !todo.done;
    const newTodos = [...todos];
    newTodos[index].done = updatedDoneStatus;
    setTodos(newTodos);
    
    try {
      await updateDoc(doc(db, "todos", id), {
        done: updatedDoneStatus
      });
    } catch (e) {
      console.error("Error updating todo status: ", e);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const index = todos.findIndex(todo => todo.id === id);
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
    <Container>
      <Title>Todo List</Title>
      <Form>
        <TextField value={input} onChange={e => setInput(e.target.value)} label="New Todo" variant="outlined" fullWidth />
        <Button type="submit" onClick={addTodo} variant="contained" color="primary" disabled={!input}>
          Add Todo
        </Button>
      </Form>
      <Title>Active Todos</Title>
      <StyledList>
        {todos.filter(todo => !todo.done).map((todo) => (
          <ListItem key={todo.id} role={undefined} dense>
            <Checkbox
              edge="start"
              checked={todo.done}
              tabIndex={-1}
              disableRipple
              onClick={() => toggleDone(todo.id)}
            />
            <ListItemText primary={todo.text} />
            <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(todo.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </StyledList>

      <Title>Completed Todos</Title>
      <StyledList>
        {todos.filter(todo => todo.done).map((todo) => (
          <ListItem key={todo.id} role={undefined} dense>
            <Checkbox
              edge="start"
              checked={todo.done}
              tabIndex={-1}
              disableRipple
              onClick={() => toggleDone(todo.id)}
            />
            <ListItemText primary={todo.text} style={{ textDecoration: 'line-through' }} />
            <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(todo.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </StyledList>
    </Container>
  );
}

