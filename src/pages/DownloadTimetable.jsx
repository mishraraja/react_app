import { useState } from 'react';
import ClassSelector from '../components/ClassSelector.jsx';
import PageHeader from '../components/PageHeader.jsx';
import TimetableGrid from '../components/TimetableGrid.jsx';
import { CLASSES } from '../data/constants';
import { useTimetable } from '../data/TimetableContext.jsx';
import { downloadExcel, downloadPdf } from '../utils/exporters';

export default function DownloadTimetable() {
  const [className, setClassName] = useState(CLASSES[0]);
  const { timetable } = useTimetable();

  return (
    <>
      <PageHeader title="Download Timetable">
        <div className="d-flex flex-wrap gap-2 align-items-end">
          <div className="selector-width">
            <ClassSelector value={className} onChange={setClassName} />
          </div>
          <button className="btn btn-outline-primary mb-1" onClick={() => downloadPdf(timetable, className)}>
            Download PDF
          </button>
          <button className="btn btn-outline-success mb-1" onClick={() => downloadExcel(timetable, className)}>
            Download Excel
          </button>
        </div>
      </PageHeader>
      <TimetableGrid timetable={timetable} className={className} />
    </>
  );
}
