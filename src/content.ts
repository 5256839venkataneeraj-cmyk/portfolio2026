export interface MilestoneItem {
  id: string;
  code: string;
  title: string;
  institution: string;
  period: string;
  location?: string;
  description?: string;
  image: string;
}

export interface TrajectoryItem {
  id: string;
  legNumber: string;
  title: string;
  institution: string;
  period: string;
  details?: string;
}

export interface SkillItem {
  id: string;
  code: string;
  name: string;
  category: string;
  description?: string;
}

export interface InterestItem {
  id: string;
  code: string;
  category: string;
  title: string;
  description: string;
  tag: string;
  iconName: 'Layout' | 'Gamepad2' | 'Bike' | 'Film';
  highlight: string;
}

export interface AchievementItem {
  id: string;
  code: string;
  exam: string;
  stat: string;
  metricLabel: string;
  details: string;
  badge: string;
  accent: 'cyan' | 'sky' | 'indigo' | 'emerald';
}

export interface PortfolioData {
  name: string;
  fullName: string;
  location: string;
  headline: string;
  aiIntegration: {
    tagline: string;
    statement: string;
    description: string;
    capabilities: string[];
  };
  contact: {
    mobile: string;
    mobileDisplay: string;
    email: string;
    linkedin: string;
    linkedinUrl: string;
    instagram: string;
    instagramUrl: string;
    location: string;
  };
  experience: {
    institution: string;
    role: string;
    period: string;
    location: string;
    summary: string;
  };
  education: Array<{
    institution: string;
    degree?: string;
    period: string;
  }>;
  topSkills: string[];
  milestones: MilestoneItem[];
  academicAchievements: AchievementItem[];
  trajectory: TrajectoryItem[];
  skills: SkillItem[];
  interests: InterestItem[];
}

export const content: PortfolioData = {
  name: "NEERAJ BABU",
  fullName: "Potluri venkata sai neeraj babu",
  location: "Bangalore Urban, Karnataka, India",
  headline: "CSE Student | Aspiring Software Developer | AI-Assisted Coding & Python Enthusiast | Problem Solver | Passionate about AI & Continuous Learning",
  
  aiIntegration: {
    tagline: "AI-FIRST PROBLEM SOLVER",
    statement: "Love leveraging AI tools to build things, solve problems, and optimize workflows.",
    description: "Deeply passionate about harnessing state-of-the-art AI development tools, coding copilots, and intelligent systems to design robust architectures, accelerate prototyping, and eliminate friction in complex technical workflows.",
    capabilities: [
      "AI-Assisted Software Engineering",
      "Workflow & Pipeline Optimization",
      "Algorithmic Problem Solving",
      "Rapid Prototype Deployment",
    ],
  },

  contact: {
    mobile: "8618331467",
    mobileDisplay: "+91 8618331467",
    email: "itzneeraj2008@gmail.com",
    linkedin: "potluri-venkata-sai-neeraj-babu-93888b40b",
    linkedinUrl: "https://www.linkedin.com/in/potluri-venkata-sai-neeraj-babu-93888b40b",
    instagram: "unfilteredniiiraj_001",
    instagramUrl: "https://www.instagram.com/unfilteredniiiraj_001/",
    location: "Bangalore Urban, Karnataka, India",
  },

  experience: {
    institution: "Vellore Institute of Technology",
    role: "Student",
    period: "April 2026 - Present (7 months)",
    location: "Vellore, Tamil Nadu, India",
    summary: "CSE Student | Aspiring Software Developer | AI-Assisted Coding & Python Enthusiast | Problem Solver | Passionate about AI & Continuous Learning",
  },

  education: [
    {
      institution: "Vellore Institute of Technology",
      degree: "Bachelor of Technology, Computer Science",
      period: "July 2026",
    },
    {
      institution: "Narayana Institute",
      period: "April 2024 - April 2026",
    },
    {
      institution: "Narayana Institute",
      period: "April 2014 - March 2024",
    },
  ],

  topSkills: [
    "Strategic Planning",
    "Computer Science",
    "Team Leadership",
  ],

  // 4 items mapping to the 4 original SELENE cards (m1-launch.webp, m2-orbit.webp, m3-base.webp, m4-walk.webp)
  // strictly using the PDF education and experience entries
  milestones: [
    {
      id: "m1",
      code: "EDUCATION 01",
      title: "Narayana Institute",
      institution: "Narayana Institute",
      period: "April 2014 - March 2024",
      image: "/media/cards/m1-launch.webp",
    },
    {
      id: "m2",
      code: "EDUCATION 02",
      title: "Narayana Institute",
      institution: "Narayana Institute",
      period: "April 2024 - April 2026",
      image: "/media/cards/m2-orbit.webp",
    },
    {
      id: "m3",
      code: "EDUCATION 03",
      title: "B.Tech Computer Science — VIT Vellore",
      institution: "Vellore Institute of Technology, Vellore",
      period: "July 2026",
      image: "/media/cards/m3-base.webp",
    },
    {
      id: "m4",
      code: "EXPERIENCE",
      title: "Student",
      institution: "Vellore Institute of Technology",
      period: "April 2026 - Present (7 months)",
      location: "Vellore, Tamil Nadu, India",
      description: "CSE Student | Aspiring Software Developer | AI-Assisted Coding & Python Enthusiast | Problem Solver | Passionate about AI & Continuous Learning",
      image: "/media/cards/m4-walk.webp",
    },
  ],

  // Academic Achievements strictly highlighting competitive entrance percentiles and ranks
  academicAchievements: [
    {
      id: "achieve-jee",
      code: "NATIONAL 01",
      exam: "JEE Main",
      stat: "97",
      metricLabel: "PERCENTILE",
      details: "Top 3% national competitive benchmark in India's premier national engineering entrance examination.",
      badge: "TOP 3% IN INDIA",
      accent: "cyan",
    },
    {
      id: "achieve-viteee",
      code: "ALL INDIA 02",
      exam: "VITEEE",
      stat: "1500",
      metricLabel: "ALL INDIA RANK",
      details: "All-India Rank 1500 in the Vellore Institute of Technology Engineering Entrance Examination (VITEEE) — directly securing a B.Tech Computer Science seat at VIT Vellore, the flagship campus.",
      badge: "MERIT RANK",
      accent: "sky",
    },
    {
      id: "achieve-comedk",
      code: "STATE ENTRANCE 03",
      exam: "COMEDK",
      stat: "2500",
      metricLabel: "ALL INDIA RANK",
      details: "Secured Rank 2500 in the Consortium of Medical, Engineering and Dental Colleges of Karnataka entrance exam.",
      badge: "EXCELLENCE RANK",
      accent: "indigo",
    },
    {
      id: "achieve-10th",
      code: "BOARD EXAM 04",
      exam: "10th Grade",
      stat: "2× 100",
      metricLabel: "PERFECT SCORES",
      details: "Achieved two perfect 100s in 10th grade board examinations with outstanding academic distinction.",
      badge: "PERFECT DISTINCTION",
      accent: "emerald",
    },
  ],

  // 4 progression legs strictly from the PDF
  trajectory: [
    {
      id: "leg-01",
      legNumber: "01",
      title: "Narayana Institute",
      institution: "Narayana Institute",
      period: "April 2014 - March 2024",
    },
    {
      id: "leg-02",
      legNumber: "02",
      title: "Narayana Institute",
      institution: "Narayana Institute",
      period: "April 2024 - April 2026",
    },
    {
      id: "leg-03",
      legNumber: "03",
      title: "Bachelor of Technology, Computer Science",
      institution: "Vellore Institute of Technology",
      period: "July 2026",
    },
    {
      id: "leg-04",
      legNumber: "04",
      title: "Student",
      institution: "Vellore Institute of Technology",
      period: "April 2026 - Present (7 months)",
      details: "Vellore, Tamil Nadu, India • CSE Student | Aspiring Software Developer | AI-Assisted Coding & Python Enthusiast | Problem Solver | Passionate about AI & Continuous Learning",
    },
  ],

  // Updated Technical & Engineering Skills with AI Integration
  skills: [
    {
      id: "skill-ai",
      code: "TECH SKILL 01",
      name: "AI-Assisted Coding & Workflows",
      category: "AI & Automation",
      description: "Love leveraging AI tools to build things, solve problems, and optimize workflows with rapid delivery.",
    },
    {
      id: "skill-python",
      code: "TECH SKILL 02",
      name: "Python & Software Development",
      category: "Software Development",
      description: "Algorithmic problem solving, clean application logic, script automation, and scalable design.",
    },
    {
      id: "skill-web",
      code: "TECH SKILL 03",
      name: "Web Development & UI Designing",
      category: "Frontend & UI",
      description: "Creating responsive, modern web interfaces with rich aesthetics, typography, and micro-interactions.",
    },
    {
      id: "skill-cs",
      code: "TECH SKILL 04",
      name: "Computer Science & Problem Solving",
      category: "Core Engineering",
      description: "Solid CS foundations, structured data analysis, systems architecture, and engineering principles.",
    },
    {
      id: "skill-strategy",
      code: "TECH SKILL 05",
      name: "Strategic Planning & Team Leadership",
      category: "Collaboration",
      description: "Strategic project execution, structured roadmap planning, and cross-functional collaboration.",
    },
  ],

  interests: [
    {
      id: "interest-tech",
      code: "PASSION 01",
      category: "Tech & Design",
      title: "Websites & UI Designing",
      description: "Passionate about creating fluid, modern web experiences and sleek user interfaces with high aesthetic standards, typography, and interactive micro-animations.",
      tag: "UI/UX & WEB DEV",
      iconName: "Layout",
      highlight: "Crafting fluid, modern web experiences",
    },
    {
      id: "interest-gaming",
      code: "TACTICAL 02",
      category: "Gaming",
      title: "Call of Duty (CoD)",
      description: "Avid Call of Duty enthusiast who thrives in high-stakes tactical shooter engagements, quick decision-making under pressure, and strategic team coordination.",
      tag: "TACTICAL FPS",
      iconName: "Gamepad2",
      highlight: "High-tempo tactical combat & strategy",
    },
    {
      id: "interest-active",
      code: "VITALITY 03",
      category: "Active Lifestyle",
      title: "Cycling & Endurance",
      description: "Dedicated to regular cycling sessions to maintain high energy, sharpen physical stamina, and refresh mental focus for deep technical problem-solving.",
      tag: "OUTDOOR FITNESS",
      iconName: "Bike",
      highlight: "Physical stamina, clarity & focus",
    },
    {
      id: "interest-cinema",
      code: "INSPIRATION 04",
      category: "Cinema Lover",
      title: "TFI Cinema & Pawan Kalyan",
      description: "Huge admirer of the Telugu Film Industry (TFI). Deeply inspired by Power Star Pawan Kalyan for his charismatic screen presence, unwavering principles, and visionary leadership.",
      tag: "TFI ENTHUSIAST",
      iconName: "Film",
      highlight: "Inspired by Power Star Pawan Kalyan",
    },
  ],
};
