// Assuming 18-29, 30-41, 42-53, 54-65...
const data = {
  authUserData: [
    {
      username: "jw199",
    },
    {
      username: "azhao63",
    },
    {
      username: "jsomasundaram3",
    },
    {
      username: "kchen430",
    },
    {
      username: "mb371",
    },
    {
      username: "cpark333",
    },
    {
      username: "rstarr7",
    },
    {
      username: "rqian9",
    },
    {
      username: "achen430",
    },
  ],
  participantData: [
    {
      participantId: "jeff",
      labels: ["asian", "female", "65+", "tested", "at-risk", "sick"],
    },
    {
      participantId: "andrew",
      labels: [
        "black",
        "male",
        "30-40",
        "untested",
        "has-diabetes",
        "not-sick",
      ],
    },
    {
      participantId: "mike",
      labels: ["white", "female", "18-29", "untested", "at-risk", "sick"],
    },
    {
      participantId: "richard",
      labels: ["asian", "female", "41-50", "untested", "caretaker", "not-sick"],
    },
    {
      participantId: "amy",
      labels: ["black", "female", "65+", "untested", "has-diabetes"],
    },
    {
      participantId: "amy2",
      labels: ["white", "female", "18-29", "untested", "at-risk", "sick"],
    },
    {
      participantId: "kenneth",
      labels: ["latinx", "male", "30-40", "untested", "at-risk"],
    },
    {
      participantId: "jay",
      labels: ["latinx", "male", "30-40", "untested", "at-risk"],
    },
    {
      participantId: "demo001_0",
      labels: ["asian", "female", "41-50", "untested", "caretaker", "sick"],
    },
    {
      participantId: "demo001_1",
      labels: [
        "black",
        "female",
        "65+",
        "untested",
        "has-diabetes",
        "not-sick",
      ],
    },
    {
      participantId: "demo001_2",
      labels: ["white", "female", "18-29", "untested", "at-risk", "not-sick"],
    },
    {
      participantId: "demo001_3",
      labels: ["latinx", "male", "30-40", "untested", "at-risk"],
    },
    {
      participantId: "demo001_4",
      labels: ["black", "female", "65+", "untested", "has-diabetes"],
    },
    {
      participantId: "demo001_5",
      labels: ["white", "female", "18-29", "untested", "at-risk"],
    },
    {
      participantId: "demo001_6",
      labels: ["latinx", "male", "30-40", "untested", "at-risk"],
    },
    {
      participantId: "demo001_7",
      labels: ["latinx", "male", "30-40", "untested", "at-risk"],
    },
  ],
  nudgeData: [
    {
      message: "Hello world!",
      date_created: Date(),
      com_b: ["o-soc", "c-phy"],
      is_active: true,
    },
    {
      message: "Make sure to test for the football game!",
      date_created: Date(),
      com_b: ["o-soc"],
      is_active: true,
    },
    {
      message:
        "Extra long nudge ~ lorem ipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam posuere nisi nunc, sed sodales nunc vehicula ac. Maecenas et commodo nulla, non placerat urna. Aenean maximus tellus ligula, ut rhoncus libero facilisis at. ",
      date_created: Date(),
      // com_b: ['M-REF'],
      is_active: true,
    },
    {
      message: "It would be a good time to use your at-home kit!",
      date_created: Date(),
      com_b: ["c-phy"],
      is_active: true,
    },
    {
      message: "Save your friends and family the hassle... test often!",
      com_b: ["o-soc", "m-auto"],
      date_created: Date(),
    },
  ],
};

module.exports = data;
