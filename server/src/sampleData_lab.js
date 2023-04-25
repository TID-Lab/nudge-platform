// Assuming 18-29, 30-41, 42-53, 54-65...
const data = {
  authUserData: [
    {
      username: 'jw199',
    },
    {
      username: 'azhao63',
    },
    {
      username: 'achen430',
    },
    {
      username: 'mb371',
    },
    {
      username: 'kchen430',
    },
  ],
  participantData: [
    {
      participantId: 1,
      labels: ['asian', 'male', '18-29', 'untested', 'at-risk'],
    },
    {
      participantId: 2,
      labels: ['white', 'male', '51-64', 'untested', 'caretaker'],
    },
    {
      participantId: 3,
      labels: ['white', 'female', '51-64', 'untested', 'at-risk'],
    },
    {
      participantId: 4,
      labels: ['asian', 'female', '30-40', 'tested', 'caretaker'],
    },
    {
      participantId: 5,
      labels: ['latinx', 'female', '41-50', 'tested', 'has-diabetes'],
    }
  ],
  nudgeData: [
    {
      message: 'Hello world!',
      date_created: Date(),
      com_b: ['O-SOC', 'C-PHY'],
      is_active: true,
    },
    {
      message: 'Make sure to test for the football game!',
      date_created: Date(),
      com_b: ['O-SOC'],
      is_active: true,
    },
    {
      message: 'Extra long nudge ~ lorem ipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam posuere nisi nunc, sed sodales nunc vehicula ac. Maecenas et commodo nulla, non placerat urna. Aenean maximus tellus ligula, ut rhoncus libero facilisis at. ',
      date_created: Date(),
      // com_b: ['M-REF'],
      is_active: true,
    },
    {
      message: 'It would be a good time to use your at-home kit!',
      date_created: Date(),
      com_b: ['C-PHY'],
      is_active: true,
    },
    {
      message: 'Save your friends and family the hassle... test often!',
      com_b: ['O-SOC', 'M-AUTO'],
      date_created: Date(),
    },
  ],
};

module.exports = data;
