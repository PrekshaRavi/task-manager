import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const API = "http://localhost:5000/api/tasks";

  const fetchTasks = async () => {
    const res = await fetch(API);
    setTasks(await res.json());
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title) return alert("Title required");

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    });

    setTitle("");
    fetchTasks();
  };

  const markComplete = async (task) => {
    await fetch(`${API}/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, status: "completed" })
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Task Manager</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task"
      />
      <button onClick={addTask}>Add</button>

      {tasks.length === 0 ? (
  <p>No tasks yet. Add one above 👆</p>
) : (
  <ul>
    {tasks.map((t) => (
      <li key={t.id}>
        {t.title} - {t.status}
        <button onClick={() => markComplete(t)}>✔</button>
        <button onClick={() => deleteTask(t.id)}>🗑</button>
      </li>
    ))}
  </ul>
)}

    </div>
  );
}

export default App;
