import { useState } from 'react';
import ClassSelector from '../components/ClassSelector.jsx';
import Modal from '../components/Modal.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { CLASSES } from '../data/constants';
import { useTimetable } from '../data/TimetableContext.jsx';

const blankSubject = {
  id: '',
  name: '',
  className: CLASSES[0],
  weeklyPeriods: 6,
  daysPerWeek: 6,
  periodsTogether: 1,
  remark: '',
  verificationStatus: 'Verified',
};

export default function SubjectManagement() {
  const { subjects, setSubjects, showMessage } = useTimetable();
  const [editing, setEditing] = useState(null);

  const saveSubject = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = {
      id: form.get('id').trim(),
      name: form.get('name').trim(),
      className: form.get('className'),
      weeklyPeriods: Number(form.get('weeklyPeriods')),
      daysPerWeek: Number(form.get('daysPerWeek')),
      periodsTogether: Number(form.get('periodsTogether')),
      remark: form.get('remark').trim(),
      verificationStatus: form.get('verificationStatus'),
    };

    if (!subject.id || !subject.name || subject.weeklyPeriods < 1 || subject.daysPerWeek < 1) {
      showMessage('danger', 'Please enter all subject fields correctly.');
      return;
    }

    const duplicate = subjects.some((item) => item.id === subject.id && item.id !== editing?.id);
    if (duplicate) {
      showMessage('danger', 'Subject ID already exists.');
      return;
    }

    setSubjects((current) =>
      editing?.id ? current.map((item) => (item.id === editing.id ? subject : item)) : [...current, subject],
    );
    setEditing(null);
    showMessage('success', 'Subject saved.');
  };

  const deleteSubject = (id) => {
    setSubjects((current) => current.filter((subject) => subject.id !== id));
    showMessage('success', 'Subject deleted.');
  };

  return (
    <>
      <PageHeader title="Subjects">
        <button className="btn btn-primary" onClick={() => setEditing(blankSubject)}>
          Add Subject
        </button>
      </PageHeader>
      <div className="table-responsive surface">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Subject ID</th>
              <th>Subject Name</th>
              <th>Class</th>
              <th>Weekly Required Periods</th>
              <th>Days / Week</th>
              <th>Together</th>
              <th>Verification</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id}>
                <td>{subject.id}</td>
                <td>{subject.name}</td>
                <td>{subject.className}</td>
                <td>{subject.weeklyPeriods}</td>
                <td>{subject.daysPerWeek || 1}</td>
                <td>{subject.periodsTogether || 1}</td>
                <td>
                  <span className={`badge ${subject.verificationStatus === 'Verified' ? 'text-bg-success' : 'text-bg-warning'}`}>
                    {subject.verificationStatus || 'Verified'}
                  </span>
                </td>
                <td className="action-cell">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setEditing(subject)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteSubject(subject.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <Modal title={editing.id ? 'Edit Subject' : 'Add Subject'} onClose={() => setEditing(null)}>
          <form onSubmit={saveSubject} className="form-grid">
            <label className="form-label">
              Subject ID
              <input className="form-control" name="id" defaultValue={editing.id} required />
            </label>
            <label className="form-label">
              Subject Name
              <input className="form-control" name="name" defaultValue={editing.name} required />
            </label>
            <ClassSelector
              value={editing.className}
              onChange={(nextClass) => setEditing((current) => ({ ...current, className: nextClass }))}
            />
            <input type="hidden" name="className" value={editing.className} />
            <label className="form-label">
              Weekly Required Periods
              <input className="form-control" name="weeklyPeriods" type="number" min="1" max="48" defaultValue={editing.weeklyPeriods} required />
            </label>
            <label className="form-label">
              Days Per Week
              <input className="form-control" name="daysPerWeek" type="number" min="1" max="6" defaultValue={editing.daysPerWeek || 1} required />
            </label>
            <label className="form-label">
              Periods Together
              <select className="form-select" name="periodsTogether" defaultValue={editing.periodsTogether || 1}>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </label>
            <label className="form-label">
              Special Rule / Remark
              <input className="form-control" name="remark" defaultValue={editing.remark || ''} />
            </label>
            <label className="form-label">
              Verification Status
              <select className="form-select" name="verificationStatus" defaultValue={editing.verificationStatus || 'Verified'}>
                <option>Needs verification</option>
                <option>Verified</option>
              </select>
            </label>
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
