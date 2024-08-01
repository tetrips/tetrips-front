'use client';

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker'
import { useState } from 'react'

export default function Page() {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <DatePicker
      selected={startDate}
      onChange={(date: Date | null) => {
        if (date) setStartDate(date);
      }}
      dateFormat="yyyy/MM/dd"
      peekNextMonth
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
    />
  );
}