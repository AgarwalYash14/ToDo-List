import { useEffect, useState } from "react";
import { IconContext } from "react-icons";

import EditTask from "./EditTask";
import DeleteTask from "./DeleteTask";

import io from "socket.io-client";
import { FiSquare } from "react-icons/fi";
import Greetings from "./Greetings";
import CreateTask from "./CreateTask";
const socket = io("http://localhost:3001");

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [checkedTasks, setCheckedTasks] = useState(false);
    const [categories, setCategories] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("all");
    const [editingTask, setEditingTask] = useState(null);

    const toggleCheckedTasks = (taskId) => {
        setCheckedTasks((prevCheckedTasks) => {
            const newCheckedState = !prevCheckedTasks[taskId];
            socket.emit("updateTaskCheckedState", taskId, newCheckedState);
            return {
                ...prevCheckedTasks,
                [taskId]: newCheckedState,
            };
        });
    };

    useEffect(() => {
        socket.on("taskCheckedStateUpdated", ({ taskId, isChecked }) => {
            setCheckedTasks((prevCheckedTasks) => ({
                ...prevCheckedTasks,
                [taskId]: isChecked,
            }));
        });

        return () => {
            socket.off("taskCheckedStateUpdated");
        };
    }, []);

    useEffect(() => {
        socket.emit("getTasks");

        socket.on("tasksAndCategories", ({ tasks, categories }) => {
            setTasks(tasks);
            setCategories(categories);
            const initialCheckedState = tasks.reduce((acc, task) => {
                acc[task.id] = task.isChecked || false;
                return acc;
            }, {});
            setCheckedTasks(initialCheckedState);
        });

        socket.on("taskAdded", (newTask) => {
            setTasks((prevTasks) => [newTask, ...prevTasks]);
        });

        socket.on("taskDeleted", (taskId) => {
            setTasks((prevTasks) =>
                prevTasks.filter((task) => task.id !== taskId)
            );
        });

        socket.on("categoryCreated", (newCategory) => {
            setCategories((prevCategories) => [...prevCategories, newCategory]);
        });

        socket.on("categoriesUpdated", (updatedCategories) => {
            setCategories(updatedCategories);
        });

        return () => {
            socket.off("tasksAndCategories");
            socket.off("taskAdded");
            socket.off("taskDeleted");
            socket.off("categoryCreated");
            socket.off("categoriesUpdated");
        };
    }, []);

    useEffect(() => {
        let filtered = tasks;

        // Apply date filter
        if (dateFilter !== "all") {
            const now = new Date();
            const today = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const lastWeek = new Date(today);
            lastWeek.setDate(lastWeek.getDate() - 7);

            filtered = filtered.filter((task) => {
                const taskDate = new Date(task.createdAt);
                switch (dateFilter) {
                    case "today":
                        return taskDate >= today;
                    case "yesterday":
                        return taskDate >= yesterday && taskDate < today;
                    case "lastWeek":
                        return taskDate >= lastWeek;
                    default:
                        return true;
                }
            });
        }

        // Apply search filter
        if (searchTerm.trim() !== "") {
            filtered = filtered.filter(
                (task) =>
                    task.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    task.notes
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    task.categoryTitle
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        setFilteredTasks(filtered);
    }, [searchTerm, dateFilter, tasks]);

    const getCategoryEmoji = (categoryTitle) => {
        const category = categories.find(
            (cat) => cat.categoryTitle === categoryTitle
        );
        return category ? category.categoryEmoji : <FiSquare size="20px" />;
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleDateFilter = (filter) => {
        setDateFilter(filter);
    };

    const handleEdit = (task) => {
        setEditingTask(task);
    };

    return (
        <>
            <Greetings
                onSearch={handleSearch}
                onDateFilter={handleDateFilter}
            />

            <div className="relative flex flex-col gap-2 mr-2 h-[60vh] overflow-auto">
                {filteredTasks.map((task, index) => (
                    <div
                        key={task.id || index}
                        className="bg-white flex justify-between items-center gap-2 px-2 py-2 rounded shadow overflow-hidden"
                    >
                        <div className="w-full flex items-center gap-2 pl-2">
                            <input
                                onChange={() => toggleCheckedTasks(task.id)}
                                checked={checkedTasks[task.id] || false}
                                type="checkbox"
                                name=""
                                id={`task-${task.id}`}
                            />
                            <h1
                                className={`text-ellipsis overflow-hidden ${
                                    checkedTasks[task.id]
                                        ? "line-through text-gray-400"
                                        : ""
                                }`}
                            >
                                {task.title}
                            </h1>

                            <span className="bg-gray-100 rounded-md p-[2px]">
                                {getCategoryEmoji(task.categoryTitle)}
                            </span>

                            <p className="text-sm text-gray-500 text-ellipsis overflow-hidden">
                                {task.notes}
                            </p>
                        </div>
                        <IconContext.Provider
                            value={{ color: "#4b5563", size: "1rem" }}
                        >
                            <div className="">
                                <EditTask task={task} onEdit={handleEdit} />
                            </div>
                            <div>
                                <DeleteTask taskId={task.id} />
                            </div>
                        </IconContext.Provider>
                    </div>
                ))}
            </div>
            <div className="absolute bottom-12">
                <CreateTask editingTask={editingTask} />
            </div>
        </>
    );
}
