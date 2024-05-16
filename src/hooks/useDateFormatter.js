const useDateFormatter = () => {
  const formatDateShort = (timestamp, lang) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US");
  };

  const formatDateLong = (timestamp, lang) => {
    const date = new Date(timestamp);

    const daysOfWeekEn = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const daysOfWeekAr = [
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];

    const daysOfWeek = lang === "ar" ? daysOfWeekAr : daysOfWeekEn;
    const dayOfWeek = daysOfWeek[date.getDay()];

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    const formattedDate = `${dayOfWeek} ${month}/${day}/${year} at ${formattedHours}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;

    return formattedDate;
  };

  const formatTime = (timestamp, lang) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return { formatDateShort, formatDateLong, formatTime };
};

export default useDateFormatter;
