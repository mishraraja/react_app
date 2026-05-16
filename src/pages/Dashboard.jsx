import { useState } from 'react';
import ClassSelector from '../components/ClassSelector.jsx';
import PageHeader from '../components/PageHeader.jsx';
import TimetableGrid from '../components/TimetableGrid.jsx';
import { CLASSES } from '../data/constants';
import { useTimetable } from '../data/TimetableContext.jsx';

export default function Dashboard() {
  const [className, setClassName] = useState(CLASSES[0]);
  const { timetable } = useTimetable();

  return (
    <>
      <PageHeader title="Dashboard">
        <div className="selector-width">
          <ClassSelector value={className} onChange={setClassName} />
        </div>
      </PageHeader>
      <TimetableGrid timetable={timetable} className={className} />
    </>
  );
}
