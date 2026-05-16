import { useState } from 'react';
import Modal from '../components/Modal.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { CLASSES } from '../data/constants';
import { useTimetable } from '../data/TimetableContext.jsx';

const blankTeacher = { id: '', name: '', assignedSubjects: [], availableClasses: [], maxPeriodsPerDay: 5 };

export default function TeacherManagement() {
  const { teachers, setTeachers, subjects, showMessage } = useTimetable();
  const [editing, setEditing] = useState(null);
  const subjectNames = [...new Set(subjects.map((subject) => subject.name))];

  const saveTeacher = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const teacher = {
      id: form.get('id').trim(),
      name: form.get('name').trim(),
      assignedSubjects: form.getAll('assignedSubjects'),
      availableClasses: form.getAll('availableClasses'),
      maxPeriodsPerDay: Number(form.get('maxPeriodsPerDay')),
    };

    if (!teacher.id || !teacher.name || !teacher.assignedSubjects.length || !teacher.availableClasses.length) {
      showMessage('danger', 'Please complete all teacher fields.');
      return;
    }

    const duplicate = teachers.some((item) => item.id === teacher.id && item.id !== editing?.id);
    if (duplicate) {
      showMessage('danger', 'Teacher ID already exists.');
      return;
    }

    setTeachers((current) =>
      editing?.id ? current.map((item) => (item.id === editing.id ? teacher : item)) : [...current, teacher],
    );
    setEditing(null);
    showMessage('success', 'Teacher saved.');
  };

  return (
    <>
      <PageHeader title="Teachers">
        <button className="btn btn-primary" onClick={() => setEditing(blankTeacher)}>
          Add Teacher
        </button>
      </PageHeader>
      <div className="table-responsive surface">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Teacher ID</th>
              <th>Teacher Name</th>
              <th>Assigned Subjects</th>
              <th>Available Classes</th>
              <th>Maximum Periods / Day</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.id}</td>
                <td>{teacher.name}</td>
                <td>{teacher.assignedSubjects.join(', ')}</td>
                <td>{teacher.availableClasses.join(', ')}</td>
                <td>{teacher.maxPeriodsPerDay}</td>
                <td className="action-cell">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setEditing(teacher)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      setTeachers((current) => current.filter((item) => item.id !== teacher.id));
                      showMessage('success', 'Teacher deleted.');
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <Modal title={editing.id ? 'Edit Teacher' : 'Add Teacher'} onClose={() => setEditing(null)}>
          <form onSubmit={saveTeacher} className="form-grid">
            <label className="form-label">
              Teacher ID
              <input className="form-control" name="id" defaultValue={editing.id} required />
            </label>
            <label className="form-label">
              Teacher Name
              <input className="form-control" name="name" defaultValue={editing.name} required />
            </label>
            <label className="form-label">
              Maximum Periods Per Day
              <input className="form-control" name="maxPeriodsPerDay" type="number" min="1" max="8" defaultValue={editing.maxPeriodsPerDay} required />
            </label>
            <fieldset>
              <legend>Assigned Subjects</legend>
              <div className="check-grid">
                {subjectNames.map((subject) => (
                  <label key={subject} className="form-check">
                    <input className="form-check-input" type="checkbox" name="assignedSubjects" value={subject} defaultChecked={editing.assignedSubjects.includes(subject)} />
                    <span className="form-check-label">{subject}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Available Classes</legend>
              <div className="check-grid compact">
                {CLASSES.map((className) => (
                  <label key={className} className="form-check">
                    <input className="form-check-input" type="checkbox" name="availableClasses" value={className} defaultChecked={editing.availableClasses.includes(className)} />
                    <span className="form-check-label">{className}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline-secondary" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button className="btn btn-primary">Save</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
