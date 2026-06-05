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
 ECO101: createCourse("ECO101", "Introduction to Economics", 100),
 ECO102: createCourse("ECO102", "Principles of Microeconomics", 100),
 ECO104: createCourse("ECO104", "Mathematics for Economist", 100),
 ECO105: createCourse("ECO105", "Introduction to Logic", 100),
 ACC101: createCourse("ACC101", "Principles of Accounting", 100),
 AMS101: createCourse("AMS101", "Principles of Management", 100),
 AMS102: createCourse("AMS102", "Basic Mathematics", 100),
 POS113: createCourse("POS113", "The Organization of Govt", 100),
 FEM103: createCourse("FEM103", "Introduction to Mathematics for Management", 100),
};

// --- Faculty Data ---
export const FACULTIES: Faculty[] = [
  {
    id: "science",
    name: "Faculty of Science",
    tagline: "Natural sciences and mathematics disciplines",
    whatsappUrl: "https://chat.whatsapp.com/DMypGT7hlcuLW51jZKYHeM",
     courses: [ C.PHY101 , C.PHY102, C.BIO101,C.BIO102, C.COS101, C.STA111 , C.CHM101, C.CHM102, C.MTH101, C.MTH102, C.PHY103, C.PHY104, C.GEY101, C.GEY102,C.ZOO101, C.ZOO102],
    
  },
  {
   
    id: "technology",
    name: "Faculty of Technology",
    tagline: "Engineering and applied technology disciplines",
     whatsappUrl: "https://chat.whatsapp.com/C24AXsAGB0OISqqZb7HizA",
      courses: [C.PHY101 , C.PHY102, C.BIO101,C.BIO102, C.STA111 , C.CHM101, C.CHM102, C.MTH101, C.MTH102, C.PHY103, C.PHY104]
  },
   {
   
    id: "medicine",
    name: "Faculty of Medicine",
    tagline: "Medical and health sciences disciplines",
     whatsappUrl: "https://chat.whatsapp.com/K11C7cacr6f2UpXunPKCsO",
      courses: [C.PHY101 , C.PHY102, C.BIO101,C.BIO102, C.STA111 , C.CHM101, C.CHM102, C.MTH101, C.MTH102, C.PHY103, C.PHY104, C.ZOO101, C.ZOO102, C.STA111]
  }, {
   
    id: "economics",
    name: "Faculty of Economics",
    tagline: "Faculty Of Economics",
     whatsappUrl: "https://chat.whatsapp.com/Hd42qu724hOEaCIT5uhssN",
      courses: [C.ECO101, C.ECO102, C.ECO104, C.ECO105, C.ACC101, C.AMS101, C.AMS102, C.POS113, C.FEM103, C.COS101]
  },
];

export const DEFAULT_FACULTY_ID = "science";