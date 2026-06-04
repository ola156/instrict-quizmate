// --- Types ---
export interface Question {
  id: string;
  courseId: string;
 set_number: number;
  prompt: string;
  solution: string;
  formula?: string;
  options?: string[];
  answerIndex?: number;
  imageUrl?: string;
}

export type Course = {
  code: string;
  title: string;
  level: 100 | 200 | 300 | 400;
  questions: Question[];
};

export type Department = {
  id: string;
  name: string;
  courses: Course[];
};

export type Faculty = {
  id: string;
  name: string;
  tagline: string;
  whatsappUrl: string;
  departments: Department[];
};

// --- Helper ---
const createCourse = (code: string, title: string, level: 100 | 200 | 300 | 400): Course => ({
  code,
  title,
  level,
  questions: [], // Loaded dynamically
});

// --- Master Course Definitions ---
const C = {
  MTH101: createCourse("MTH101", "Elementary Mathematics I", 100),
  MTH102: createCourse("MTH102", "Elementary Mathematics II", 100),
  COS101: createCourse("COS101", "Introduction to Computer Science", 100),
  BIO101: createCourse("BIO101", "General Biology I", 100),
  PHY101: createCourse("PHY101", "General Physics I (Mechanics)", 100),
  PHY102: createCourse("PHY102", "General Physics II (Electromagnetism)", 100),
  PHY103: createCourse("PHY103", "General Physics III", 100),
  PHY104: createCourse("PHY104", "General Physics IV (Optics)", 100),
  GEY101: createCourse("GEY101", "Introduction to Geology", 100),
  GEY102: createCourse("GEY102", "Introduction to Geology II", 100),
  CHM101: createCourse("CHM101", "General Chemistry I", 100),
  CHM102: createCourse("CHM102", "General Chemistry II", 100),
  STA111: createCourse("STA111", "Descriptive Statistics", 100),
  CHE176: createCourse("CHE176", "General Chemistry II", 100),
  MAT121: createCourse("MAT121", "Elementary Mathematics I", 100),
  MAT111: createCourse("MAT111", "Algebra and Trigonometry", 100),
  STA114: createCourse("STA114", "Introduction to Statistics", 100),
  PHY108: createCourse("PHY108", "Physics for Science I", 100),
  PHY118: createCourse("PHY118", "Introduction to Modern Physics", 100),
  GES101: createCourse("GES101", "Use of English", 100),
  GES107: createCourse("GES107", "Nigerian Peoples and Culture", 100),
  GES108: createCourse("GES108", "Philosophy and Logic", 100),
  BOT111: createCourse("BOT111", "General Biology I", 100),
  BOT121: createCourse("BOT121", "General Biology II", 100),
  BOT141: createCourse("BOT141", "Plant Biology", 100),
  MCB121: createCourse("MCB121", "General Microbiology", 100),
  ANT115: createCourse("ANT115", "Introduction to Anthropology", 100),
  ARC111: createCourse("ARC111", "Introduction to Archaeology", 100),
  MAT141: createCourse("MAT141", "Mathematics for Physical Sciences I", 100),
  MAT142: createCourse("MAT142", "Mathematics for Physical Sciences II", 100),
  STA141: createCourse("STA141", "Statistics for Science", 100),
  TME121: createCourse("TME121", "Technical Drawing", 100),
  CSC101: createCourse("CSC101", "Introduction to Computer Science", 100),
};

// --- Faculty Data ---
export const FACULTIES: Faculty[] = [
  {
    id: "science",
    name: "Faculty of Science",
    tagline: "Natural sciences and mathematics disciplines",
    whatsappUrl: "https://chat.whatsapp.com/instrict-science",
    departments: [
      {
        id: "gey",
        name: "Geology",
        courses: [C.GEY101, C.GEY102, C.PHY101 , C.PHY102, C.BIO101, C.COS101, C.STA111 , C.CHM101, C.CHM102, C.MAT121, C.MTH101, C.MTH102, C.PHY103, C.PHY104],
      },
      {
        id: "mcb",
        name: "Microbiology",
        courses: [C.MCB121, C.PHY102, C.BOT141],
      },
      {
        id: "chm",
        name: "Chemistry",
        courses: [C.BOT111, C.CSC101, C.BOT141, C.CHE176, C.MCB121],
      },
      {
        id: "mat",
        name: "Mathematics",
        courses: [C.MAT121, C.MAT111,  C.PHY102, C.PHY103, C.PHY118, C.STA114, C.MAT141, C.MAT142, C.PHY104],
      },
       {
        id: "bot",
        name: "Botany",
        courses: [C.BOT111, C.BOT121, C.BOT141],
      },
       {
        id: "zoo",
        name: "Zoology",
        courses: [C.MAT121, C.MAT111, C.PHY102, C.PHY103, C.PHY118, C.STA114, C.MAT141, C.MAT142, C.PHY104],
      },
       {
        id: "phy",
        name: "Physics",
        courses: [C.MAT121, C.MAT111, C.PHY102, C.PHY103, C.PHY118, C.STA114, C.MAT141, C.MAT142, C.PHY104,]
      },
       {
        id: "sta",
        name: "Statistics",
        courses: [C.MAT121, C.MAT111,  C.PHY102, C.PHY103, C.PHY118, C.STA114, C.MAT141, C.MAT142, C.PHY104, ],
      },
       {
        id: "Arc",
        name: "Archaeology and Anthropology",
        courses: [C.MAT121, C.MAT111, C.PHY102, C.PHY103, C.PHY118, C.STA114, C.MAT141, C.MAT142, C.PHY104,]
      },
       {
        id: "geo",
        name: "Geography",
        courses: [C.MAT121, C.MAT111,C.PHY102, C.PHY103, C.PHY118, C.STA114, C.MAT141, C.MAT142, C.PHY104, ],
      },
    ],
  },
  {
    id: "technology",
    name: "Faculty of Technology",
    tagline: "Engineering and applied technology disciplines",
     whatsappUrl: "https://chat.whatsapp.com/instrict-technology",
    departments: [
      {
        id: "mee",
        name: "Mechanical Engineering",
        courses: [createCourse("MEE201", "Engineering Mechanics", 200)],
      },
    ],
  },
];

export const DEFAULT_FACULTY_ID = "science";