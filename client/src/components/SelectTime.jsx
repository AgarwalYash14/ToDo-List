import { useState } from "react";
import SelectDate from "./SelectDate";

export default function SelectTime({ onTimeSelect }) {
    const [time, setTime] = useState(true);
    const [date, setDate] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);

    const toggleDate = () => {
        setDate(!date);
        setTime(false);
    };

    const handleTimeSelect = (time) => {
        const [hours, minutes] = time.split(":");
        const dateTime = new Date();
        dateTime.setHours(parseInt(hours, 10));
        dateTime.setMinutes(parseInt(minutes, 10));
        setSelectedTime(dateTime);
        onTimeSelect(dateTime.toISOString()); // Pass ISO string to parent
    };

    const times = [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
    ];

    return (
        <>
            {time && (
                <div>
                    <div className="grid grid-cols-4 py-3 gap-2">
                        {times.map((time) => (
                            <button
                                type="button"
                                key={time}
                                onClick={() => handleTimeSelect(time)}
                                className="bg-gray-100 text-gray-500 text-sm py-2 px-4 rounded-full hover:bg-blue-100 focus:bg-blue-600 focus:text-white transition-colors"
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col justify-between items-center gap-2">
                        <button
                            type="button"
                            onClick={toggleDate}
                            className="w-full bg-blue-100 text-blue-600 text-sm font-medium p-3 mt-2 rounded-full hover:bg-blue-200"
                        >
                            Set date
                        </button>
                    </div>
                </div>
            )}
            {date && <SelectDate onDimeSelect={onTimeSelect} />}
        </>
    );
}
