export const CombColorMap = {
  "c-psy": "magenta",
  "c-phy": "orange",
  "o-soc": "green",
  "o-phy": "cyan",
  "m-ref": "geekblue",
  "m-auto": "purple",
};

export const DEMO_ENUM = {
  Age: ["18-29", "30-40", "41-50", "51-64", "65+"],
  Diabetes: {
    HasDiabetes: "has-diabetes",
    PreDiabetes: "prediabetes",
    FamHasDiabetes: "fam-diabetes",
    AtRisk: "at-risk",
    Caretaker: "caretaker",
  },
  Sex: {
    Female: "female",
    Male: "male",
    Intersex: "non-binary",
    NoneApply: "none-apply",
    NoAnswer: "no-answer",
  },
  Race: {
    NativeAmerican: "native-american",
    Black: "black",
    Latinx: "latinx",
    White: "white",
    Asian: "asian",
    PacificIslander: "pacific-islander",
    Other: "other",
    NoAnswer: "no-answer",
  },
  SickStatus: {
    Sick: "sick",
    NotSick: "not-sick",
    NoResponse: "no-sick-response",
  },
  TestStatus: {
    Tested: "tested",
    NotTested: "untested",
    NoResponse: "no-test-response",
  },
};

export const FIELD_ENUM = {
  RecordId: "record_id_nudge",
  Randomization: "randomization",
  PreDiabetes: "scrn_predb_dx",
  FamHasDiabetes: "scrn_fam_hx",
  AtRisk: "scrn_risk",
  AgeYrs: "age_yrs",
  Race: "race_ethn_race",
  Sex: "bio_sex_birth_2",
};

// Map of participant CSV headers to participant object keys on the nudge platform
export const PARTICIPANT_CSV_MAP = {
  record_id_nudge: "participantId",
  scrn_db_dx: DEMO_ENUM.Diabetes.HasDiabetes,
  scrn_predb_dx: DEMO_ENUM.Diabetes.PreDiabetes,
  scrn_fam_hx: DEMO_ENUM.Diabetes.FamHasDiabetes,
  scrn_risk: DEMO_ENUM.Diabetes.AtRisk,
  scrn_cg: DEMO_ENUM.Diabetes.Caretaker,
  bio_sex_birth_2: {
    0: DEMO_ENUM.Sex.Male,
    1: DEMO_ENUM.Sex.Female,
    3: DEMO_ENUM.Sex.Intersex,
    96: DEMO_ENUM.Sex.NoneApply,
    99: DEMO_ENUM.Sex.NoAnswer,
  },
  race_ethn_race: {
    1: DEMO_ENUM.Race.NativeAmerican,
    2: DEMO_ENUM.Race.Black,
    3: DEMO_ENUM.Race.Asian,
    4: DEMO_ENUM.Race.PacificIslander,
    5: DEMO_ENUM.Race.White,
    15: DEMO_ENUM.Race.Other,
    99: DEMO_ENUM.Race.NoAnswer,
  },
  race_ethn_hispanic: DEMO_ENUM.Race.Latinx,
};
