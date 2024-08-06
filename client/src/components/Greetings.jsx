import { useState } from "react";
import Search from "./Search";

export default function Greetings({ onSearch, onDateFilter }) {
    const getGreeting = () => {
        const now = new Date();
        const hour = now.getHours();

        if (hour >= 5 && hour < 12) return "Good Morning";
        else if (hour >= 12 && hour < 18) return "Good Afternoon";
        else return "Good Evening";
    };

    const [todayDate, setTodayDate] = useState(new Date());

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-[WantedSans-Bold]">
                        {getGreeting()}
                    </h1>
                    <h2 className="text-gray-400 text-lg mt-1">
                        Today, {todayDate.toDateString()}
                    </h2>
                </div>
                <div>
                    <Search onSearch={onSearch} onDateFilter={onDateFilter} />
                </div>
            </div>
        </>
    );
}
