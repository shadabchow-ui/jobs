import type {
  SalaryFixture,
  SalaryTitleEntry,
  SalarySearchPageModel,
  SalaryDetailPageModel,
} from "~/types/page-model.types";
import { SALARY_FIXTURES } from "~/fixtures/salaries.fixture";

function titleSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function aggregateByTitle(salaries: SalaryFixture[]): SalaryTitleEntry[] {
  const grouped: Record<string, SalaryFixture[]> = {};
  for (const s of salaries) {
    if (!grouped[s.jobTitle]) grouped[s.jobTitle] = [];
    grouped[s.jobTitle].push(s);
  }

  return Object.entries(grouped).map(([title, entries]) => {
    const best = entries.reduce((a, b) => (a.dataPoints > b.dataPoints ? a : b));
    return {
      title,
      titleSlug: titleSlug(title),
      minSalary: Math.min(...entries.map((e) => e.minSalary)),
      maxSalary: Math.max(...entries.map((e) => e.maxSalary)),
      medianSalary: Math.round(
        entries.reduce((sum, e) => sum + e.medianSalary, 0) / entries.length,
      ),
      currency: entries[0].currency,
      dataPoints: entries.reduce((sum, e) => sum + e.dataPoints, 0),
      topLocation: best.location,
      topCompany: best.company,
    };
  });
}

const AGGREGATED = aggregateByTitle(SALARY_FIXTURES);

function getRelatedTitles(entry: SalaryTitleEntry): SalaryTitleEntry[] {
  const words = entry.title.toLowerCase().split(/\s+/);
  const scored = AGGREGATED.filter((t) => t.titleSlug !== entry.titleSlug)
    .map((t) => {
      const titleWords = t.title.toLowerCase().split(/\s+/);
      const overlap = words.filter((w) => titleWords.includes(w)).length;
      const salaryDiff = Math.abs(t.medianSalary - entry.medianSalary);
      return { entry: t, overlap, salaryDiff };
    })
    .filter((s) => s.overlap > 0 || s.salaryDiff < 40000)
    .sort((a, b) => b.overlap - a.overlap || a.salaryDiff - b.salaryDiff);

  return scored.slice(0, 4).map((s) => s.entry);
}

export function loadSalarySearch(query: string | null): SalarySearchPageModel {
  const q = (query ?? "").trim().toLowerCase();

  let results: SalaryTitleEntry[];
  if (!q) {
    results = AGGREGATED;
  } else {
    results = AGGREGATED.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.topCompany && t.topCompany.toLowerCase().includes(q)) ||
        (t.topLocation && t.topLocation.toLowerCase().includes(q)),
    );
  }

  results.sort((a, b) => b.dataPoints - a.dataPoints);

  const popularTitles = [...AGGREGATED]
    .sort((a, b) => b.dataPoints - a.dataPoints)
    .slice(0, 6);

  return {
    query: query?.trim() || null,
    totalResults: results.length,
    results,
    popularTitles,
  };
}

export function loadSalaryDetail(titleSlugParam: string): SalaryDetailPageModel | null {
  const title = AGGREGATED.find((t) => t.titleSlug === titleSlugParam);
  if (!title) return null;

  const salariesForTitle = SALARY_FIXTURES.filter(
    (s) => titleSlug(s.jobTitle) === titleSlugParam,
  );

  const byLocationMap: Record<string, SalaryFixture[]> = {};
  const byCompanyMap: Record<string, SalaryFixture[]> = {};

  for (const s of salariesForTitle) {
    if (!byLocationMap[s.location]) byLocationMap[s.location] = [];
    byLocationMap[s.location].push(s);
    if (!byCompanyMap[s.company]) byCompanyMap[s.company] = [];
    byCompanyMap[s.company].push(s);
  }

  function toEntries(
    map: Record<string, SalaryFixture[]>,
  ): Array<{ name: string; minSalary: number; maxSalary: number; medianSalary: number; dataPoints: number }> {
    return Object.entries(map)
      .map(([name, entries]) => ({
        name,
        minSalary: Math.min(...entries.map((e) => e.minSalary)),
        maxSalary: Math.max(...entries.map((e) => e.maxSalary)),
        medianSalary: Math.round(
          entries.reduce((sum, e) => sum + e.medianSalary, 0) / entries.length,
        ),
        dataPoints: entries.reduce((sum, e) => sum + e.dataPoints, 0),
      }))
      .sort((a, b) => b.dataPoints - a.dataPoints);
  }

  const byLocation = toEntries(byLocationMap).map((e) => ({
    location: e.name,
    minSalary: e.minSalary,
    maxSalary: e.maxSalary,
    medianSalary: e.medianSalary,
    dataPoints: e.dataPoints,
  }));

  const byCompany = toEntries(byCompanyMap).map((e) => ({
    company: e.name,
    minSalary: e.minSalary,
    maxSalary: e.maxSalary,
    medianSalary: e.medianSalary,
    dataPoints: e.dataPoints,
  }));

  const relatedTitles = getRelatedTitles(title);

  return {
    title: title.title,
    aggregated: {
      minSalary: title.minSalary,
      maxSalary: title.maxSalary,
      medianSalary: title.medianSalary,
      currency: title.currency,
      dataPoints: title.dataPoints,
    },
    byLocation,
    byCompany,
    relatedTitles,
  };
}
