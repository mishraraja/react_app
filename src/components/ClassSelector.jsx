import { CLASSES } from '../data/constants';

export default function ClassSelector({ value, onChange, label = 'Select Class' }) {
  return (
    <label className="form-label w-100">
      {label}
      <select className="form-select mt-1" value={value} onChange={(event) => onChange(event.target.value)}>
        {CLASSES.map((className) => (
          <option key={className} value={className}>
            {className}
          </option>
        ))}
      </select>
    </label>
  );
}
