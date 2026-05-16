export const teacherSubjectAllotmentRows = [
  { classValue: 'XI', section: 'PCM', teacherName: 'Diya', subject: 'English', periodsPerWeek: 6, daysPerWeek: 6, periodsTogether: 1, remark: '1 period for 6 days', verificationStatus: 'Needs verification' },
  { classValue: 'XI', section: 'PCM', teacherName: 'Achita', subject: 'GS', periodsPerWeek: 1, daysPerWeek: 1, periodsTogether: 1, remark: '1 period for 1 day', verificationStatus: 'Needs verification' },
  { classValue: 'XI', section: 'PCM', teacherName: 'Felix', subject: 'English', periodsPerWeek: 6, daysPerWeek: 6, periodsTogether: 1, remark: '1 period for 6 days', verificationStatus: 'Needs verification' },
  { classValue: 'XI', section: 'PCM', teacherName: 'Akash + Beinit', subject: 'IP', periodsPerWeek: 4, daysPerWeek: 4, periodsTogether: 2, remark: '2 periods together for 2 days and 1 period for 2 days', verificationStatus: 'Needs verification' },
  { classValue: 'XI', section: 'PCB', teacherName: 'Diya', subject: 'English', periodsPerWeek: 6, daysPerWeek: 6, periodsTogether: 1, remark: '1 period for 6 days', verificationStatus: 'Needs verification' },
  { classValue: 'XI', section: 'PCB', teacherName: 'Achita', subject: 'GS', periodsPerWeek: 1, daysPerWeek: 1, periodsTogether: 1, remark: '1 period for 1 day', verificationStatus: 'Needs verification' },
  { classValue: 'XII', section: 'PCM', teacherName: 'Diya', subject: 'English', periodsPerWeek: 6, daysPerWeek: 6, periodsTogether: 1, remark: '1 period for 6 days', verificationStatus: 'Needs verification' },
  { classValue: 'XII', section: 'PCM', teacherName: 'Bandhan', subject: 'PHE', periodsPerWeek: 3, daysPerWeek: 3, periodsTogether: 1, remark: '1 period for 3 days', verificationStatus: 'Needs verification' },
  { classValue: 'XII', section: 'PCM', teacherName: 'Bijju', subject: 'Game', periodsPerWeek: 1, daysPerWeek: 1, periodsTogether: 1, remark: 'Game/PHE together rule mentioned', verificationStatus: 'Needs verification' },
  { classValue: 'XII', section: 'PCM', teacherName: 'Felix', subject: 'GS', periodsPerWeek: 1, daysPerWeek: 1, periodsTogether: 1, remark: '1 period for 1 day', verificationStatus: 'Needs verification' },
  { classValue: 'XII', section: 'PCB', teacherName: 'Diya', subject: 'English', periodsPerWeek: 6, daysPerWeek: 6, periodsTogether: 1, remark: '1 period for 6 days', verificationStatus: 'Needs verification' },
  { classValue: 'XII', section: 'PCB', teacherName: 'Achita', subject: 'GS', periodsPerWeek: 1, daysPerWeek: 1, periodsTogether: 1, remark: '1 period for 1 day', verificationStatus: 'Needs verification' },
  { classValue: 'X', section: 'A', teacherName: 'Sunita', subject: 'Civics', periodsPerWeek: 2, daysPerWeek: 2, periodsTogether: 1, remark: '1 period for 2 days', verificationStatus: 'Needs verification' },
  { classValue: 'X', section: 'A', teacherName: 'Sunita', subject: 'History', periodsPerWeek: 3, daysPerWeek: 3, periodsTogether: 1, remark: '1 period for 3 days', verificationStatus: 'Needs verification' },
  { classValue: 'X', section: 'A', teacherName: 'Amita', subject: 'English', periodsPerWeek: 5, daysPerWeek: 5, periodsTogether: 1, remark: '1 period for 5 days', verificationStatus: 'Needs verification' },
  { classValue: 'X', section: 'A', teacherName: 'Neelam', subject: 'Hindi', periodsPerWeek: 6, daysPerWeek: 6, periodsTogether: 1, remark: '1 period for 6 days', verificationStatus: 'Needs verification' },
  { classValue: 'X', section: 'A', teacherName: 'Tiwari', subject: 'Math', periodsPerWeek: 6, daysPerWeek: 6, periodsTogether: 1, remark: '1 period for 6 days', verificationStatus: 'Needs verification' },
  { classValue: 'X', section: 'A', teacherName: 'Rume', subject: 'Chemistry', periodsPerWeek: 3, daysPerWeek: 3, periodsTogether: 1, remark: '1 period for 3 days', verificationStatus: 'Needs verification' },
  { classValue: 'X', section: 'A', teacherName: 'Achita', subject: 'Biology', periodsPerWeek: 3, daysPerWeek: 3, periodsTogether: 1, remark: '1 period for 3 days', verificationStatus: 'Needs verification' },
  { classValue: 'X', section: 'A', teacherName: 'Tiwari', subject: 'Physics', periodsPerWeek: 3, daysPerWeek: 3, periodsTogether: 1, remark: '1 period for 3 days', verificationStatus: 'Needs verification' },
];

export function classSectionName(row) {
  return `Class ${row.classValue} ${row.section}`.trim();
}
