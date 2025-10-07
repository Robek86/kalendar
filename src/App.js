import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";

function App() {
  const [tabs, setTabs] = useState(() => JSON.parse(localStorage.getItem("tabs")) || [{ id: 1, name: "Default", tasks: [] }]);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [newTabName, setNewTabName] = useState("");
  const [newTask, setNewTask] = useState({ title: "", date: "" });

  useEffect(() => {
    localStorage.setItem("tabs", JSON.stringify(tabs));
  }, [tabs]);

  const addTab = () => {
    if (!newTabName) return;
    const newTab = { id: Date.now(), name: newTabName, tasks: [] };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
    setNewTabName("");
  };

  const addTask = () => {
    if (!newTask.title) return;
    const updatedTabs = tabs.map(tab => {
      if (tab.id === activeTab) {
        return { ...tab, tasks: [...tab.tasks, { ...newTask, id: Date.now(), done: false }] };
      }
      return tab;
    });
    setTabs(updatedTabs);
    setNewTask({ title: "", date: "" });
  };

  const toggleTask = (taskId) => {
    const updatedTabs = tabs.map(tab => {
      if (tab.id === activeTab) {
        return {
          ...tab,
          tasks: tab.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
        };
      }
      return tab;
    });
    setTabs(updatedTabs);
  };

  const deleteTask = (taskId) => {
    const updatedTabs = tabs.map(tab => {
      if (tab.id === activeTab) {
        return { ...tab, tasks: tab.tasks.filter(t => t.id !== taskId) };
      }
      return tab;
    });
    setTabs(updatedTabs);
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
        const tasksForDay = tabs.flatMap(tab => tab.tasks)
          .filter(t => t.date && isSameDay(new Date(t.date), day));

        days.push(
          <div key={day} className={`border border-gray-700 h-24 p-1 ${!isSameMonth(day, monthStart) ? "text-gray-500" : ""}`}>
            <div className="text-sm">{format(day, "d")}</div>
            {tasksForDay.map(task => (
              <div key={task.id} className="text-xs truncate">{task.title}</div>
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

  const activeTabObj = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Calendar & To-Do List</h1>

      <div className="flex mb-4 space-x-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 rounded ${tab.id === activeTab ? "bg-blue-600" : "bg-gray-800"}`}
          >
            {tab.name}
          </button>
        ))}
        <input
          type="text"
          placeholder="New Tab"
          value={newTabName}
          onChange={e => setNewTabName(e.target.value)}
          className="px-2 py-1 rounded bg-gray-700 focus:outline-none"
        />
        <button onClick={addTab} className="px-3 py-1 rounded bg-green-600">Add Tab</button>
      </div>

      <div className="mb-6">{renderCalendar()}</div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">{activeTabObj.name} Tasks</h2>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={e => setNewTask({...newTask, title: e.target.value})}
            className="px-2 py-1 rounded bg-gray-700 flex-1"
          />
          <input
            type="date"
            value={newTask.date}
            onChange={e => setNewTask({...newTask, date: e.target.value})}
            className="px-2 py-1 rounded bg-gray-700"
          />
          <button onClick={addTask} className="px-3 py-1 rounded bg-blue-600">Add</button>
        </div>

        {activeTabObj.tasks.map(task => (
          <div key={task.id} className="flex justify-between items-center bg-gray-800 p-2 rounded mb-1">
            <div>
              <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} className="mr-2" />
              <span className={task.done ? "line-through text-gray-400" : ""}>{task.title}</span>
              {task.date && <span className="ml-2 text-xs text-gray-400">{task.date}</span>}
            </div>
            <button onClick={() => deleteTask(task.id)} className="text-red-500">X</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;