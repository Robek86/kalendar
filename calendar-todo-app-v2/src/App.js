import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";

function App() {
  const [tab, setTab] = useState("calendar");
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tasks")) || []);
  const [newTask, setNewTask] = useState({ title: "", date: "", time: "", desc: "" });
  const [showModal, setShowModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const addTask = () => {
    if (!newTask.title || !newTask.date) return;
    const updatedTasks = [...tasks, { ...newTask, id: Date.now(), done: false }];
    setTasks(updatedTasks);
    setNewTask({ title: "", date: "", time: "", desc: "" });
    setShowModal(false);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const renderCalendar = () => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const tasksForDay = tasks.filter(t => t.date && isSameDay(new Date(t.date), day));

        days.push(
          <div key={day} className={`border border-gray-700 h-28 p-1 m-0.5 rounded ${isSameDay(day, today) ? "bg-blue-700" : !isSameMonth(day, monthStart) ? "text-gray-500" : "bg-gray-800"}`}>
            <div className="text-sm mb-1">{format(day, "d")}</div>
            {tasksForDay.map(task => (
              <div key={task.id} className="bg-blue-600 rounded px-1 py-0.5 mb-1 text-xs truncate" title={task.desc + (task.time ? " at " + task.time : "")}>
                {task.title} {task.time ? `(${task.time})` : ""}
              </div>
            ))}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div key={day} className="grid grid-cols-7">{days}</div>);
      days = [];
    }
    return rows;
  };

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Calendar & To-Do List</h1>
        <div className="text-sm">{format(currentTime, "EEEE, MMMM d, yyyy - HH:mm:ss")}</div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-4">
        <button onClick={() => setTab("calendar")} className={`px-3 py-1 rounded ${tab==="calendar" ? "bg-blue-600" : "bg-gray-800"}`}>Calendar</button>
        <button onClick={() => setTab("tasks")} className={`px-3 py-1 rounded ${tab==="tasks" ? "bg-blue-600" : "bg-gray-800"}`}>Tasks</button>
        <div className="flex-1"></div> {/* space for future tab */}
      </div>

      {tab === "calendar" && (
        <div>
          <button onClick={() => setShowModal(true)} className="mb-2 px-3 py-1 rounded bg-green-600">Add Appointment</button>
          {renderCalendar()}
        </div>
      )}

      {tab === "tasks" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Tasks</h2>
          {tasks.map(task => (
            <div key={task.id} className="flex justify-between items-center bg-gray-800 p-2 rounded mb-1">
              <div>
                <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} className="mr-2" />
                <span className={task.done ? "line-through text-gray-400" : ""}>{task.title}</span>
                {task.date && <span className="ml-2 text-xs text-gray-400">{task.date}</span>}
                {task.time && <span className="ml-2 text-xs text-gray-400">{task.time}</span>}
              </div>
              <button onClick={() => deleteTask(task.id)} className="text-red-500">X</button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-4 rounded w-80">
            <h3 className="text-lg font-semibold mb-2">New Appointment</h3>
            <input type="text" placeholder="Title" value={newTask.title} onChange={e => setNewTask({...newTask, title:e.target.value})} className="w-full mb-2 p-1 rounded bg-gray-700" />
            <input type="date" value={newTask.date} onChange={e => setNewTask({...newTask, date:e.target.value})} className="w-full mb-2 p-1 rounded bg-gray-700" />
            <input type="time" value={newTask.time} onChange={e => setNewTask({...newTask, time:e.target.value})} className="w-full mb-2 p-1 rounded bg-gray-700" />
            <textarea placeholder="Description" value={newTask.desc} onChange={e => setNewTask({...newTask, desc:e.target.value})} className="w-full mb-2 p-1 rounded bg-gray-700"></textarea>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-3 py-1 rounded bg-gray-600">Cancel</button>
              <button onClick={addTask} className="px-3 py-1 rounded bg-blue-600">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;