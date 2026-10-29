import { useState, useEffect } from "react";
import TaskList from "./components/TaskList.jsx";
import TaskForm from "./components/TaskForm.jsx";
import LoginForm from "./components/LoginForm.jsx";
import "./App.css";

// GT14: the address of the API comes from .env, not from this file.
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const [addError, setAddError] = useState("");

  async function loadTasks() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/tasks`);
      if (!res.ok) {
        throw new Error(`The server answered ${res.status}`);
      }
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(`Could not load the tasks: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  // [] means: run once, after the first render
  useEffect(() => {
    loadTasks();
  }, []);

  // POST needs the token, so only a logged-in page can reach this.
  async function addTask(title) {
    setAddError("");
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          dueDate: new Date().toLocaleDateString("en-CA"),
          completed: false,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `The server answered ${res.status}`);
      }
      // fetch the list again so the new row comes from the database
      await loadTasks();
    } catch (err) {
      setAddError(`Could not add the task: ${err.message}`);
    }
  }

  return (
    <main className="task-manager">
      <h1>Task Manager</h1>

      {token ? (
        <>
          <p className="status">
            Logged in. <button onClick={() => setToken(null)}>Log out</button>
          </p>
          <TaskForm onAdd={addTask} />
          {addError && <p className="status error">{addError}</p>}
        </>
      ) : (
        <LoginForm onLogin={setToken} />
      )}

      {loading && <p className="status">Loading...</p>}
      {error && <p className="status error">{error}</p>}
      {!loading && !error && (
        <>
          <p className="count">{tasks.length} tasks</p>
          <TaskList tasks={tasks} />
        </>
      )}
    </main>
  );
}

export default App;