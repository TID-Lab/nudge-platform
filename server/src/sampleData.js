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
      username: 'jsomasundaram3'
    }
  ],
  participantData: [
    {
      participantId: 5,
      labels: ['asian', 'female', '65+', 'tested', 'at-risk'],
    },
    {
      participantId: 3,
      labels: ['black', 'male', '30-40', 'untested', 'has-diabetes'],
    },
    {
      participantId: 2,
      labels: ['white', 'female', '18-29', 'untested', 'at-risk'],
    },
    {
      participantId: 7,
      labels: ['asian', 'female', '41-50', 'untested', 'caretaker'],
    },
    {
      participantId: 1,
      labels: ['black', 'female', '65+', 'untested', 'has-diabetes'],
    },
    {
      participantId: 234,
      labels: ['white', 'female', '18-29', 'untested', 'at-risk'],
    },
    {
      participantId: 2346,
      labels: ['latinx', 'male','30-40', 'untested', 'at-risk'],
    },
    {
      participantId: 456,
      labels: ['native-american', 'female', '18-29', 'untested', 'has-diabetes'],
    },
    {
      participantId: 9087,
      labels: ['asian', 'female', '18-29', 'untested', 'at-risk'],
    },
    {
      participantId: 4523,
      labels: ['latinx', 'male', '30-40', 'tested', 'caretaker'],
    },
    {
      participantId: 32452,
      labels: ['black', 'male', '41-50', 'untested', 'at-risk'],
    },
    {
      participantId: 25,
      labels: ['black', 'male', '51-64', 'tested', 'has-diabetes'],
    },
    {
      participantId: 66,
      labels: ['latinx', 'female', '41-50', 'untested', 'caretaker'],
    },
    {
      participantId: 2341,
      labels: ['asian', 'female', '18-29', 'untested', 'at-risk'],
    },
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
