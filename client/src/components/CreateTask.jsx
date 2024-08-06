import { IoIosAdd, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoCalendarOutline } from "react-icons/io5";
import { TbNotes } from "react-icons/tb";
import { useEffect, useRef, useState } from "react";

import CategoriesList from "./CategoriesList";
import SelectDate from "./SelectDate";
import SetNotes from "./SetNotes";

import io from "socket.io-client";
import { FiSquare } from "react-icons/fi";
const socket = io("http://localhost:3001");

export default function CreateTask({ editingTask }) {
    const [task, setTask] = useState(false);
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [isError, setIsError] = useState(false);
    const [categories, setCategories] = useState(false);
    const [date, setDate] = useState(true);
    const [notesDiv, setNotesDiv] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const inputRef = useRef(null);

    useEffect(() => {
        if (task) {
            inputRef.current.focus();
        }
    }, [task]);

    useEffect(() => {
        if (isError) {
            inputRef.current.focus();
        }
    }, [isError]);

    useEffect(() => {
        if (editingTask) {
            setTask(true);
            setTitle(editingTask.title);
            setNotes(editingTask.notes);
            setSelectedCategory({
                id: editingTask.categoryID,
                categoryEmoji: editingTask.categoryEmoji,
                categoryTitle: editingTask.categoryTitle,
            });
            setSelectedDate(editingTask.date);
            setSelectedTime(editingTask.time);
        }
    }, [editingTask]);

    const toggleTask = () => {
        setTask(!task);

        setTitle("");
        setNotes("");
        setIsError(false);
        setCategories(false);
        setDate(true);
        setNotesDiv(false);
    };

    const toggleCategory = () => {
        setCategories(!categories);
        setDate(false);
        setNotesDiv(false);
    };

    const toogleDate = () => {
        setDate(!date);
        setCategories(false);
        setNotesDiv(false);
    };

    const toggleNotesDiv = () => {
        setNotesDiv(!notesDiv);
        setDate(false);
        setCategories(false);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setCategories(false);
        setNotesDiv(true);
    };

    const handleDateSelect = (dateString) => {
        setSelectedDate(dateString);
    };

    const handleTimeSelect = (timeString) => {
        setSelectedTime(timeString);
    };

    const handleNotesChange = (newNotes) => {
        setNotes(newNotes);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (title.trim() === "") {
            setIsError(true);
            return;
        }

        const taskData = {
            id: Math.random().toString(36).substr(2, 9),
            title: title.trim(),
            notes: notes.trim(),
            categoryID: selectedCategory ? selectedCategory.id : null,
            categoryEmoji: selectedCategory
                ? selectedCategory.categoryEmoji
                : "",
            categoryTitle: selectedCategory
                ? selectedCategory.categoryTitle
                : "",
            date: selectedDate ? new Date(selectedDate).toISOString() : null,
            time: selectedTime ? new Date(selectedTime).toISOString() : null,
            createdAt: new Date().toISOString(),
        };

        if (editingTask) {
            socket.emit("updateTask", taskData);
        } else {
            socket.emit("addTask", taskData);
        }
        toggleTask();
    };

    return (
        <div className="relative">
            {task && (
                <form
                    onSubmit={handleSubmit}
                    className="absolute w-96 bottom-14 bg-white p-2 flex flex-col gap-2 rounded-xl shadow-2xl border overflow-hidden"
                    id="taskForm"
                >
                    <input
                        ref={inputRef}
                        type="text"
                        className={`bg-gray-100 w-full p-3 rounded-lg text-sm outline-none ${
                            isError ? "border border-red-500" : ""
                        }`}
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            setIsError(false);
                        }}
                        placeholder="Create new task"
                        id="taskTitle"
                    />
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={toggleCategory}
                                className="w-full border border-gray-300 flex items-center justify-between px-3 rounded-lg text-sm outline-none"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex justify-center items-center w-7 h-7 overflow-hidden">
                                        {selectedCategory ? (
                                            selectedCategory.categoryEmoji
                                        ) : (
                                            <FiSquare size="20px" />
                                        )}
                                    </div>
                                    <p className="font-bold text-ellipsis overflow-hidden">
                                        {selectedCategory
                                            ? selectedCategory.categoryTitle
                                            : "No Category"}
                                    </p>
                                </div>
                                {categories ? (
                                    <IoIosArrowUp size="15px" />
                                ) : (
                                    <IoIosArrowDown size="15px" />
                                )}
                            </button>
                            <button
                                type="button"
                                className="border border-gray-300 rounded-lg p-3 focus:bg-black focus:text-white"
                                onClick={toogleDate}
                            >
                                <IoCalendarOutline size="20px" />
                            </button>
                            <button
                                type="button"
                                onClick={toggleNotesDiv}
                                className="border border-gray-300 rounded-lg p-3 focus:bg-black focus:text-white"
                            >
                                <TbNotes size="20px" />
                            </button>
                        </div>
                        {categories && (
                            <div className="h-[49vh] overflow-auto">
                                <CategoriesList
                                    onCategorySelect={handleCategorySelect}
                                />
                            </div>
                        )}
                        {date && (
                            <SelectDate
                                onDateSelect={handleDateSelect}
                                onTimeSelect={handleTimeSelect}
                            />
                        )}
                        {notesDiv && (
                            <SetNotes
                                notes={notes}
                                onNotesChange={handleNotesChange}
                            />
                        )}
                    </div>
                    <button
                        type="submit"
                        id="createTask"
                        className="w-full bg-blue-600 text-white text-sm p-3 rounded-full hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </form>
            )}

            <button
                onClick={toggleTask}
                className="bg-black w-96 p-3 flex items-center gap-1 text-white text-base rounded-full text-left hover:bg-zinc-900 focus:bg-zinc-900 focus:text-white transition-colors"
            >
                <IoIosAdd size="25px" />
                Create new task
            </button>
        </div>
    );
}
