// ─────────────────────────────────────────
// OSFNG SITE DATA
// Source: Indexed website footer + LinkedIn profile + public social posts
// Review date: 10 October 2026
// ALL items marked [CONFIRM] must be verified by OSFNG before launch
// ─────────────────────────────────────────

// ── Brand ─────────────────────────────────
export const brand = {
  name: "Operation Smile Foundation",
  shortName: "OSF",
  acronym: "OSFNG",
  tagline: "Putting Smiles on Faces, One Life at a Time",
  // Source: LinkedIn public profile description
  mission:
    "Operation Smile Foundation is a developmental organisation working towards alleviating poverty and putting smiles on the faces of individuals, especially women and youths, by strengthening their capacity to achieve their basic needs using resources within their communities.",
  // Source: LinkedIn recruitment profile
  missionShort:
    "Reducing poverty through innovative financial and non-financial programmes targeting disadvantaged groups.",
  founded: "2020",
  type: "Non-profit Organisation",
  // Source: LinkedIn
  location: "Owerri, Imo State, Nigeria",
  heroHeadline: "Empowering Communities. Transforming Lives.",
  heroSubheadline:
    "Operation Smile Foundation provides savings, loans and development programmes to help women, youth and underserved communities in Nigeria build better futures.",
};

// ── Contact (Source: indexed website footer) ──
// [CONFIRM] all details before launch
export const contact = {
  address: "132 Wetheral Road, Owerri, Imo State, Nigeria",
  email: "support@osfng.org",
  // Phone from indexed footer: 234-913-997-3419
  phone: "234-913-997-3419",
  // [CONFIRM] opening hours — third-party directory only
  hours: null as null | string,
  social: {
    // [CONFIRM] official URLs before linking
    twitter: "https://twitter.com/operationSmil18",
    facebook: null as null | string,
    instagram: null as null | string,
    linkedin: "https://ng.linkedin.com/company/operation-smile-foundation",
  },
};

// ── Focus Areas (Source: LinkedIn profile specialities) ──
export const focusAreas = [
  {
    id: "financial-inclusion",
    title: "Financial Inclusion",
    description:
      "Providing savings, loans and financial literacy to underserved individuals and businesses.",
    icon: "piggy-bank",
  },
  {
    id: "health",
    title: "Health",
    description:
      "Supporting community health initiatives and access to basic healthcare.",
    icon: "heart-pulse",
  },
  {
    id: "agriculture",
    title: "Agriculture",
    description:
      "Empowering farmers and rural communities through agricultural support programmes.",
    icon: "wheat",
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship & Mentoring",
    description:
      "Developing business skills and providing mentoring to youth and women entrepreneurs.",
    icon: "lightbulb",
  },
];

// ── Products (Source: indexed website navigation) ──
// Product details NOT captured — [CONFIRM] all terms with OSFNG
export const products = [
  {
    id: "savings",
    name: "Savings & Investment",
    pageName: "OSFNG Savings and Investment",
    tagline: "Save consistently. Build your future.",
    description:
      "Build financial security with our savings and investment plans. OSF offers four dedicated savings accounts to match your goals — from daily savings to planning for your child's future.",
    // Source: osfng.org/Savings.html — fetched 10 October 2026
    savingsPlans: [
      {
        name: "Target Savings Plan",
        description:
          "Designed for individuals who want to save towards a specific goal — house rent, wedding, vacation, or a rainy-day fund. Also qualifies you for a loan to boost your business at a reduced interest rate.",
        verified: true,
      },
      {
        name: "Daily Savings Plan",
        description:
          "For individuals with a monthly target who wish to save a compulsory minimum amount daily to reach their goal. Our dedicated officers go to each member to collect the daily savings.",
        verified: true,
      },
      {
        name: "Trader Savings Plan",
        description:
          "Specifically for traders who plan to borrow at a future date. Members must save up to 10% of the amount requested. Comes with a competitive interest rate.",
        verified: true,
      },
      {
        name: "Happy Child Savings Account",
        description:
          "Secure your child's future until adulthood. OSF members can save towards the welfare of their children and dependants with an opening balance of as little as ₦500.",
        openingBalance: "₦500",
        verified: true,
      },
    ],
    href: "/savings",
    verified: true,
  },
  {
    id: "loans",
    name: "Loans",
    tagline: "Borrow with purpose. Repay with discipline.",
    description:
      "Access affordable education finance and working capital loans designed for families and small businesses across Nigeria.",
    // Source: osfng.org/Loans.html — fetched 10 October 2026
    loanProducts: [
      {
        name: "Education Loan",
        purpose:
          "To cover tuition fees, uniforms, books and school bus transportation for children in Nigerian primary and secondary schools.",
        description:
          "Aimed at parents and guardians who want to educate their children in well-established Nigerian schools while protecting their business cash flow. Accessible to any OSF member.",
        loanRange: "₦20,000 – ₦200,000",
        gracePeriod:
          "1 month moratorium (approximately 30 days after disbursement)",
        interestRate: "2.5% flat",
        repayment: "Monthly",
        availability: "Available all year round",
        verified: true,
      },
    ],
    href: "/loans",
    verified: true,
  },
  {
    id: "csr",
    name: "CSR",
    // [CONFIRM] what CSR means on their site — do not assume
    tagline: "[To be confirmed by OSFNG]",
    description: "[CSR page content to be confirmed by OSFNG]",
    features: [],
    href: "/csr",
    verified: false,
  },
];

// ── Membership ──
// [CONFIRM] eligibility, fees, benefits, required documents with OSFNG
export const membership = {
  headline: "Become a Member",
  description:
    "Join the Operation Smile Foundation community. Membership gives you access to our financial products and development programmes.",
  // [CONFIRM] all membership terms, fees and requirements
  note: "Membership details and requirements to be confirmed by OSFNG.",
};

// ── Community Activities (Source: public social posts) ──
// [CONFIRM] dates, details and image rights with OSFNG before using as stories
export const communityActivities = [
  {
    title: "Happy Child Savings — School Financial Literacy",
    description:
      "Operation Smile Foundation conducted a Happy Child Savings financial-literacy session at Model Comprehensive Secondary School, Mgbirichi, helping students understand education planning and savings.",
    // Source: public social post listing
    date: "July 2024",
    location: "Model Comprehensive Secondary School, Mgbirichi",
    verified: false, // [CONFIRM] date, images and consent with OSFNG
  },
  {
    title: "International Day of the Girl Child Outreach",
    description:
      "OSF introduced savings and loan products in Nwaorieubi and surrounding communities, focusing on meeting family and business needs for women and girls.",
    date: "October 2023",
    location: "Nwaorieubi, Imo State",
    verified: false, // [CONFIRM] date, images and consent with OSFNG
  },
];

// ── Key Message (Source: Executive Director public LinkedIn post) ──
export const edQuote = {
  text: "Your child's education is too important to be an emergency.",
  author: "Executive Director, Operation Smile Foundation",
  // [CONFIRM] attribution, name and title with OSFNG
};

// ── Responsible Borrowing Message (Source: public LinkedIn post) ──
export const borrowingMessage = {
  headline: "Borrow with Purpose. Repay with Discipline.",
  body: "A loan should help you address a genuine need or support productive activity. Plan your repayment, build your savings as your business grows, and use credit as a tool for progress — not a burden.",
};

// ── Stats (ALL PLACEHOLDER — [CONFIRM] with OSFNG) ──
export const stats = [
  { label: "Year Founded", value: "2020", confirmed: true },
  { label: "Communities Served", value: "[CONFIRM]", confirmed: false },
  { label: "Members", value: "[CONFIRM]", confirmed: false },
  { label: "Lives Impacted", value: "[CONFIRM]", confirmed: false },
];
