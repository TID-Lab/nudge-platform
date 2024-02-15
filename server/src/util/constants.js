const DEMO_ENUM = {
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

module.exports = {
  DEMO_ENUM,
};
