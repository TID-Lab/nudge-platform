// Assuming 18-29, 30-41, 42-53, 54-65...
const data = {
  participantData: [
    {
      participantId: 5,
      labels: ['asian', 'female', '18-29'],
    },
    {
      participantId: 3,
      labels: ['black', 'male', '18-29'],
    },
    {
      participantId: 2,
      labels: ['white', 'female', '18-29'],
    },
    {
      participantId: 7,
      labels: ['asian', 'female', '30-41'],
    },
    {
      participantId: 1,
      labels: ['black', 'female', '18-29'],
    },
    {
      participantId: 234,
      labels: ['white', 'female', '18-29'],
    },
    {
      participantId: 2346,
      labels: ['latinx', 'female', '18-29'],
    },
    {
      participantId: 456,
      labels: ['asian', 'male', '18-29'],
    },
    {
      participantId: 9087,
      labels: ['asian', 'female', '30-41'],
    },
    {
      participantId: 4523,
      labels: ['latinx', 'male', '54-65'],
    },
    {
      participantId: 32452,
      labels: ['black', 'male', '18-29'],
    },
    {
      participantId: 25,
      labels: ['black', 'male', '42-53'],
    },
    {
      participantId: 66,
      labels: ['latinx', 'female', '42-53'],
    },
    {
      participantId: 2341,
      labels: ['asian', 'female', '18-29'],
    },
  ],
  nudgeData: [
    {
      message: 'Hello world!',
      date_created: Date(),
      color: 'red',
      com_b: ['motivation', 'capability'],
      is_active: true,
    },
    {
      message: 'Test for the football game!',
      date_created: Date(),
      color: 'red',
      com_b: ['capability', 'oportunity', 'motivation'],
      is_active: true,
    },
    {
      message: 'Extra long nudge for the test! lorem ipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam posuere nisi nunc, sed sodales nunc vehicula ac. Maecenas et commodo nulla, non placerat urna. Aenean maximus tellus ligula, ut rhoncus libero facilisis at. ',
      date_created: Date(),
      color: 'red',
      com_b: ['opportunity'],
      is_active: true,
    },
    {
      message: 'Test for the hockey game!',
      date_created: Date(),
      color: 'red',
      com_b: ['capability'],
      is_active: true,
    },
    {
      message: 'Test for the soccer game!',
      date_created: Date(),
      color: 'red',
      com_b: ['capability'],
      is_active: true,
    },
  ],
};

module.exports = data;
