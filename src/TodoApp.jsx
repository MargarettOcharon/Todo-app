import React, { useState, useEffect } from 'react';
import './styles.css'; // Import the new CSS file

const TodoApp = () => {
  const initialTodos = [
    { id: 1, text: "Learn React Hooks", completed: false },
    { id: 2, text: "Build a Todo App", completed: false },
    { id: 3, text: "Practice React skills", completed: false },
  ];

  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : initialTodos;
  });
  
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newTodo = { id: Date.now(), text: inputValue, completed: false };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleToggleComplete = (id) => {
    setTodos(
      todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo)
    );
  };

  const handleEditTodo = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleSaveEdit = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, text: editText } : todo));
    setEditingId(null);
    setEditText('');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  return (
    <div className="todo-container">
      <div className="header">
        <h1>Enhanced Todo List</h1>
        <button onClick={toggleDarkMode} className="dark-mode-btn">
          {darkMode ? '🔆' : '🌙'}
        </button>
      </div>

      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <button type="submit" className="add-btn">Add</button>
      </form>

      <div className="filter-buttons">
        {['all', 'completed', 'pending'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={filter === status ? 'active' : ''}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id} className="todo-item">
            <input type="checkbox" checked={todo.completed} onChange={() => handleToggleComplete(todo.id)} />
            {editingId === todo.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="edit-input"
              />
            ) : (
              <span className={todo.completed ? 'completed' : ''}>{todo.text}</span>
            )}
            {editingId === todo.id ? (
              <button onClick={() => handleSaveEdit(todo.id)} className="save-btn">💾</button>
            ) : (
              <button onClick={() => handleEditTodo(todo.id, todo.text)} className="edit-btn">✏️</button>
            )}
            <button onClick={() => handleDeleteTodo(todo.id)} className="delete-btn">🗑️</button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p className="empty-message">No tasks yet. Add one above!</p>}
    </div>
  );
};

export default TodoApp;
