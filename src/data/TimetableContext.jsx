import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { EMPTY_ENTRY } from './constants';
import { initialAllotments, initialSubjects, initialTeachers } from './seedData';
import { loadState, saveState } from '../utils/storage';
import {
  createEmptyTimetable,
  generateTimetable,
  hasTeacherConflict,
  normalizeTimetable,
  setTimetableEntry,
  teacherDayLoad,
} from '../utils/timetable';
import { getSubjectVerificationIssue } from '../utils/verification';

const STORAGE_KEY = 'school-timetable-state-v2-excel-source';
const TimetableContext = createContext(null);

export function TimetableProvider({ children }) {
  const saved = loadState(STORAGE_KEY, null);
  const [subjects, setSubjects] = useState(saved?.subjects || initialSubjects);
  const [teachers, setTeachers] = useState(saved?.teachers || initialTeachers);
  const [allotments, setAllotments] = useState(saved?.allotments || initialAllotments);
  const [timetable, setTimetable] = useState(normalizeTimetable(saved?.timetable || createEmptyTimetable()));
  const [message, setMessage] = useState(null);

  useEffect(() => {
    saveState(STORAGE_KEY, { subjects, teachers, allotments, timetable });
  }, [subjects, teachers, allotments, timetable]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 3500);
  };

  const saveManualEntry = ({ className, day, period, subjectId, teacherId }) => {
    const subject = subjects.find((item) => item.id === subjectId);
    const teacher = teachers.find((item) => item.id === teacherId);

    if (!subject || !teacher) {
      showMessage('danger', 'Please select a valid subject and teacher.');
      return false;
    }

    if (hasTeacherConflict(timetable, teacherId, className, day, period)) {
      showMessage('danger', `${teacher.name} is already assigned to another class in this slot.`);
      return false;
    }

    const currentTeacherInSlot = timetable[className]?.[day]?.[period]?.teacherId;
    const load = teacherDayLoad(timetable, teacherId, day);
    if (currentTeacherInSlot !== teacherId && load >= Number(teacher.maxPeriodsPerDay)) {
      showMessage('danger', `${teacher.name} has reached the maximum periods for ${day}.`);
      return false;
    }

    setTimetable((current) =>
      setTimetableEntry(current, className, day, period, {
        subjectId: subject.id,
        subjectName: subject.name,
        teacherId: teacher.id,
        teacherName: teacher.name,
      }),
    );
    showMessage('success', 'Timetable entry saved.');
    return true;
  };

  const deleteManualEntry = (className, day, period) => {
    setTimetable((current) => setTimetableEntry(current, className, day, period, { ...EMPTY_ENTRY }));
    showMessage('success', 'Timetable entry cleared.');
  };

  const runAutomaticGeneration = () => {
    const pending = subjects.filter((subject) =>
      String(subject.verificationStatus || '').toLowerCase().includes('needs verification'),
    );
    if (pending.length) {
      showMessage('danger', `${pending.length} allotment rows need admin verification before final generation.`);
      return false;
    }
    const invalid = subjects.filter((subject) => getSubjectVerificationIssue(subject));
    if (invalid.length) {
      showMessage('danger', `${invalid.length} allotment rows have rule conflicts. Correct them in Subjects before generation.`);
      return false;
    }
    setTimetable(generateTimetable(subjects, teachers, allotments));
    showMessage('success', 'Automatic timetable generated.');
    return true;
  };

  const value = useMemo(
    () => ({
      subjects,
      setSubjects,
      teachers,
      setTeachers,
      allotments,
      setAllotments,
      timetable,
      setTimetable,
      message,
      showMessage,
      saveManualEntry,
      deleteManualEntry,
      runAutomaticGeneration,
    }),
    [subjects, teachers, allotments, timetable, message],
  );

  return <TimetableContext.Provider value={value}>{children}</TimetableContext.Provider>;
}

export function useTimetable() {
  return useContext(TimetableContext);
}
