import { useState } from "react";
import TaskList from "./components/TaskList.jsx";
import TaskForm from "./components/TaskForm.jsx";
import "./App.css";

// GT13: the tasks are typed in here, in the browser.
// Session 14 replaces this array with GET /api/tasks.
const STARTING_TASKS = [
  { id: 1, title: "Read the Session 13 notes", dueDate: "2026-10-29" },
  { id: 2, title: "Build the TaskList component", dueDate: "2026-10-30" },
  { id: 3, title: "Push GT13 to GitHub", dueDate: "2026-10-31" },
];

function App() {
  const [tasks, setTasks] = useState(STARTING_TASKS);

  function addTask(title) {
    const newTask = {
      id: Date.now(),
      title: title,
      dueDate: new Date().toLocaleDateString("en-CA"),
    };
    setTasks([...tasks, newTask]);
  }

  return (
    <main className="task-manager">
      <h1>Task Manager</h1>
      <p className="count">{tasks.length} tasks</p>
      <TaskForm onAdd={addTask} />
      <TaskList tasks={tasks} />
    </main>
  );
}

export default App;