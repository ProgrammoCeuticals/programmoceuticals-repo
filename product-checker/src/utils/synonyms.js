// Each key is a canonical name; values are alternate names that should resolve to it.
// Matching is bidirectional: searching any alias finds the canonical, and vice versa.
const RAW_SYNONYMS = [
  // ── Analgesics / antipyretics ────────────────────────────────────────────────
  ["paracetamol", "acetaminophen", "paracetamole", "paracetmaol", "para"],
  ["ibuprofen", "ibuprofen bp", "ibuprofen sodium"],
  ["diclofenac", "diclofenac sodium", "diclofenac potassium", "diclofenac bp"],
  ["aceclofenac", "aceclofenac sodium"],
  ["nimesulide", "nimesulid"],
  ["mefenamic acid", "mefanamic acid"],
  ["lornoxicam", "lornoxicam bp"],
  ["tapentadol", "tapentadol hydrochloride"],
  ["tramadol", "tramadol hydrochloride", "tramadol hcl"],
  ["metamizole", "analgin", "novalgin", "dipyrone", "methampyrone"],
  ["aspirin", "acetylsalicylic acid", "asa"],
  ["naproxen", "naproxen sodium"],
  ["indomethacin", "indometacin"],
  ["piroxicam", "piroxicam bp"],
  ["meloxicam", "meloxicam bp"],
  ["phenylbutazone", "butazolidine"],
  ["propyphenazone", "isopropylantipyrine"],

  // ── Antibiotics — penicillins ────────────────────────────────────────────────
  ["amoxicillin", "amoxycillin", "amoxicillin trihydrate", "amoxicillin bp"],
  ["ampicillin", "ampicillin trihydrate", "ampicillin sodium"],
  ["cloxacillin", "dicloxacillin", "cloxacillin sodium"],
  [
    "clavulanic acid",
    "clavulanate",
    "potassium clavulanate",
    "clavulanic",
    "potassium clavulanic acid",
  ],
  ["flucloxacillin", "floxacillin"],

  // ── Antibiotics — cephalosporins ─────────────────────────────────────────────
  ["cefixime", "cefixime trihydrate"],
  ["cefuroxime", "cefuroxime axetil"],
  ["cephalexin", "cefalexin", "cephalexin monohydrate"],
  ["cefpodoxime", "cefpodoxime proxetil"],
  ["ceftriaxone", "ceftriaxone sodium"],

  // ── Antibiotics — fluoroquinolones ───────────────────────────────────────────
  ["ciprofloxacin", "ciprofloxacin hydrochloride", "ciprofloxacin hcl"],
  ["ofloxacin", "oflaxacin", "ofloxaxin"],
  ["levofloxacin", "levofloxacin hemihydrate"],
  ["norfloxacin", "norfloxacin bp"],
  ["moxifloxacin", "moxifloxacin hydrochloride"],
  ["enrofloxacin", "enrofloxacin bp"],

  // ── Antibiotics — macrolides ─────────────────────────────────────────────────
  ["azithromycin", "azithromycin dihydrate"],
  ["clarithromycin", "clarithromycin bp"],
  ["erythromycin", "erythromycin stearate", "erythromycin ethylsuccinate"],
  ["roxithromycin", "roxithromycin bp"],

  // ── Antibiotics — tetracyclines ──────────────────────────────────────────────
  ["doxycycline", "doxycycline hyclate", "doxycycline monohydrate"],
  ["tetracycline", "tetracycline hydrochloride"],

  // ── Antibiotics — aminoglycosides ────────────────────────────────────────────
  [
    "gentamicin",
    "gentamycin",
    "gentamicin sulphate",
    "gentamicin sulfate",
    "gentamicin c1a",
  ],
  ["neomycin", "neomycin sulphate", "neomycin sulfate"],
  ["amikacin", "amikacin sulfate"],
  ["tobramycin", "tobramycin sulfate"],
  ["streptomycin", "streptomycin sulphate"],
  ["kanamycin", "kanamycin sulfate"],

  // ── Antibiotics — others ─────────────────────────────────────────────────────
  ["metronidazole", "metronidazol", "metronidazole bp"],
  ["tinidazole", "tinidazole bp"],
  ["ornidazole", "ornidazole bp"],
  ["secnidazole", "secnidazole bp"],
  ["nimorazole", "nimorazole bp"],
  ["chloramphenicol", "chloramphennicol", "chloramphenicol succinate"],
  ["clindamycin", "clindamycin hydrochloride", "clindamycin phosphate"],
  ["linezolid", "linezolid bp"],
  ["vancomycin", "vancomycin hydrochloride"],
  ["fusidic acid", "sodium fusidate"],
  [
    "cotrimoxazole",
    "trimethoprim sulfamethoxazole",
    "trimethoprim sulphamethoxazole",
    "co-trimoxazole",
    "septrin",
  ],
  ["trimethoprim", "trimethoprim bp"],
  ["nitazoxanide", "nitazoxanide bp"],
  ["furazolidone", "furazolidonee"],
  ["colistin", "colistin sulfate", "polymyxin e"],

  // ── Antifungals ──────────────────────────────────────────────────────────────
  ["clotrimazole", "clotimazole", "clomitrimazole", "clotrimoazole"],
  ["ketoconazole", "ketoconazol"],
  ["fluconazole", "fluconazole bp"],
  ["itraconazole", "itraconazole bp"],
  ["terbinafine", "terbinafine hydrochloride"],
  ["miconazole", "miconazole nitrate"],
  ["nystatin", "nystatin bp"],
  ["griseofulvin", "griseofulvin bp"],
  ["tolnaftate", "tolnaftate bp"],

  // ── Antiparasitics / anthelmintics ───────────────────────────────────────────
  ["albendazole", "albendazole bp"],
  ["mebendazole", "mebendazole bp"],
  ["piperazine", "piperazine citrate", "piperazine adipate"],
  ["pyrantel", "pyrantel pamoate", "pyrantel embonate"],
  ["levamisole", "levamisole hydrochloride"],
  ["ivermectin", "ivermectin bp"],
  [
    "diethylcarbamazine",
    "diethylcabamazine citrate",
    "dec",
    "diethyl carbamazine",
  ],
  ["permethrin", "permethrin bp"],

  // ── Antimalarials ────────────────────────────────────────────────────────────
  ["chloroquine", "chloroquine phosphate", "chloroquine sulphate"],
  ["artemether", "artemether bp"],
  ["artesunate", "artesunate bp"],
  ["arteether", "arteether bp"],
  ["quinine", "quinine sulphate", "quinine sulfate", "quinine hydrochloride"],
  ["piperaquine", "piperaquine phosphate", "piperaquine tetraphosphate"],
  ["sulphadoxine", "sulfadoxine"],
  ["pyrimethamine", "pyrimethamine bp"],
  ["halofantrine", "halofantrine hydrochloride"],
  ["lumefantrine", "lumefantrine bp"],

  // ── Antivirals ───────────────────────────────────────────────────────────────
  ["acyclovir", "aciclovir", "acyclovir bp"],
  ["zidovudine", "azt", "retrovir"],
  ["lamivudine", "3tc"],
  ["tenofovir", "tenofovir disoproxil fumarate", "tdf"],
  ["efavirenz", "efavirenz bp"],

  // ── Antihistamines ───────────────────────────────────────────────────────────
  [
    "chlorpheniramine",
    "chlorphenamine",
    "chlorpheniramine maleate",
    "chlopheniramine",
    "chlorepheniramine maleate",
    "chlopheniramine maleate",
    "chlorpheneramine",
    "chlorphaniramine",
  ],
  [
    "cetirizine",
    "cetirizine hydrochloride",
    "certirizine",
    "cetrizine",
    "cetririzine",
  ],
  [
    "levocetirizine",
    "levocetirizine dihydrochloride",
    "levocetrizine",
    "levocertirizine",
  ],
  ["loratadine", "loratadine bp"],
  ["desloratadine", "desloratadine bp"],
  ["fexofenadine", "fexofenadine hydrochloride"],
  ["diphenhydramine", "diphenhydramine hydrochloride", "benadryl"],
  ["promethazine", "promethazine hydrochloride"],
  ["cyproheptadine", "cyproheptadine hydrochloride"],
  ["acrivastine", "acrivastine bp"],
  ["triprolidine", "tripolidine"],
  ["pheniramine", "pheniramine maleate"],
  ["ketotifen", "ketotifen fumarate"],
  ["doxylamine", "doxylamine succinate"],

  // ── Decongestants ────────────────────────────────────────────────────────────
  [
    "phenylephrine",
    "phenylephrine hydrochloride",
    "phenyephrine",
    "phenylephirine",
    "phenylephrine ip",
  ],
  ["pseudoephedrine", "pseudoephedrine hydrochloride", "pseudoepheridine"],
  ["naphazoline", "naphazoline hydrochloride"],
  ["xylometazoline", "xylometazoline hydrochloride"],

  // ── Cough / respiratory ──────────────────────────────────────────────────────
  [
    "dextromethorphan",
    "dextromethorphan hydrobromide",
    "dextrometharphan",
    "dextromethophan",
    "dextromethorphen",
  ],
  ["guaifenesin", "guaiphenesin", "guaifenesin bp", "guaiphensin"],
  ["ambroxol", "ambroxol hydrochloride"],
  ["bromhexine", "bromhexine hydrochloride", "bromhenxine", "bromhexin"],
  ["carbocisteine", "carbocysteine", "carbocisteine bp"],
  ["noscapine", "noscapine hydrochloride", "narcotine"],
  ["pholcodine", "pholcodine bp"],
  ["codeine", "codeine phosphate"],
  ["salbutamol", "albuterol", "salbutamol sulphate", "salbutamol sulfate"],
  ["terbutaline", "terbutaline sulphate", "terbutaline sulfate"],
  [
    "theophylline",
    "aminophylline",
    "etofylline",
    "choline theophyllinate",
    "hydroxyethyltheophylline",
    "choline theophylinate",
    "acebrophylline",
  ],
  ["montelukast", "montelukast sodium"],
  ["ipratropium", "ipratropium bromide"],
  ["fluticasone", "fluticasone propionate"],
  [
    "beclomethasone",
    "beclomethasone dipropionate",
    "becloemthasone",
    "beclomethasone diproprionate",
  ],
  ["menthol", "menthol bp"],

  // ── GI tract ─────────────────────────────────────────────────────────────────
  ["omeprazole", "omeprazol", "omepraozle"],
  ["pantoprazole", "pantoprazol"],
  ["lansoprazole", "lansoprazole bp"],
  ["rabeprazole", "rabeprazole sodium"],
  ["esomeprazole", "esomeprazole magnesium"],
  ["ranitidine", "ranitidine hydrochloride"],
  ["famotidine", "famotidine bp"],
  ["cimetidine", "cimetidine bp"],
  ["domperidone", "domperidone maleate"],
  ["metoclopramide", "metoclopramide hydrochloride"],
  ["loperamide", "loperamide hydrochloride"],
  [
    "hyoscine butylbromide",
    "hyoscine n-butylbromide",
    "butylscopolamine",
    "scopolamine butylbromide",
  ],
  ["dicyclomine", "dicycloverine", "dicyclomine hydrochloride"],
  ["atropine", "atropine sulphate", "atropine sulfate"],
  ["simethicone", "activated dimethicone", "dimethicone", "dimethieone"],
  ["magnesium hydroxide", "milk of magnesia"],
  [
    "aluminium hydroxide",
    "aluminum hydroxide",
    "dried aluminium hydroxide",
    "dried alumnium hydroxie gel",
  ],
  ["magaldrate", "hydroxymagnesium aluminate"],
  ["sucralfate", "sucralfate bp"],
  ["pancreatin", "pancreatin bp"],
  ["lactulose", "lactulose bp"],
  ["bisacodyl", "bisacodyl bp"],
  ["senna", "sennosides"],
  ["mebeverine", "mebeverine hydrochloride"],
  ["drotaverine", "drotaverine hydrochloride"],
  ["oxetacaine", "oxethazaine", "oxytacaine"],
  ["furazolidone", "furazolidone bp"],
  ["disodium hydrogen citrate", "sodium hydrogen citrate"],

  // ── Diabetes ─────────────────────────────────────────────────────────────────
  ["metformin", "metformin hydrochloride", "metformin hcl"],
  ["glibenclamide", "glyburide", "glibenclamide bp"],
  ["glimepiride", "glimepride", "glimepiride bp"],
  ["glipizide", "glipizide bp"],
  ["gliclazide", "gliclazide mr", "gliclazide sr", "gliclazide bp"],
  ["pioglitazone", "pioglitazone hydrochloride", "piogllitazone"],
  ["voglibose", "voglibose bp"],
  ["benfotiamine", "benfotiamine bp"],
  ["chromium picolinate", "chromium polynicotinate"],

  // ── Cardiovascular ───────────────────────────────────────────────────────────
  ["amlodipine", "amlodipine besylate", "amlodipine besilate"],
  ["telmisartan", "telmisartan bp"],
  ["olmesartan", "olmesartan medoxomil"],
  ["hydrochlorothiazide", "hctz", "hydrochlorothiazid"],
  ["chlorthalidone", "chlortalidone"],
  ["atorvastatin", "atorvastatin calcium"],
  ["simvastatin", "simvastatin bp"],
  ["cilnidipine", "cilnidipine bp"],
  ["metoprolol", "metoprolol succinate", "metoprolol tartrate"],
  ["atenolol", "atenolol bp"],
  ["bisoprolol", "bisoprolol fumarate"],
  ["carvedilol", "carvedilol bp"],
  ["digoxin", "digitoxin"],
  ["amiodarone", "amiodarone hydrochloride"],
  ["warfarin", "warfarin sodium"],
  ["heparin", "heparin sodium"],
  ["tranexamic acid", "tranexamic acid bp"],
  ["sildenafil", "sildenafil citrate"],
  ["tamsulosin", "tamsulosin hydrochloride"],

  // ── CNS / psychiatric ────────────────────────────────────────────────────────
  ["diazepam", "diazepam bp"],
  ["chlorpromazine", "chlorpromazine hydrochloride"],
  ["haloperidol", "haloperidol bp"],
  ["trifluoperazine", "trifluoperazine hydrochloride"],
  ["trihexyphenidyl", "trihexyphenidyl hydrochloride", "benzhexol"],
  ["flupentixol", "flupentixol decanoate", "flupenthixol"],
  ["escitalopram", "escitalopram oxalate"],
  ["amitriptyline", "amitriptyline hydrochloride"],
  ["imipramine", "imipramine hydrochloride"],
  ["clomipramine", "clomipramine hydrochloride"],
  ["nortriptyline", "nortriptyline hydrochloride"],
  ["carbamazepine", "carbamazepine bp"],
  ["phenytoin", "fosphenytoin", "phenytoin sodium"],
  ["valproic acid", "sodium valproate", "valproate", "valproic acid bp"],
  ["phenobarbital", "phenobarbitone"],
  ["gabapentin", "gabapentin bp"],
  ["lithium", "lithium carbonate", "lithium citrate"],
  ["tramadol", "tramadol hydrochloride"],
  ["pimozide", "pimozide bp"],
  ["piracetam", "piracetam bp"],
  ["vinpocetine", "vinpocetine bp"],
  ["flunarizine", "flunarizine hydrochloride"],
  ["betahistine", "betahistine dihydrochloride"],

  // ── Corticosteroids ──────────────────────────────────────────────────────────
  ["prednisolone", "prednisolone acetate", "prednisolone sodium phosphate"],
  ["dexamethasone", "dexamethasone sodium phosphate"],
  ["hydrocortisone", "cortisol", "hydrocortisone acetate"],
  ["betamethasone", "betamethasone valerate", "betamethasone dipropionate"],
  ["clobetasol", "clobetasol propionate", "clobetasole"],
  ["mometasone", "mometasone furoate"],
  ["triamcinolone", "triamcinolone acetonide"],
  ["fluocinolone", "fluocinolone acetonide"],

  // ── Vitamins / minerals / supplements ────────────────────────────────────────
  ["vitamin c", "ascorbic acid", "ascorbate"],
  [
    "vitamin b12",
    "cyanocobalamin",
    "methylcobalamin",
    "mecobalamin",
    "cobalamin",
    "vitamin b 12",
  ],
  ["vitamin b6", "pyridoxine", "pyridoxine hydrochloride", "phyridoxine"],
  ["vitamin b1", "thiamine", "thiamin", "thiamine hydrochloride"],
  ["vitamin b2", "riboflavin"],
  ["vitamin d", "vitamin d3", "cholecalciferol", "colecalciferol"],
  ["folic acid", "folate", "vitamin b9"],
  ["niacin", "nicotinic acid", "nicotinamide", "vitamin b3"],
  ["vitamin e", "tocopherol", "alpha tocopherol acetate", "tocopheryl acetate"],
  [
    "vitamin k",
    "phytomenadione",
    "phytonadione",
    "menadione",
    "manadione sodium bisulphate",
  ],
  [
    "zinc",
    "zinc sulphate",
    "zinc sulfate",
    "zinc gluconate",
    "zinc acetate",
    "zinc oxide",
    "zinc carnosine",
    "zinc bisglycinate",
    "zink gluconate",
  ],
  [
    "iron",
    "ferrous sulphate",
    "ferrous sulfate",
    "ferrous gluconate",
    "ferric",
  ],
  [
    "magnesium",
    "magnesium hydroxide",
    "magnesium trisilicate",
    "magaldrate",
    "magnesium oxide",
    "mgnesium trisillicate",
  ],
  ["aluminium", "aluminum", "aluminium hydroxide", "dried aluminium hydroxide"],
  [
    "calcium",
    "calcium carbonate",
    "calcium gluconate",
    "calcium phosphate",
    "dibasic calcium phosphate",
  ],
  ["potassium", "potassium chloride", "potassium citrate"],
  [
    "sodium",
    "sodium chloride",
    "sodium bicarbonate",
    "sodium citrate",
    "sodiumcitrate",
  ],
  ["selenium", "selenium bp"],
  ["copper", "copper sulphate"],
  ["manganese", "manganese sulphate"],
  ["lycopene", "lycopene bp"],
  ["ubidecarenone", "coenzyme q10", "ubiquinone"],
  ["glucosamine", "glucosamine sulphate", "glucosamine hydrochloride"],
  ["l-arginine", "arginine"],
  ["levocarnitine", "levocarnitine tartrate", "l-carnitine"],
  [
    "n-acetylcysteine",
    "n-acetyl cysteine",
    "n-acetyl l-cysteine",
    "nac",
    "acetylcysteine",
  ],

  // ── Anaesthetics / topicals ──────────────────────────────────────────────────
  [
    "lignocaine",
    "lidocaine",
    "lignocaine hydrochloride",
    "lidocaine hydrochloride",
  ],
  ["adrenaline", "epinephrine"],
  ["noradrenaline", "norepinephrine"],
  ["atropine", "atropine sulphate"],
  ["chlorhexidine", "chlorhexidine gluconate", "chlorhexidine digluconate"],
  ["cetrimide", "cetyltrimethylammonium bromide"],
  ["benzyl alcohol", "benzyl alcohol bp"],
  ["boric acid", "boric acid bp"],
  ["salicylic acid", "salicylate"],
  ["camphor", "camphor bp"],
  ["thymol", "thymol bp"],

  // ── Muscle relaxants ─────────────────────────────────────────────────────────
  ["chlorzoxazone", "chlorzoxazone bp"],
  ["tizanidine", "tizanidine hydrochloride"],
  ["cyclobenzaprine", "cyclobenzaprine hydrochloride"],

  // ── Oncology (NTI subset — alternate names that appear in real searches) ──────
  ["methotrexate", "amethopterin"],
  ["cyclophosphamide", "cyclophosphamide bp"],
  ["busulfan", "busulphan"],
  ["fluorouracil", "5-fluorouracil", "5-fu"],
  ["mercaptopurine", "6-mercaptopurine", "6-mp"],
  ["imatinib", "imatinib mesylate"],
  ["tamoxifen", "tamoxifen citrate"],
  ["paclitaxel", "taxol"],
  ["docetaxel", "taxotere"],
  ["carboplatin", "carboplatin bp"],
  ["cisplatin", "cisplatin bp"],
  ["doxorubicin", "doxorubicin hydrochloride", "adriamycin"],
  ["vincristine", "vincristine sulphate"],
  ["vinblastine", "vinblastine sulphate"],

  // ── Immunosuppressants ───────────────────────────────────────────────────────
  ["cyclosporine", "ciclosporin", "cyclosporin", "cyclosporine bp"],
  ["tacrolimus", "tacrolimus monohydrate"],
  ["sirolimus", "rapamycin"],
  ["everolimus", "everolimus bp"],
  ["mycophenolic acid", "mycophenolate mofetil", "mycophenolate"],

  // ── Anticoagulants ───────────────────────────────────────────────────────────
  ["acenocoumarol", "nicoumalone"],
  ["phenindione", "phenindione bp"],
  ["dicoumarol", "dicumarol"],

  // ── Hormones / endocrine ─────────────────────────────────────────────────────
  ["levothyroxine", "thyroxine", "l-thyroxine", "thyroid"],
  ["estradiol", "estradiol valerate", "oestradiol"],
  ["progesterone", "progesterone bp"],
  ["testosterone", "testosterone bp"],
  ["bromocriptine", "bromocriptine mesylate"],
  ["cabergoline", "cabergoline bp"],

  // ── Antiepileptics ───────────────────────────────────────────────────────────
  ["phenobarbital", "phenobarbitone", "phenobarbital sodium"],
  ["clonazepam", "clonazepam bp"],

  // ── Antiprotozoals / misc ────────────────────────────────────────────────────
  ["pethidine", "meperidine"],
  ["morphine", "morphine sulphate", "morphine sulfate"],
  ["codeine", "codeine phosphate"],
  ["naloxone", "naloxone hydrochloride"],

  // ── Herbal / traditional (5+5 list) ─────────────────────────────────────────
  ["allium sativum", "garlic"],
  ["aloe vera", "aloe"],
  ["azadirachta indica", "neem"],
  ["zingiber officinale", "ginger"],
  ["garcinia kola", "bitter kola"],
  ["vernonia amygdalina", "bitter leaf"],
  ["moringa oleifera", "moringa", "drumstick tree"],
  ["shea butter", "vitellaria paradoxa"],

  // ── Drug name typos and common misspellings found in data ────────────────────
  ["serratiopeptidase", "serrapeptase", "serratipeptase"],
  ["ammonium chloride", "ammonium"],
  ["sodium bicarbonate", "bicarb", "baking soda"],
  ["sulphamethoxazole", "sulfamethoxazole"],
  ["clotrimazole", "clotimazole", "clomitrimazole", "clotrimoazole"],
  ["fluocinolone", "fluocinolone acetonide"],
  ["chlorobutanol", "chlorobutol"],
  [
    "iodochlorohydroxyquinoline",
    "clioquinol",
    "lodochlorhydroxyquinoline",
    "lodochlorhydroxyquinone",
    "lodochlorohydroxyquinoline",
    "lodochlorohydroxyquinone",
  ],
  ["diphtheria", "dft"],
  ["alginic acid", "alginate"],
  ["lactic acid bacillus", "lactobacillus"],
  ["simethicone", "simeticone", "activated dimethicone", "dimethieone"],
  ["proanthocyanidin", "proanthocyanidins", "opc"],
  ["ursodeoxycholic acid", "udca", "ursodiol"],
  ["silymarin", "milk thistle extract"],
  ["pancreatin", "pancreatine", "pancrelipase"],
  ["disodium hydrogen citrate", "disodium citrate"],
];

// Build a flat lookup: every term → Set of all related terms (including itself)
const SYNONYM_MAP = new Map();

for (const group of RAW_SYNONYMS) {
  const normalized = group.map((t) =>
    t
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim(),
  );
  for (const term of normalized) {
    if (!SYNONYM_MAP.has(term)) {
      SYNONYM_MAP.set(term, new Set());
    }
    for (const related of normalized) {
      SYNONYM_MAP.get(term).add(related);
    }
  }
}

/**
 * Returns all synonyms for a given term (including the term itself).
 * @param {string} term
 * @returns {string[]}
 */
export function expandSynonyms(term) {
  const key = term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  // 1. Exact key lookup
  const group = SYNONYM_MAP.get(key);
  if (group) return Array.from(group);

  // 2. Token-by-token lookup — expand each word in the term independently.
  //    This handles multi-word entry names like "Analgin (Metamizole) / Novalgin (Dipyrone)":
  //    each token ("analgin", "metamizole", "novalgin", "dipyrone") is looked up and their
  //    synonym groups are merged.  A token must be at least 4 chars to avoid noise from
  //    short words like "and", "for", "the", etc.
  const tokens = key.split(/\s+/).filter((t) => t.length >= 4);
  const merged = new Set([key]);
  for (const token of tokens) {
    const tokenGroup = SYNONYM_MAP.get(token);
    if (tokenGroup) {
      for (const s of tokenGroup) merged.add(s);
    }
  }
  // Only return the expanded set if we actually found synonym matches
  if (merged.size > 1) return Array.from(merged);

  // 3. No match — return the normalised term only
  return [key];
}
