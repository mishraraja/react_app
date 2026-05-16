import { useState } from 'react';
import ClassSelector from '../components/ClassSelector.jsx';
import PageHeader from '../components/PageHeader.jsx';
import TimetableGrid from '../components/TimetableGrid.jsx';
import { CLASSES } from '../data/constants';
import { useTimetable } from '../data/TimetableContext.jsx';
import { getSubjectVerificationIssue } from '../utils/verification';

export default function AutoGenerate() {
  const [className, setClassName] = useState(CLASSES[0]);
  const { timetable, runAutomaticGeneration, subjects, setSubjects, showMessage } = useTimetable();
  const pendingSubjects = subjects.filter(
    (subject) =>
      String(subject.verificationStatus || '').toLowerCase().includes('needs verification') ||
      getSubjectVerificationIssue(subject),
  );

  const markVerified = (id) => {
    const subject = subjects.find((item) => item.id === id);
    const issue = getSubjectVerificationIssue(subject);
    if (issue) {
      showMessage('danger', issue);
      return;
    }
    setSubjects((current) =>
      current.map((subject) => (subject.id === id ? { ...subject, verificationStatus: 'Verified' } : subject)),
    );
    showMessage('success', 'Allotment row marked verified.');
  };

  const markAllVerified = () => {
    const invalid = subjects.filter((subject) => getSubjectVerificationIssue(subject));
    setSubjects((current) =>
      current.map((subject) =>
        getSubjectVerificationIssue(subject) ? subject : { ...subject, verificationStatus: 'Verified' },
      ),
    );
    showMessage(
      invalid.length ? 'warning' : 'success',
      invalid.length
        ? `${invalid.length} row could not be verified because it has a rule conflict.`
        : 'All source rows marked verified.',
    );
  };

  return (
    <>
      <PageHeader title="Automatic Timetable Generation">
        <div className="d-flex flex-wrap gap-2 align-items-end">
          <div className="selector-width">
            <ClassSelector value={className} onChange={setClassName} />
          </div>
          <button className="btn btn-primary mb-1" onClick={runAutomaticGeneration}>
            Generate Timetable
          </button>
        </div>
      </PageHeader>
      {pendingSubjects.length > 0 && (
        <div className="surface p-3 mb-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <div>
              <h2 className="h5 mb-1">Admin Verification Required</h2>
              <p className="text-muted mb-0">Rows marked Needs verification must be corrected or confirmed before final generation.</p>
            </div>
            <button className="btn btn-outline-success" onClick={markAllVerified}>
              Mark All Verified
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-sm align-middle mb-0">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Periods / Week</th>
                  <th>Days / Week</th>
                  <th>Together</th>
                  <th>Remark</th>
                  <th>Issue</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingSubjects.map((subject) => (
                  <tr key={subject.id}>
                    <td>{subject.className}</td>
                    <td>{subject.name}</td>
                    <td>{subject.weeklyPeriods}</td>
                    <td>{subject.daysPerWeek}</td>
                    <td>{subject.periodsTogether}</td>
                    <td>{subject.remark}</td>
                    <td>{getSubjectVerificationIssue(subject) || subject.verificationStatus}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-success" onClick={() => markVerified(subject.id)}>
                        Mark Verified
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <TimetableGrid timetable={timetable} className={className} />
    </>
  );
}
