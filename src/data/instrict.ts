export type Question = {
  id: string;
  year: number;
  prompt: string;
  options?: string[];
  answerIndex?: number;
  solution: string;
  formula?: string;
};

export type Course = {
  code: string;
  title: string;
  level: 100 | 200 | 300 | 400;
  questions: Question[];
};

export type Department = {
  id: string;
  name: string;
  whatsappUrl: string;
  courses: Course[];
};

export type Faculty = {
  id: string;
  name: string;
  tagline: string;
  departments: Department[];
};

const mkQuestions = (seed: string, topic: string): Question[] => [
  {
    id: `${seed}-1`,
    year: 2023,
    prompt: `State and derive the fundamental principle behind ${topic}, then apply it to a worked example.`,
    solution: `We start from first principles. The governing relation for ${topic} can be expressed as a balance between the driving quantity and the resisting quantity. Step 1: identify the variables. Step 2: write the conservation law. Step 3: substitute boundary conditions. Step 4: solve and interpret the result in context.`,
    formula: "Q = ∫₀ᵀ f(x) dx  ⇒  Q ≈ Σ f(xᵢ)Δx",
  },
  {
    id: `${seed}-2`,
    year: 2022,
    prompt: `A multiple-choice scenario testing your understanding of ${topic}. Which option best describes the outcome?`,
    options: [
      "It increases linearly with time",
      "It decays exponentially toward equilibrium",
      "It remains constant under all conditions",
      "It oscillates with constant amplitude",
    ],
    answerIndex: 1,
    solution: `The system obeys a first-order relaxation, so the response decays exponentially toward equilibrium with characteristic time τ. Plugging the initial condition gives y(t) = y∞ + (y₀ − y∞)e^(−t/τ).`,
    formula: "y(t) = y∞ + (y₀ − y∞)·e^(−t/τ)",
  },
  {
    id: `${seed}-3`,
    year: 2021,
    prompt: `Discuss two real-world applications of ${topic} and outline the assumptions under which the model holds.`,
    solution: `Application 1: industrial process control where ${topic} predicts the steady-state behaviour. Application 2: laboratory diagnostics where the same model isolates the dominant effect. Key assumptions: linearity in the operating range, negligible higher-order terms, and isolated boundary conditions.`,
  },
];

const courseList = (deptCode: string, names: { code: string; title: string; level: 100 | 200 | 300 | 400; topic: string }[]): Course[] =>
  names.map((c) => ({
    code: c.code,
    title: c.title,
    level: c.level,
    questions: mkQuestions(`${deptCode}-${c.code}`, c.topic),
  }));

export const FACULTIES: Faculty[] = [
  {
    id: "science",
    name: "Faculty of Science",
    tagline: "Rigorous problem-solving across the natural sciences",
    departments: [
      {
        id: "csc",
        name: "Computer Science",
        whatsappUrl: "https://chat.whatsapp.com/instrict-csc",
        courses: courseList("CSC", [
          { code: "CSC101", title: "Introduction to Computing", level: 100, topic: "binary representation" },
          { code: "CSC201", title: "Data Structures", level: 200, topic: "linked lists and complexity" },
          { code: "CSC301", title: "Algorithms", level: 300, topic: "dynamic programming" },
          { code: "CSC401", title: "Compilers", level: 400, topic: "lexical analysis" },
        ]),
      },
      {
        id: "mcb",
        name: "Microbiology",
        whatsappUrl: "https://chat.whatsapp.com/instrict-mcb",
        courses: courseList("MCB", [
          { code: "MCB101", title: "General Microbiology", level: 100, topic: "microbial classification" },
          { code: "MCB201", title: "Bacteriology", level: 200, topic: "gram staining" },
          { code: "MCB301", title: "Virology", level: 300, topic: "viral replication cycles" },
          { code: "MCB401", title: "Industrial Microbiology", level: 400, topic: "fermentation kinetics" },
        ]),
      },
      {
        id: "chm",
        name: "Chemistry",
        whatsappUrl: "https://chat.whatsapp.com/instrict-chm",
        courses: courseList("CHM", [
          { code: "CHM101", title: "General Chemistry", level: 100, topic: "stoichiometry" },
          { code: "CHM201", title: "Organic Chemistry", level: 200, topic: "nucleophilic substitution" },
          { code: "CHM301", title: "Physical Chemistry", level: 300, topic: "thermodynamic potentials" },
          { code: "CHM401", title: "Analytical Chemistry", level: 400, topic: "spectroscopic analysis" },
        ]),
      },
      {
        id: "geo",
        name: "Geology",
        whatsappUrl: "https://chat.whatsapp.com/instrict-geo",
        courses: courseList("GEO", [
          { code: "GEO101", title: "Earth Materials", level: 100, topic: "mineral identification" },
          { code: "GEO201", title: "Structural Geology", level: 200, topic: "stress and strain in rocks" },
          { code: "GEO301", title: "Petrology", level: 300, topic: "igneous rock formation" },
          { code: "GEO401", title: "Petroleum Geology", level: 400, topic: "hydrocarbon migration" },
        ]),
      },
      {
        id: "phy",
        name: "Physics",
        whatsappUrl: "https://chat.whatsapp.com/instrict-phy",
        courses: courseList("PHY", [
          { code: "PHY101", title: "Mechanics", level: 100, topic: "projectile motion" },
          { code: "PHY201", title: "Electromagnetism", level: 200, topic: "Gauss's law" },
          { code: "PHY301", title: "Quantum Mechanics", level: 300, topic: "Schrödinger's equation" },
          { code: "PHY401", title: "Solid State Physics", level: 400, topic: "band theory" },
        ]),
      },
    ],
  },
  {
    id: "technology",
    name: "Faculty of Technology",
    tagline: "Engineering and applied technology disciplines",
    departments: [
      {
        id: "mee",
        name: "Mechanical Engineering",
        whatsappUrl: "https://chat.whatsapp.com/instrict-mee",
        courses: courseList("MEE", [
          { code: "MEE201", title: "Engineering Mechanics", level: 200, topic: "free body diagrams" },
          { code: "MEE301", title: "Thermodynamics", level: 300, topic: "the second law" },
          { code: "MEE401", title: "Machine Design", level: 400, topic: "fatigue failure" },
        ]),
      },
      {
        id: "eee",
        name: "Electrical Engineering",
        whatsappUrl: "https://chat.whatsapp.com/instrict-eee",
        courses: courseList("EEE", [
          { code: "EEE201", title: "Circuit Theory", level: 200, topic: "Kirchhoff's laws" },
          { code: "EEE301", title: "Signals and Systems", level: 300, topic: "Fourier transforms" },
          { code: "EEE401", title: "Power Systems", level: 400, topic: "load flow analysis" },
        ]),
      },
    ],
  },
  {
    id: "arts",
    name: "Faculty of Arts",
    tagline: "Humanities, languages and critical thought",
    departments: [
      {
        id: "eng",
        name: "English & Literature",
        whatsappUrl: "https://chat.whatsapp.com/instrict-eng",
        courses: courseList("ENG", [
          { code: "ENG101", title: "Use of English", level: 100, topic: "rhetorical devices" },
          { code: "ENG301", title: "Literary Criticism", level: 300, topic: "post-colonial theory" },
        ]),
      },
      {
        id: "his",
        name: "History",
        whatsappUrl: "https://chat.whatsapp.com/instrict-his",
        courses: courseList("HIS", [
          { code: "HIS201", title: "African History", level: 200, topic: "pre-colonial trade networks" },
        ]),
      },
    ],
  },
  {
    id: "social",
    name: "Faculty of Social Sciences",
    tagline: "Society, economy and human behaviour",
    departments: [
      {
        id: "eco",
        name: "Economics",
        whatsappUrl: "https://chat.whatsapp.com/instrict-eco",
        courses: courseList("ECO", [
          { code: "ECO101", title: "Microeconomics", level: 100, topic: "supply and demand equilibrium" },
          { code: "ECO301", title: "Macroeconomics", level: 300, topic: "IS–LM analysis" },
        ]),
      },
      {
        id: "psy",
        name: "Psychology",
        whatsappUrl: "https://chat.whatsapp.com/instrict-psy",
        courses: courseList("PSY", [
          { code: "PSY201", title: "Cognitive Psychology", level: 200, topic: "memory encoding" },
        ]),
      },
    ],
  },
];

export const DEFAULT_FACULTY_ID = "science";