import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoCalendarOutline } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import SelectTime from "./SelectTime";

export default function SelectDate({ onDateSelect }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [date, setDate] = useState(true);
    const [time, setTime] = useState(false);

    const toggleTime = () => {
        setTime(!time);
        setDate(false);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        onDateSelect(date.toISOString());
    };

    const CustomHeader = ({
        date,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
    }) => (
        <div className="w-full bg-blue-100 flex justify-between items-center rounded-full text-blue-600 font-[WantedSans-Regular] p-1">
            <button
                type="button"
                onChange={handleDateChange}
                className="bg-white flex items-center justify-center rounded-full p-2"
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
            >
                <IoIosArrowBack size="20px" />
            </button>
            <span className="flex items-center justify-center gap-2 font-bold">
                <IoCalendarOutline size="15px" />
                {date.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                })}
            </span>
            <button
                type="button"
                className="bg-white flex items-center justify-center rounded-full p-2"
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
            >
                <IoIosArrowForward size="20px" />
            </button>
        </div>
    );

    return (
        <>
            {date && (
                <div>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        inline
                        renderCustomHeader={CustomHeader}
                    />

                    <div className="flex flex-col justify-between items-center gap-2">
                        <button
                            type="button"
                            className="w-full bg-blue-100 text-blue-600 text-sm font-medium p-3 mt-2 rounded-full hover:bg-blue-200 transition-colors"
                            onClick={toggleTime}
                        >
                            Set time
                        </button>
                    </div>
                </div>
            )}
            {time && <SelectTime onTimeSelect={onDateSelect} />}
        </>
    );
}
