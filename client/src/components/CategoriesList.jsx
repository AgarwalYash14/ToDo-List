import { useEffect, useState } from "react";
import { FiSquare } from "react-icons/fi";

import io from "socket.io-client";
const socket = io("http://localhost:3001");

export default function CategoriesList({ onCategorySelect }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        socket.emit("getCategories");

        socket.on("categories", (categories) => {
            setCategories(categories);
        });

        socket.on("categoryCreated", (newCategory) => {
            setCategories((prevCategories) => [...prevCategories, newCategory]);
        });

        socket.on("categoriesUpdated", (updatedCategories) => {
            setCategories(updatedCategories);
        });

        return () => {
            socket.off("category");
            socket.off("categoryCreated");
            socket.off("categoriesUpdated");
        };
    }, []);

    return (
        <>
            <div className="flex flex-col gap-2 mr-2">
                {categories.map((category, index) => (
                    <button
                        type="button"
                        onClick={() => onCategorySelect(category)}
                        key={category.id || index}
                        className="flex items-center justify-between p-3 rounded-lg overflow-hidden focus:bg-gray-100 hover:bg-gray-100"
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex justify-center items-center w-7 h-7 overflow-hidden">
                                {category.categoryEmoji !== "" ? (
                                    <h1 className="text-xl text-ellipsis overflow-hidden">
                                        {category.categoryEmoji}
                                    </h1>
                                ) : (
                                    <FiSquare size="20px" />
                                )}
                            </div>
                            <p className="font-bold text-ellipsis overflow-hidden">
                                {category.categoryTitle}
                            </p>
                        </div>
                        <div className="flex items-center justify-center bg-gray-200 h-6 w-8 rounded-xl text-sm">
                            {category.tasksCount || 0}
                        </div>
                    </button>
                ))}
            </div>
        </>
    );
}
