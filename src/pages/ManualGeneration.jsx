import { useMemo, useState } from 'react';
import ClassSelector from '../components/ClassSelector.jsx';
import PageHeader from '../components/PageHeader.jsx';
import TimetableGrid from '../components/TimetableGrid.jsx';
import { CLASSES, DAYS, PERIODS } from '../data/constants';
import { useTimetable } from '../data/TimetableContext.jsx';

export default function ManualGeneration() {
  const { subjects, teachers, allotments, timetable, saveManualEntry, deleteManualEntry } = useTimetable();
  const [className, setClassName] = useState(CLASSES[0]);
  const [day, setDay] = useState(DAYS[0]);
  const [period, setPeriod] = useState(1);
  const currentEntry = timetable[className]?.[day]?.[period];
  const [subjectId, setSubjectId] = useState('');
  const [teacherId, setTeacherId] = useState('');

  const classSubjects = subjects.filter((subject) => subject.className === className);
  const selectedSubjectId = subjectId || currentEntry?.subjectId || '';
  const selectedSubject = subjects.find((subject) => subject.id === selectedSubjectId);
  const eligibleTeachers = useMemo(() => {
    const allottedTeacherIds = allotments
      .filter((allotment) => allotment.className === className && allotment.subjectId === selectedSubjectId)
      .map((allotment) => allotment.teacherId);

    return teachers.filter((teacher) => {
      if (!selectedSubject) return teacher.availableClasses.includes(className);
      const matchesSubject = teacher.assignedSubjects.includes(selectedSubject.name);
      const matchesAllotment = allottedTeacherIds.length === 0 || allottedTeacherIds.includes(teacher.id);
      return matchesSubject && matchesAllotment && teacher.availableClasses.includes(className);
    });
  }, [teachers, allotments, className, selectedSubject, selectedSubjectId]);

  const syncCurrent = () => {
    setSubjectId(currentEntry?.subjectId || '');
    setTeacherId(currentEntry?.teacherId || '');
  };

  const saveEntry = (event) => {
    event.preventDefault();
    if (saveManualEntry({ className, day, period, subjectId: selectedSubjectId, teacherId })) {
      setSubjectId('');
      setTeacherId('');
    }
  };

  return (
    <>
      <PageHeader title="Manual Timetable Generation" />
      <div className="surface p-3 mb-4">
        <form onSubmit={saveEntry} className="row g-3 align-items-end">
          <div className="col-lg-2 col-md-4">
            <ClassSelector value={className} onChange={setClassName} />
          </div>
          <div className="col-lg-2 col-md-4">
            <label className="form-label w-100">
              Select Day
              <select className="form-select mt-1" value={day} onChange={(event) => setDay(event.target.value)}>
                {DAYS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="col-lg-2 col-md-4">
            <label className="form-label w-100">
              Select Period
              <select className="form-select mt-1" value={period} onChange={(event) => setPeriod(Number(event.target.value))}>
                {PERIODS.map((item) => (
                  <option key={item} value={item}>
                    Period {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="col-lg-2 col-md-4">
            <label className="form-label w-100">
              Select Subject
              <select className="form-select mt-1" value={selectedSubjectId} onChange={(event) => setSubjectId(event.target.value)} required>
                <option value="">Choose subject</option>
                {classSubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="col-lg-2 col-md-4">
            <label className="form-label w-100">
              Select Teacher
              <select className="form-select mt-1" value={teacherId || currentEntry?.teacherId || ''} onChange={(event) => setTeacherId(event.target.value)} required>
                <option value="">Choose teacher</option>
                {eligibleTeachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="col-lg-2 col-md-4 d-flex gap-2">
            <button className="btn btn-primary flex-fill">Save</button>
            <button type="button" className="btn btn-outline-secondary" onClick={syncCurrent}>
              Edit
            </button>
            <button type="button" className="btn btn-outline-danger" onClick={() => deleteManualEntry(className, day, period)}>
              Delete
            </button>
          </div>
        </form>
      </div>
      <TimetableGrid timetable={timetable} className={className} />
    </>
  );
}
