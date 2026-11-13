export const DEFAULT_STUDY_PERIODS = ["Period 1", "Period 2"] as const;
export const DEFAULT_SUMMARY_RESULTS = ["AUC0-t", "AUC0-∞", "Cmax"] as const;

export const SECTION_B_DOCUMENTS = [
  { itemNumber: 1, documentTitle: "Certificate of analysis (COA) of BE test product" },
  { itemNumber: 2, documentTitle: "Certificate of analysis (COA) of reference product" },
  {
    itemNumber: 3,
    documentTitle:
      "Outer packaging and prescribing information sheet or SmPC of BE reference product. The document should contain the information of the batch number, expiry date, name and address of manufacturer",
  },
  {
    itemNumber: 4,
    documentTitle:
      "(i) Dissolution study report for comparative dissolution profile (CDP) conducted between test product and reference product in pH 1.2, 4.5, 6.8 and quality control media (if applicable). (ii) Dissolution study protocol. The dissolution study report should be dated and signed by analyst or relevant personnel.",
  },
  {
    itemNumber: 5,
    documentTitle:
      "Justifications and bridging data if BE reference product is not the same as WHO comparator product (i.e. same strength and manufacturing site as registered in Nigeria). (i) Dissolution study report for comparative dissolution profile (CDP) conducted between BE reference product in pH 1.2, 4.5, 6.8 and quality control media (if applicable). (ii) Dissolution study protocol. The dissolution study report should be dated and signed by analyst or relevant personnel.",
  },
  {
    itemNumber: 6,
    documentTitle:
      "Application form for a biowaiver of additional strength (if applicable), together with justification and documents for biowaiver request. (i) All strengths are manufactured by the same manufacturing process. (ii) Qualitative and quantitative composition of the different strengths (all). (iii) Dissolution study report for comparative dissolution profile (CDP) conducted between test product and other proposed additional strengths in pH 1.2, 4.5, 6.8 and quality control media (if applicable). (iv) Dissolution study protocol. The dissolution study report should be dated and signed by analyst or relevant personnel.",
  },
  { itemNumber: 7, documentTitle: "Clinical study report" },
  { itemNumber: 8, documentTitle: "Pharmacokinetic and statistical analysis report" },
  { itemNumber: 9, documentTitle: "Bioanalytical method validation report and relevant addendum(s)" },
  { itemNumber: 10, documentTitle: "Bioanalytical study report" },
  { itemNumber: 11, documentTitle: "Quality assurance statement" },
  { itemNumber: 12, documentTitle: "Letter of approval of Institutional Review Board / Independent Ethical Committee (IEC)" },
  { itemNumber: 13, documentTitle: "Study protocol approved by Independent Ethical Committee (IEC)" },
  { itemNumber: 14, documentTitle: "Informed consent form" },
  { itemNumber: 15, documentTitle: "Bioequivalence Trial Information Form, BTIF (in MS Word and pdf)" },
  { itemNumber: 16, documentTitle: "Literature references (if applicable)" },
] as const;
