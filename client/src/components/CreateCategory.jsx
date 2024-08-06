import { IoIosAdd } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { FiSquare } from "react-icons/fi";

import EmojiPicker from "emoji-picker-react";

import io from "socket.io-client";
const socket = io("http://localhost:3001");

export default function CreateCategory() {
    const [category, setCategory] = useState(false);
    const [categoryEmoji, setCategoryEmoji] = useState("");
    const [categoryTitle, setCategoryTitle] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [iserror, setIsError] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (category) {
            inputRef.current.focus();
        }
    }, [category]);

    useEffect(() => {
        if (iserror) {
            inputRef.current.focus();
        }
    }, [iserror]);

    const toggleCategory = () => {
        setCategory(!category);

        setCategoryEmoji("");
        setCategoryTitle("");
        setIsError(false);
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const onEmojiClick = (emojiObject) => {
        setCategoryEmoji(emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (categoryTitle.trim() === "") {
            setIsError("Category name cannot be blank");
            return;
        }

        const newCategory = {
            id: Math.random().toString(36).substr(2, 9),
            categoryEmoji,
            categoryTitle,
            createdAt: new Date().toISOString(),
        };

        socket.emit("createCategory", newCategory);

        toggleCategory();
    };

    return (
        <div className="relative">
            {category && (
                <form
                    onSubmit={handleSubmit}
                    className="absolute w-full bottom-14 bg-white p-2 flex flex-col gap-2 rounded-lg shadow-2xl border overflow-hidden"
                    id="categoryForm"
                >
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={toggleEmojiPicker}
                                className="bg-gray-100 w-1/6 py-2 px-2 rounded-md text-sm outline-none flex items-center justify-center"
                            >
                                {categoryEmoji || <FiSquare size="20px" />}
                            </button>

                            <input
                                ref={inputRef}
                                type="text"
                                className={`bg-gray-100 w-full py-2 px-2 rounded-md text-sm outline-none ${
                                    iserror ? "border border-red-500" : ""
                                }`}
                                value={categoryTitle}
                                onChange={(e) => {
                                    setCategoryTitle(e.target.value);
                                    setIsError(false);
                                }}
                                placeholder={"Create new category"}
                                id="categoryTitle"
                            />
                        </div>
                        {showEmojiPicker && (
                            <div className="w-10 z-10">
                                <EmojiPicker
                                    onEmojiClick={onEmojiClick}
                                    width={240}
                                    height={300}
                                    searchDisabled
                                    categoriesDisabled
                                    defaultSkinTone="neutral"
                                    suggestedEmojisMode="none"
                                    previewConfig={{ showPreview: false }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col justify-between items-center gap-2">
                        <button
                            type="button"
                            id="cancelCategory"
                            onClick={toggleCategory}
                            className="w-full bg-blue-100 text-blue-600 text-sm font-medium p-2 rounded-full"
                        >
                            Cancel
                        </button>
                        <button
                            id="createCategory"
                            className="w-full bg-blue-600 text-white text-sm p-2 rounded-full"
                        >
                            Create
                        </button>
                    </div>
                </form>
            )}

            <button
                onClick={toggleCategory}
                className="w-full bg-gray-200 p-3 flex items-center gap-1 text-base rounded-full text-left"
            >
                <IoIosAdd size="25px" />
                Create new list
            </button>
        </div>
    );
}
