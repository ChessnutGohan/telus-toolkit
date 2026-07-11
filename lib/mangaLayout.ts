export type MangaLayout = {
  id: number;
  gridTemplateAreas: string;
  gridTemplateColumns: string;
  gridTemplateRows: string;
  areas: string[];
};

export const mangaLayouts: MangaLayout[] = [
  {
    // Layout A: one large panel left (2 rows tall) + two small panels right
    id: 0,
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "repeat(5, minmax(160px, auto))",
    gridTemplateAreas: `
      "p1 p1 p2"
      "p1 p1 p3"
      "p4 p5 p6"
      "p7 p7 p8"
      "p9 p10 p10"
    `,
    areas: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10"],
  },
  {
    // Layout B: full-width panel top + two panels bottom (repeated logic)
    id: 1,
    gridTemplateColumns: "repeat(2, 1fr)",
    gridTemplateRows: "repeat(6, minmax(160px, auto))",
    gridTemplateAreas: `
      "p1 p1"
      "p2 p3"
      "p4 p4"
      "p5 p6"
      "p7 p8"
      "p9 p10"
    `,
    areas: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10"],
  },
  {
    // Layout C: three uneven panels side by side
    id: 2,
    gridTemplateColumns: "1.2fr 0.8fr 1fr",
    gridTemplateRows: "repeat(4, minmax(180px, auto))",
    gridTemplateAreas: `
      "p1 p2 p3"
      "p4 p4 p5"
      "p6 p7 p7"
      "p8 p9 p10"
    `,
    areas: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10"],
  },
  {
    // Layout D: two tall panels left + one wide panel right spanning 2 rows
    id: 3,
    gridTemplateColumns: "repeat(4, 1fr)",
    gridTemplateRows: "repeat(4, minmax(180px, auto))",
    gridTemplateAreas: `
      "p1 p2 p3 p3"
      "p1 p2 p3 p3"
      "p4 p5 p6 p7"
      "p8 p8 p9 p10"
    `,
    areas: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10"],
  },
];