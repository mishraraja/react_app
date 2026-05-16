export function getSubjectVerificationIssue(subject) {
  const weeklyPeriods = Number(subject.weeklyPeriods) || 0;
  const daysPerWeek = Number(subject.daysPerWeek) || 0;
  const periodsTogether = Number(subject.periodsTogether) || 1;

  if (!weeklyPeriods || !daysPerWeek) return 'Periods per week and days per week are required.';
  if (daysPerWeek > 6) return 'Days per week cannot exceed 6.';
  if (weeklyPeriods < daysPerWeek) return 'Periods per week cannot be less than days per week.';
  if (periodsTogether === 2 && weeklyPeriods < daysPerWeek + 1) {
    return 'A double period needs at least one extra weekly period beyond days per week.';
  }
  return '';
}
