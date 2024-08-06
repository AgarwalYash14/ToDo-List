import { useEffect, useRef, useState } from "react";

export default function Search({ onSearch, onDateFilter }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("all");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const options = [
        { value: "all", label: "All Time" },
        { value: "today", label: "Today" },
        { value: "yesterday", label: "Yesterday" },
        { value: "lastWeek", label: "Last Week" },
    ];

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const handleDateFilterChange = (value) => {
        setDateFilter(value);
        onDateFilter(value);
        setIsOpen(false); // Close the dropdown after selection
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <>
            <div className="flex items-center">
                <div>
                    <input
                        type="search"
                        placeholder="Search"
                        className="outline-none p-2 px-3 mr-2 rounded-md border text-sm"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                <div
                    className="relative flex items-center justify-end mr-2"
                    ref={dropdownRef}
                >
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="outline-none p-2 rounded-md border bg-white text-black cursor-pointer w-32 text-left text-sm flex items-center gap-2"
                    >
                        <svg
                            className="w-5 h-5 text-gray-400 bg-gray-100 rounded gap-2 "
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>
                            {
                                options.find((opt) => opt.value === dateFilter)
                                    .label
                            }
                        </span>
                    </button>
                    {isOpen && (
                        <div className="absolute right-0 top-11 py-2 w-32 bg-white border rounded-md shadow-lg z-10">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() =>
                                        handleDateFilterChange(option.value)
                                    }
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
