import { CLASSES } from './constants';
import { classSectionName, teacherSubjectAllotmentRows } from './excelSeedRows';

export const initialSubjects = teacherSubjectAllotmentRows.map((row, index) => ({
  id: `S${String(index + 1).padStart(3, '0')}`,
  name: row.subject,
  className: classSectionName(row),
  weeklyPeriods: Number(row.periodsPerWeek) || 1,
  daysPerWeek: Number(row.daysPerWeek) || 1,
  periodsTogether: Number(row.periodsTogether) || 1,
  remark: row.remark,
  verificationStatus: row.verificationStatus,
}));

export const initialTeachers = [...new Set(teacherSubjectAllotmentRows.map((row) => row.teacherName))].map(
  (teacherName, index) => {
    const rows = teacherSubjectAllotmentRows.filter((row) => row.teacherName === teacherName);
    return {
      id: `T${String(index + 1).padStart(3, '0')}`,
      name: teacherName,
      assignedSubjects: [...new Set(rows.map((row) => row.subject))],
      availableClasses: [...new Set(rows.map((row) => classSectionName(row)))],
      maxPeriodsPerDay: 8,
    };
  },
);

export const initialAllotments = initialSubjects.map((subject, index) => {
  const sourceRow = teacherSubjectAllotmentRows[index];
  const teacher = initialTeachers.find((item) => item.name === sourceRow.teacherName);
  return {
    id: `A${index + 1}`,
    className: subject.className,
    subjectId: subject.id,
    teacherId: teacher?.id || '',
  };
});
