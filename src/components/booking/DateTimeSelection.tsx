interface DateTimeSelectionProps {
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}

const timeSlots = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

// Generate next 7 days for demo
const getNextDays = () => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i + 1); // Start from tomorrow
    dates.push({
      day: date.toLocaleDateString("sv-SE", { weekday: "short" }),
      date: date.getDate(),
      month: date.toLocaleDateString("sv-SE", { month: "short" }),
      fullDate: date.toISOString().split("T")[0],
    });
  }
  return dates;
};

export function DateTimeSelection({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: DateTimeSelectionProps) {
  const dates = getNextDays();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">Select Date</h2>
        <p className="text-navy-500 mb-4">Choose your preferred day</p>

        <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2">
          {dates.map((dateObj) => (
            <button
              key={dateObj.fullDate}
              onClick={() => onSelectDate(dateObj.fullDate)}
              className={`
                flex flex-col items-center justify-center min-w-[85px] h-24 rounded-xl border transition-all
                ${selectedDate === dateObj.fullDate
                  ? "bg-navy-900 text-cream-100 border-navy-900"
                  : "bg-cream-50 border-cream-200 text-navy-900 hover:border-brass-300 hover:bg-white"
                }
              `}
            >
              <span className={`text-xs font-medium uppercase ${
                selectedDate === dateObj.fullDate ? "text-cream-300" : "text-navy-500"
              }`}>
                {dateObj.day}
              </span>
              <span className="text-2xl font-bold my-1">{dateObj.date}</span>
              <span className={`text-xs ${
                selectedDate === dateObj.fullDate ? "text-cream-300" : "text-navy-500"
              }`}>
                {dateObj.month}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">Select Time</h2>
          <p className="text-navy-500 mb-4">Available time slots</p>

          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => onSelectTime(time)}
                className={`
                  py-3 px-2 rounded-lg border text-sm font-medium transition-all
                  ${selectedTime === time
                    ? "bg-navy-900 text-cream-100 border-navy-900"
                    : "bg-cream-50 border-cream-200 text-navy-900 hover:border-brass-300 hover:bg-white"
                  }
                `}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
