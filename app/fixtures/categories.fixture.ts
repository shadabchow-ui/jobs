import type { JobCategory } from "~/types/page-model.types";

export const CATEGORY_FIXTURES: JobCategory[] = [
  { id: "cat-001", slug: "software-engineering", name: "Software Engineering", parentId: null },
  { id: "cat-002", slug: "data-science", name: "Data Science", parentId: null },
  { id: "cat-003", slug: "design", name: "Design", parentId: null },
  { id: "cat-004", slug: "product", name: "Product", parentId: null },
  { id: "cat-005", slug: "marketing", name: "Marketing", parentId: null },
  { id: "cat-006", slug: "operations", name: "Operations", parentId: null },
  { id: "cat-007", slug: "devops", name: "DevOps & Infrastructure", parentId: null },
  { id: "cat-008", slug: "security", name: "Security", parentId: null },
  { id: "cat-009", slug: "data-engineering", name: "Data Engineering", parentId: "cat-002" },
  { id: "cat-010", slug: "frontend", name: "Frontend", parentId: "cat-001" },
  { id: "cat-011", slug: "backend", name: "Backend", parentId: "cat-001" },
  { id: "cat-012", slug: "fullstack", name: "Full Stack", parentId: "cat-001" },
];

export function getCategoryById(id: string): JobCategory | undefined {
  return CATEGORY_FIXTURES.find((c) => c.id === id);
}

export function getCategoriesByIds(ids: string[]): JobCategory[] {
  return ids.map((id) => {
    const cat = getCategoryById(id);
    if (!cat) throw new Error(`Category ${id} not found`);
    return cat;
  });
}

export function validateCategory(category: JobCategory): string[] {
  const errors: string[] = [];
  if (!category.id) errors.push("Category missing id");
  if (!category.slug) errors.push("Category missing slug");
  if (!category.name) errors.push("Category missing name");
  return errors;
}
