import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://localhost:7269";

interface Task {
  id: number;
  name: string;
  status: "pending" | "in progress" | "completed" | "overdue";
  updatedDate?: string | null;
}

const statusColors: Record<Task["status"], string> = {
  pending: "#FFFF99", // Light Yellow
  "in progress": "#ADD8E6", // Light Blue
  completed: "#90EE90", // Light Green
  overdue: "#F08080", // Light Red
};

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get<Task[]>(`${BASE_URL}/tasks`);
    setTasks(response.data);
  };

  const generateTask = async () => {
    const response = await axios.post<Task>(`${BASE_URL}/tasks`);
    setTasks([...tasks, response.data]);
  };

  const updateTaskStatus = async (id: number, status: Task["status"]) => {
    await axios.put(`${BASE_URL}/tasks/${id}?status=${status}`);
    fetchTasks();
  };

  return (
    <div style={{ padding: "16px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>Task Manager</h1>
      <button
        style={{ marginBottom: "16px", padding: "8px 16px", backgroundColor: "#007BFF", color: "white", borderRadius: "4px", border: "none", cursor: "pointer" }}
        onClick={generateTask}
      >
        Generate Task
      </button>
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid gray" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid gray", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid gray", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid gray", padding: "8px" }}>Status</th>
            <th style={{ border: "1px solid gray", padding: "8px" }}>Last Modified</th>
            <th style={{ border: "1px solid gray", padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} style={{ backgroundColor: statusColors[task.status], border: "1px solid gray" }}>
              <td style={{ border: "1px solid gray", padding: "8px" }}>{task.id}</td>
              <td style={{ border: "1px solid gray", padding: "8px" }}>{task.name}</td>
              <td style={{ border: "1px solid gray", padding: "8px" }}>{task.status}</td>
              <td style={{ border: "1px solid gray", padding: "8px" }}>{task.updatedDate || "-"}</td>
              <td style={{ border: "1px solid gray", padding: "8px" }}>
                <select
                title="Update Task Status"
                  style={{ padding: "4px", border: "1px solid gray", borderRadius: "4px" }}
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value as Task["status"])}
                >
                  {Object.keys(statusColors).map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
