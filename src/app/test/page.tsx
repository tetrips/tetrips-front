'use client';

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker'
import { useState } from 'react'
import ProjectList from '@/components/project/ProjectList'

export default function Page() {
  const [startDate, setStartDate] = useState(new Date());

  return (
<ProjectList />
  );
}