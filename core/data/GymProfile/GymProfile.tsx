import { Activity } from "../../../interfaces/interfaces";

export class Gym {
  name: string;
  email: string;
  location: string;
  country: string;
  city: string;
  zipCode: string;
  avatarUri: string;
  description: string;
  activities: Activity[] | null;

  constructor(
    name: string,
    location: string,
    email: string,
    country: string,
    city: string,
    zipCode: string,
    activities: Activity[] | null,
    avatarUri?: string,
    description?: string
  ) {
    this.name = name;
    this.location = location;
    this.email = email;
    this.country = country;
    this.city = city;
    this.zipCode = zipCode;
    this.activities = activities;
    this.avatarUri = avatarUri ? avatarUri : "https://via.placeholder.com/150";
    this.description = description ? description : "";
  }
}
