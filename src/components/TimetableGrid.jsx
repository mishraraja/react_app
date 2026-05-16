import { DAYS, PERIODS } from '../data/constants';

export default function TimetableGrid({ timetable, className }) {
  return (
    <div className="timetable-wrap">
      <table className="table table-bordered timetable-table align-middle">
        <thead>
          <tr>
            <th>Day</th>
            {PERIODS.map((period) => (
              <th key={period}>Period {period}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DAYS.map((day) => (
            <tr key={day}>
              <th className="day-cell">{day}</th>
              {PERIODS.map((period) => {
                const entry = timetable[className]?.[day]?.[period];
                const isFree = !entry || entry.subjectName === 'Free Period';
                return (
                  <td key={`${day}-${period}`} className={isFree ? 'free-slot' : ''}>
                    <strong>{entry?.subjectName || 'Free Period'}</strong>
                    {!isFree && <span>{entry.teacherName}</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
