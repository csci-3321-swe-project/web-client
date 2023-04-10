/**
 * Model Meeting
 *
 */
export type Meeting = {
  daysOfWeek: DayOfWeek[];
  startTime: string;
  endTime: string;
  location: string;
};

/**
 * Model User
 *
 */
export type User = {
  id: string;
  isMock: boolean;
  role: Role;
  email: string;
  firstName: string;
  lastName: string;
  instructingIds: string[];
};

/**
 * Model Registration
 *
 */
export type Registration = {
  id: string;
  userId: string;
  courseSectionId: string;
  createdAt: Date;
  priority: boolean;
  user: User;
};

/**
 * Model Course
 *
 */
export type Course = {
  id: string;
  name: string;
  termId: string;
  term: Term;
  department: Department;
  code: number;
  description: string;
  courseSections: CourseSection[];
};

/**
 * Model CourseSection
 *
 */
export type CourseSection = {
  id: string;
  courseId: string;
  meetings: Meeting[];
  instructorIds: string[];
  instructors: User[];
  capacity: number;
};

/**
 * Model Term
 *
 */
export type Term = {
  id: string;
  season: Season;
  year: number;
  startTime: string;
  endTime: string;
};

/**
 * Enums
 */
export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export enum Department {
  ART_HISTORY = "ART_HISTORY",
  BIOLOGY = "BIOLOGY",
  CHEMISTRY = "CHEMISTRY",
  CLASSICAL_STUDIES = "CLASSICAL_STUDIES",
  COMMUNICATION = "COMMUNICATION",
  COMPUTER_SCIENCE = "COMPUTER_SCIENCE",
  ECONOMICS = "ECONOMICS",
  EDUCATION = "EDUCATION",
  ENGINEERING_SCIENCE = "ENGINEERING_SCIENCE",
  ENGLISH = "ENGLISH",
  GEOSCIENCES = "GEOSCIENCES",
  HEALTH_CARE_ADMINISTRATION = "HEALTH_CARE_ADMINISTRATION",
  HISTORY = "HISTORY",
  MATHMATICS = "MATHMATICS",
  MUSIC = "MUSIC",
  PHILLOSOPHY = "PHILLOSOPHY",
}

export enum Role {
  STUDENT = "STUDENT",
  PROFESSOR = "PROFESSOR",
  ADMINISTRATOR = "ADMINISTRATOR",
}

export enum Season {
  FALL = "FALL",
  SPRING = "SPRING",
}
