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
  BOT111: createCourse("BOT111", "Cryptogamic Botany", 100),
  PHY101: createCourse("PHY101", "General Physics I (Mechanics)", 100),
  PHY103: createCourse("PHY103", "General Physics III", 100),
  CHM101: createCourse("CHM101", "General Chemistry I", 100),
  STA111: createCourse("STA111", "Descriptive Statistics", 100),
 STA112: createCourse("STA112", "Inferential Statistics", 100),
 ECO101: createCourse("ECO101", "Introduction to Economics", 100),
 ECO104: createCourse("ECO104", "Mathematics for Economist", 100),
 ECO105: createCourse("ECO105", "Introduction to Logic", 100),
 ACC101: createCourse("ACC101", "Principles of Accounting", 100),
 AMS101: createCourse("AMS101", "Principles of Management", 100),
 POS113: createCourse("POS113", "The Organization of Govt", 100),
 FEM103: createCourse("FEM103", "Introduction to Mathematics for Management", 100),
};

// --- Faculty Data ---
export const FACULTIES: Faculty[] = [
  {
    id: "science",
    name: "Faculty of Science",
    tagline: "Natural sciences and mathematics disciplines",
    whatsappUrl: "https://chat.whatsapp.com/K11C7cacr6f2UpXunPKCsO",
     courses: [ C.PHY101 , C.BIO101, C.COS101, C.STA111 , C.CHM101, C.MTH101, C.MTH102, C.PHY103 , C.BOT111, C.STA112],
    
  },
  {
   
    id: "technology",
    name: "Faculty of Technology",
    tagline: "Engineering and applied technology disciplines",
     whatsappUrl: "https://chat.whatsapp.com/K11C7cacr6f2UpXunPKCsO",
      courses: [C.PHY101 , C.BIO101, C.STA111 , C.CHM101, C.MTH101, C.MTH102, C.PHY103, C.STA112]
  },
   {
   
    id: "medicine",
    name: "College of Medicine",
    tagline: "Medical and health sciences disciplines",
     whatsappUrl: "https://chat.whatsapp.com/K11C7cacr6f2UpXunPKCsO",
      courses: [C.PHY101 , C.BIO101, C.STA111 , C.CHM101, C.MTH101, C.MTH102, C.PHY103, C.STA112, C.COS101]
  }, {
   
    id: "economics",
    name: "Faculty of Economics",
    tagline: "Faculty Of Economics",
     whatsappUrl: "https://chat.whatsapp.com/K11C7cacr6f2UpXunPKCsO",
      courses: [C.ECO101, C.ECO104, C.ECO105, C.ACC101, C.AMS101 , C.POS113, C.FEM103, C.COS101]
  },
];

export const DEFAULT_FACULTY_ID = "science";