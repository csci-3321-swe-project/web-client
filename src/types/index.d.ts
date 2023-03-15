export type Meeting = {
  daysOfWeek: DayOfWeek[];
  startTime: Date;
  endTime: Date;
  location: string;
};

export type User = {
  id: string;
  isMock: boolean;
  role: Role;
  email: string;
  firstName: string;
  lastName: string;
};

export type Registration = {
  id: string;
  userId: string;
  courseSectionId: string;
};

export type Course = {
  id: string;
  name: string;
  term: Term;
  department: Department;
  code: number;
  description: string;
  courseSections: CourseSection[];
};

export type CourseSection = {
  id: string;
  courseId: string;
  meetings: Meeting[];
  instructorId: string;
};

export const DayOfWeek: {
  MONDAY: "MONDAY";
  TUESDAY: "TUESDAY";
  WEDNESDAY: "WEDNESDAY";
  THURSDAY: "THURSDAY";
  FRIDAY: "FRIDAY";
  SATURDAY: "SATURDAY";
  SUNDAY: "SUNDAY";
};

export type DayOfWeek = typeof DayOfWeek[keyof typeof DayOfWeek];

export const Department: {
  ART_HISTORY: "ART_HISTORY";
  BIOLOGY: "BIOLOGY";
  CHEMISTRY: "CHEMISTRY";
  CLASSICAL_STUDIES: "CLASSICAL_STUDIES";
  COMMUNICATION: "COMMUNICATION";
  COMPUTER_SCIENCE: "COMPUTER_SCIENCE";
  ECONOMICS: "ECONOMICS";
  EDUCATION: "EDUCATION";
  ENGINEERING_SCIENCE: "ENGINEERING_SCIENCE";
  ENGLISH: "ENGLISH";
  GEOSCIENCES: "GEOSCIENCES";
  HEALTH_CARE_ADMINISTRATION: "HEALTH_CARE_ADMINISTRATION";
  HISTORY: "HISTORY";
  MATHMATICS: "MATHMATICS";
  MUSIC: "MUSIC";
  PHILLOSOPHY: "PHILLOSOPHY";
};

export type Department = typeof Department[keyof typeof Department];

export const Role: {
  STUDENT: "STUDENT";
  PROFESSOR: "PROFESSOR";
  ADMINISTRATOR: "ADMINISTRATOR";
};

export type Role = typeof Role[keyof typeof Role];

export const Term: {
  SPRING_2021: "SPRING_2021";
  FALL_2021: "FALL_2021";
  SPRING_2022: "SPRING_2022";
  FALL_2022: "FALL_2022";
  SPRING_2023: "SPRING_2023";
};

export type Term = typeof Term[keyof typeof Term];
