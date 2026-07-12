// Simple Manga Layout Engine
// Uses CSS grid-template-areas — no clip-path, no absolute positioning
// Diagonal feel comes from panel rotation and thick borders

export type MangaLayout = {
  id: number;
  gridTemplateAreas: string;
  gridTemplateColumns: string;
  gridTemplateRows: string;
  areas: string[];
  rotations: number[];
};

export const mangaLayouts: MangaLayout[] = [
  // Layout A: Big left + 2 stacked right (5 panels)
  {
    id: 0,
    gridTemplateColumns: "1.4fr 1fr",
    gridTemplateRows: "1.2fr 1fr 0.8fr",
    gridTemplateAreas: `
      "p0 p1"
      "p0 p2"
      "p3 p4"
    `,
    areas: ["p0", "p1", "p2", "p3", "p4"],
    rotations: [-0.4, 0.3, -0.2, 0.4, -0.3],
  },
  // Layout B: Top wide + 3 bottom (4 panels)
  {
    id: 1,
    gridTemplateColumns: "1fr 0.8fr 1.2fr",
    gridTemplateRows: "1.3fr 1fr",
    gridTemplateAreas: `
      "p0 p0 p0"
      "p1 p2 p3"
    `,
    areas: ["p0", "p1", "p2", "p3"],
    rotations: [0.2, -0.4, 0.3, -0.2],
  },
  // Layout C: 3 top uneven + 2 bottom (5 panels)
  {
    id: 2,
    gridTemplateColumns: "0.8fr 1.2fr 1fr",
    gridTemplateRows: "1fr 1.3fr",
    gridTemplateAreas: `
      "p0 p1 p2"
      "p3 p3 p4"
    `,
    areas: ["p0", "p1", "p2", "p3", "p4"],
    rotations: [0.3, -0.2, 0.4, -0.3, 0.2],
  },
  // Layout D: Asymmetric 6-panel
  {
    id: 3,
    gridTemplateColumns: "1fr 1.3fr 0.9fr",
    gridTemplateRows: "1fr 0.8fr 1.2fr",
    gridTemplateAreas: `
      "p0 p1 p1"
      "p0 p2 p3"
      "p4 p2 p5"
    `,
    areas: ["p0", "p1", "p2", "p3", "p4", "p5"],
    rotations: [-0.3, 0.2, -0.4, 0.3, 0.2, -0.2],
  },
  // Layout E: Big right dominant (5 panels)
  {
    id: 4,
    gridTemplateColumns: "1fr 1.5fr",
    gridTemplateRows: "0.8fr 1fr 1.2fr",
    gridTemplateAreas: `
      "p0 p1"
      "p2 p1"
      "p3 p4"
    `,
    areas: ["p0", "p1", "p2", "p3", "p4"],
    rotations: [0.4, -0.2, 0.3, -0.4, 0.2],
  },
  // Layout F: 6 panels mixed
  {
    id: 5,
    gridTemplateColumns: "1.2fr 0.8fr 1fr",
    gridTemplateRows: "1fr 1.3fr 0.9fr",
    gridTemplateAreas: `
      "p0 p0 p1"
      "p2 p3 p1"
      "p2 p4 p5"
    `,
    areas: ["p0", "p1", "p2", "p3", "p4", "p5"],
    rotations: [0.2, -0.3, 0.4, -0.2, 0.3, -0.4],
  },
];

export function getLayout(count: number, seed: number): MangaLayout {
  const suitable = mangaLayouts.filter(l => l.areas.length >= count);
  if (suitable.length === 0) return mangaLayouts[mangaLayouts.length - 1];
  return suitable[seed % suitable.length];
}