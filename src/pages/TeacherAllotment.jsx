import { useMemo, useState } from 'react';
import ClassSelector from '../components/ClassSelector.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { CLASSES } from '../data/constants';
import { useTimetable } from '../data/TimetableContext.jsx';

export default function TeacherAllotment() {
  const { allotments, setAllotments, subjects, teachers, showMessage } = useTimetable();
  const [className, setClassName] = useState(CLASSES[0]);
  const [subjectId, setSubjectId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [editingId, setEditingId] = useState('');
  const classSubjects = subjects.filter((subject) => subject.className === className);
  const selectedSubject = subjects.find((subject) => subject.id === subjectId);
  const eligibleTeachers = useMemo(
    () =>
      teachers.filter(
        (teacher) =>
          !selectedSubject ||
          (teacher.assignedSubjects.includes(selectedSubject.name) && teacher.availableClasses.includes(className)),
      ),
    [teachers, selectedSubject, className],
  );

  const resetForm = () => {
    setSubjectId('');
    setTeacherId('');
    setEditingId('');
  };

  const saveAllotment = (event) => {
    event.preventDefault();
    if (!subjectId || !teacherId) {
      showMessage('danger', 'Please select class, subject, and teacher.');
      return;
    }

    const duplicate = allotments.some(
      (item) => item.className === className && item.subjectId === subjectId && item.id !== editingId,
    );
    if (duplicate) {
      showMessage('danger', 'This subject already has an allotment for the selected class.');
      return;
    }

    const next = { id: editingId || crypto.randomUUID(), className, subjectId, teacherId };
    setAllotments((current) => (editingId ? current.map((item) => (item.id === editingId ? next : item)) : [...current, next]));
    showMessage('success', 'Allotment saved.');
    resetForm();
  };

  return (
    <>
      <PageHeader title="Teacher Allotment" />
      <div className="surface p-3 mb-4">
        <form onSubmit={saveAllotment} className="row g-3 align-items-end">
          <div className="col-md-3">
            <ClassSelector value={className} onChange={setClassName} />
          </div>
          <div className="col-md-3">
            <label className="form-label w-100">
              Select Subject
              <select className="form-select mt-1" value={subjectId} onChange={(event) => setSubjectId(event.target.value)} required>
                <option value="">Choose subject</option>
                {classSubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="col-md-3">
            <label className="form-label w-100">
              Select Teacher
              <select className="form-select mt-1" value={teacherId} onChange={(event) => setTeacherId(event.target.value)} required>
                <option value="">Choose teacher</option>
                {eligibleTeachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="col-md-3 d-flex gap-2">
            <button className="btn btn-primary flex-fill">Save Allotment</button>
            {editingId && (
              <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="table-responsive surface">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Class</th>
              <th>Subject</th>
              <th>Teacher</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allotments.map((allotment) => {
              const subject = subjects.find((item) => item.id === allotment.subjectId);
              const teacher = teachers.find((item) => item.id === allotment.teacherId);
              return (
                <tr key={allotment.id}>
                  <td>{allotment.className}</td>
                  <td>{subject?.name || 'Missing subject'}</td>
                  <td>{teacher?.name || 'Missing teacher'}</td>
                  <td className="action-cell">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setEditingId(allotment.id);
                        setClassName(allotment.className);
                        setSubjectId(allotment.subjectId);
                        setTeacherId(allotment.teacherId);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        setAllotments((current) => current.filter((item) => item.id !== allotment.id));
                        showMessage('success', 'Allotment deleted.');
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-muted mt-3 mb-0">
        Period-level teacher conflicts are checked in manual editing and automatic generation.
      </p>
    </>
  );
}
