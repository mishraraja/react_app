import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { DAYS, PERIODS } from '../data/constants';

function timetableRows(timetable, className) {
  return DAYS.map((day) => [
    day,
    ...PERIODS.map((period) => {
      const entry = timetable[className]?.[day]?.[period];
      return entry?.subjectName === 'Free Period'
        ? 'Free Period'
        : `${entry?.subjectName || 'Free Period'}${entry?.teacherName ? `\n${entry.teacherName}` : ''}`;
    }),
  ]);
}

export function downloadPdf(timetable, className) {
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(16);
  doc.text(`${className} Weekly Timetable`, 14, 14);
  autoTable(doc, {
    startY: 22,
    head: [['Day', ...PERIODS.map((period) => `P${period}`)]],
    body: timetableRows(timetable, className),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [28, 75, 105] },
  });
  doc.save(`${className.replace(' ', '_')}_timetable.pdf`);
}

export function downloadExcel(timetable, className) {
  const rows = timetableRows(timetable, className).map((row) => {
    const record = { Day: row[0] };
    PERIODS.forEach((period, index) => {
      record[`Period ${period}`] = row[index + 1].replace('\n', ' - ');
    });
    return record;
  });

  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, sheet, className);
  XLSX.writeFile(workbook, `${className.replace(' ', '_')}_timetable.xlsx`);
}
