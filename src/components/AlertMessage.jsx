import { useTimetable } from '../data/TimetableContext.jsx';

export default function AlertMessage() {
  const { message } = useTimetable();
  if (!message) return null;

  return <div className={`alert alert-${message.type} shadow-sm`}>{message.text}</div>;
}
