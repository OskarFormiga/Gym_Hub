export class User {
  name: string;
  lastname: string;
  email: string;
  country: string;
  city: string;
  birthDate: string;
  avatarUri: string;
  description: string;
  completedSessions: number;
  completedSessionsMonth: number;
  completedSessionsYear: number;

  constructor(
    name: string,
    lastname: string,
    email: string,
    country: string,
    city: string,
    birthDate: string,
    avatarUri?: string,
    description?: string,
    completedSessions?: number,
    completedSessionsMonth?: number,
    completedSessionsYear?: number
  ) {
    this.name = name;
    this.lastname = lastname;
    this.email = email;
    this.country = country;
    this.city = city;
    this.birthDate = birthDate;
    this.avatarUri = avatarUri ? avatarUri : "https://via.placeholder.com/150";
    this.description = description ? description : "";
    this.completedSessions = completedSessions ? completedSessions : 0;
    this.completedSessionsMonth = completedSessionsMonth
      ? completedSessionsMonth
      : 30;

    this.completedSessionsYear = completedSessionsYear
      ? completedSessionsYear
      : 140;
  }
}
