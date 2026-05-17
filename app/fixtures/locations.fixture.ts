import type { JobLocation } from "~/types/page-model.types";

export const LOCATION_FIXTURES: JobLocation[] = [
  {
    id: "loc-001",
    city: "San Francisco",
    state: "CA",
    country: "US",
    remote: false,
    hybrid: true,
    onsite: true,
    displayName: "San Francisco, CA",
  },
  {
    id: "loc-002",
    city: "New York",
    state: "NY",
    country: "US",
    remote: false,
    hybrid: true,
    onsite: true,
    displayName: "New York, NY",
  },
  {
    id: "loc-003",
    city: "London",
    state: null,
    country: "GB",
    remote: false,
    hybrid: true,
    onsite: true,
    displayName: "London",
  },
  {
    id: "loc-004",
    city: "Berlin",
    state: null,
    country: "DE",
    remote: false,
    hybrid: false,
    onsite: true,
    displayName: "Berlin",
  },
  {
    id: "loc-005",
    city: "Remote",
    state: null,
    country: "US",
    remote: true,
    hybrid: false,
    onsite: false,
    displayName: "Remote (US)",
  },
  {
    id: "loc-006",
    city: "Austin",
    state: "TX",
    country: "US",
    remote: false,
    hybrid: true,
    onsite: true,
    displayName: "Austin, TX",
  },
  {
    id: "loc-007",
    city: "Seattle",
    state: "WA",
    country: "US",
    remote: false,
    hybrid: false,
    onsite: true,
    displayName: "Seattle, WA",
  },
  {
    id: "loc-008",
    city: "Boston",
    state: "MA",
    country: "US",
    remote: false,
    hybrid: true,
    onsite: true,
    displayName: "Boston, MA",
  },
  {
    id: "loc-009",
    city: "Chicago",
    state: "IL",
    country: "US",
    remote: false,
    hybrid: false,
    onsite: true,
    displayName: "Chicago, IL",
  },
  {
    id: "loc-010",
    city: "Toronto",
    state: "ON",
    country: "CA",
    remote: false,
    hybrid: true,
    onsite: true,
    displayName: "Toronto, ON",
  },
];

export function getLocationById(id: string): JobLocation | undefined {
  return LOCATION_FIXTURES.find((l) => l.id === id);
}

export function validateLocation(location: JobLocation): string[] {
  const errors: string[] = [];
  if (!location.id) errors.push("Location missing id");
  if (!location.city) errors.push("Location missing city");
  if (!location.country) errors.push("Location missing country");
  if (!location.displayName) errors.push("Location missing displayName");
  return errors;
}
