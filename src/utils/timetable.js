import { CLASSES, DAYS, EMPTY_ENTRY, PERIODS } from '../data/constants';

export function createEmptyTimetable() {
  return CLASSES.reduce((classMap, className) => {
    classMap[className] = DAYS.reduce((dayMap, day) => {
      dayMap[day] = PERIODS.reduce((periodMap, period) => {
        periodMap[period] = { ...EMPTY_ENTRY };
        return periodMap;
      }, {});
      return dayMap;
    }, {});
    return classMap;
  }, {});
}

export function hasTeacherConflict(timetable, teacherId, className, day, period) {
  if (!teacherId) return false;

  return CLASSES.some(
    (candidateClass) =>
      candidateClass !== className &&
      timetable[candidateClass]?.[day]?.[period]?.teacherId === teacherId,
  );
}

export function teacherDayLoad(timetable, teacherId, day) {
  if (!teacherId) return 0;

  return CLASSES.reduce(
    (total, className) =>
      total +
      PERIODS.filter((period) => timetable[className]?.[day]?.[period]?.teacherId === teacherId).length,
    0,
  );
}

export function normalizeTimetable(timetable) {
  const empty = createEmptyTimetable();
  return CLASSES.reduce((classMap, className) => {
    classMap[className] = DAYS.reduce((dayMap, day) => {
      dayMap[day] = PERIODS.reduce((periodMap, period) => {
        periodMap[period] = timetable?.[className]?.[day]?.[period] || { ...empty[className][day][period] };
        return periodMap;
      }, {});
      return dayMap;
    }, {});
    return classMap;
  }, {});
}

export function setTimetableEntry(timetable, className, day, period, entry) {
  return {
    ...timetable,
    [className]: {
      ...timetable[className],
      [day]: {
        ...timetable[className][day],
        [period]: entry,
      },
    },
  };
}

export function generateTimetable(subjects, teachers, allotments) {
  const timetable = createEmptyTimetable();
  const weeklySubjectCount = {};
  const subjectDayMap = {};

  for (const className of CLASSES) {
    const classSubjects = subjects
      .filter((subject) => subject.className === className)
      .map((subject) => ({
        ...subject,
        allottedTeacherId:
          allotments.find(
            (allotment) => allotment.className === className && allotment.subjectId === subject.id,
          )?.teacherId || '',
      }))
      .filter((subject) => subject.allottedTeacherId);

    for (const day of DAYS) {
      for (const period of PERIODS) {
        if (timetable[className][day][period].subjectId) continue;

        const candidates = classSubjects
          .map((subject) => {
            const teacher = teachers.find((item) => item.id === subject.allottedTeacherId);
            const key = `${className}-${subject.id}`;
            const taught = weeklySubjectCount[key] || 0;
            const daysUsed = subjectDayMap[key] || new Set();
            const weeklyRequired = Number(subject.weeklyPeriods) || 1;
            const daysRequired = Number(subject.daysPerWeek) || 1;
            const isNewDay = !daysUsed.has(day);
            const remainingPeriods = weeklyRequired - taught;
            const remainingNewDays = Math.max(0, daysRequired - daysUsed.size);
            const futureNewDaysAfterSingle = Math.max(0, remainingNewDays - (isNewDay ? 1 : 0));
            const canUseDouble =
              Number(subject.periodsTogether) === 2 &&
              remainingPeriods >= 2 &&
              remainingPeriods - 2 >= futureNewDaysAfterSingle;
            const blockLength = canUseDouble ? 2 : 1;
            return { subject, teacher, taught, daysUsed, blockLength, isNewDay };
          })
          .filter(({ subject, teacher, taught, daysUsed, blockLength, isNewDay }) => {
            if (!teacher) return false;
            const weeklyRequired = Number(subject.weeklyPeriods) || 1;
            const daysRequired = Number(subject.daysPerWeek) || 1;
            if (taught >= weeklyRequired) return false;
            if (!daysUsed.has(day) && daysUsed.size >= daysRequired) return false;
            if (daysUsed.has(day) && daysUsed.size < daysRequired) {
              const remainingPeriods = weeklyRequired - taught;
              const remainingNewDays = daysRequired - daysUsed.size;
              if (remainingPeriods <= remainingNewDays) return false;
            }
            if (taught + blockLength > weeklyRequired) return false;
            const futureNewDaysAfterBlock = Math.max(0, daysRequired - (daysUsed.size + (isNewDay ? 1 : 0)));
            if (weeklyRequired - taught - blockLength < futureNewDaysAfterBlock) return false;
            if (period + blockLength - 1 > PERIODS.length) return false;
            if (teacherDayLoad(timetable, teacher.id, day) + blockLength > Number(teacher.maxPeriodsPerDay)) return false;
            for (let offset = 0; offset < blockLength; offset += 1) {
              const targetPeriod = period + offset;
              if (timetable[className][day][targetPeriod].subjectId) return false;
              if (hasTeacherConflict(timetable, teacher.id, className, day, targetPeriod)) return false;
            }
            return teacher.assignedSubjects.includes(subject.name) && teacher.availableClasses.includes(className);
          })
          .sort((a, b) => {
            const aRatio = a.taught / Number(a.subject.weeklyPeriods);
            const bRatio = b.taught / Number(b.subject.weeklyPeriods);
            return (
              Number(b.isNewDay) - Number(a.isNewDay) ||
              b.blockLength - a.blockLength ||
              aRatio - bRatio ||
              Number(b.subject.weeklyPeriods) - Number(a.subject.weeklyPeriods)
            );
          });

        const selected = candidates[0];
        if (!selected) continue;

        const key = `${className}-${selected.subject.id}`;
        weeklySubjectCount[key] = (weeklySubjectCount[key] || 0) + selected.blockLength;
        if (!subjectDayMap[key]) subjectDayMap[key] = new Set();
        subjectDayMap[key].add(day);
        for (let offset = 0; offset < selected.blockLength; offset += 1) {
          timetable[className][day][period + offset] = {
            subjectId: selected.subject.id,
            subjectName: selected.subject.name,
            teacherId: selected.teacher.id,
            teacherName: selected.teacher.name,
          };
        }
      }
    }
  }

  return timetable;
}
