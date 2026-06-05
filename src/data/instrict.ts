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



export type Faculty = {
  id: string;
  name: string;
  tagline: string;
  whatsappUrl: string;
  courses: Course[];

};

// --- Helper ---
const createCourse = (code: string, title: string, level: 100 | 200 | 300 | 400): Course => ({
  code,
  title,
  level,
  questions: [], // Loaded dynamically
});

// --- Master Course Definitions ---
export const C = {
  MTH101: createCourse("MTH101", "Elementary Mathematics I", 100),
  MTH102: createCourse("MTH102", "Elementary Mathematics II", 100),
  COS101: createCourse("COS101", "Introduction to Computer Science", 100),
  BIO101: createCourse("BIO101", "General Biology I", 100),
  BIO102: createCourse("BIO102", "General Biology II", 100),
  PHY101: createCourse("PHY101", "General Physics I (Mechanics)", 100),
  PHY102: createCourse("PHY102", "General Physics II (Electromagnetism)", 100),
  PHY103: createCourse("PHY103", "General Physics III", 100),
  PHY104: createCourse("PHY104", "General Physics IV (Optics)", 100),
  GEY101: createCourse("GEY101", "Introduction to Geology", 100),
  GEY102: createCourse("GEY102", "Introduction to Geology II", 100),
  CHM101: createCourse("CHM101", "General Chemistry I", 100),
  CHM102: createCourse("CHM102", "General Chemistry II", 100),
  STA111: createCourse("STA111", "Descriptive Statistics", 100),
  ZOO101: createCourse("ZOO101", "The Mammalian Body", 100),
  ZOO102: createCourse("ZOO102", "Animal Diversity", 100),
};

// --- Faculty Data ---
export const FACULTIES: Faculty[] = [
  {
    id: "science",
    name: "Faculty of Science",
    tagline: "Natural sciences and mathematics disciplines",
    whatsappUrl: "https://chat.whatsapp.com/DMypGT7hlcuLW51jZKYHeM",
     courses: [ C.PHY101 , C.PHY102, C.BIO101, C.COS101, C.STA111 , C.CHM101, C.CHM102, C.MTH101, C.MTH102, C.PHY103, C.PHY104, C.GEY101, C.GEY102,],
    
  },
  {
   
    id: "technology",
    name: "Faculty of Technology",
    tagline: "Engineering and applied technology disciplines",
     whatsappUrl: "https://chat.whatsapp.com/instrict-technology",
      courses: [C.PHY101 , C.PHY102, C.BIO101, C.STA111 , C.CHM101, C.CHM102, C.MTH101, C.MTH102, C.PHY103, C.PHY104]
  },
];

export const DEFAULT_FACULTY_ID = "science";