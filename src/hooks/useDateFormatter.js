const useDateFormatter = () => {
  // Ex. 9/10/2023 - ٩/١٠/٢٠٢٣
  const formatDateShort = (timestamp, lang) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US");
  };

  // Ex. Monday 10/9/2023 at 4:22 PM - الاثنين ٩/١٠/٢٠٢٣ في 4:22 م
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

    const arabicNumerals = "٠١٢٣٤٥٦٧٨٩";
    const toArabicNumerals = (number) => {
      return number
        .toString()
        .split("")
        .map((digit) => arabicNumerals[parseInt(digit)])
        .join("");
    };

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampmEn = hours >= 12 ? "PM" : "AM";
    const ampmAr = lang === "ar" ? "م" : ampmEn;

    const formattedHours = hours % 12 || 12;

    const formattedDate =
      lang === "ar"
        ? `${dayOfWeek} ${toArabicNumerals(day)}/${toArabicNumerals(
            month
          )}/${toArabicNumerals(year)} في ${formattedHours}:${minutes
            .toString()
            .padStart(2, "0")} ${ampmAr}`
        : `${dayOfWeek} ${month}/${day}/${year} at ${formattedHours}:${minutes
            .toString()
            .padStart(2, "0")} ${ampmEn}`;

    return formattedDate;
  };

  // Ex. 10:30 PM - ١٠:٣٠ م
  const formatTime = (timestamp, lang) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Ex. October 9, 2023 - ٩ أكتوبر ٢٠٢٣
  const formatDateWithMonthName = (timestamp, lang) => {
    const date = new Date(timestamp);

    if (lang === "ar") {
      return date.toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return {
    formatDateShort,
    formatDateLong,
    formatTime,
    formatDateWithMonthName,
  };
};

export default useDateFormatter;
