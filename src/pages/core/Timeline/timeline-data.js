export const Events = [
  {
    id: 0,
    courseInstance: 2,

    name: 'Introduction to study well',
    description:
      'You know.. Intro. The things you need to know. Whether you can skip' +
      " lectures or not, whether it's possible to get an A or you are all doomed.",
    location: 'FMFI F1',

    startDate: '2020-02-18T00:00+01:00',
    endDate: '2020-02-29T23:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [],

    type: 'Block',
  },
  {
    id: 2,
    courseInstance: 2,

    name: 'Basics - ITSW',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-02-18T09:00+01:00',
    endDate: '2020-02-18T13:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'Lecture', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 3,
    courseInstance: 2,

    name: 'Basics Part 1 - ITSW',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-02-19T13:00+01:00',
    endDate: '2020-02-19T15:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'Lab', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 4,
    courseInstance: 2,

    name: 'Basics Part 2 - ITSW',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-02-20T13:00+01:00',
    endDate: '2020-02-20T15:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'Lab', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 5,
    courseInstance: 2,

    name: 'Writing - ITSW',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-02-25T10:00+01:00',
    endDate: '2020-02-25T13:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'Lecture', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 6,
    courseInstance: 2,

    name: 'Writing 2 - ITSW',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'the time when they began to grow ripe it was found that every night one of ' +
      'them was gone. The king became very angry at this, and ordered the gardener ' +
      'to keep watch all night under the tree. The gardener set his eldest son to watch; ' +
      'but about twelve o’clock he fell asleep, and in the morning another of the apples ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-02-27T11:00+01:00',
    endDate: '2020-02-27T14:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 2, name: 'Something Else Completely'},
    ],

    type: 'Lecture', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },

  {
    id: 7,
    courseInstance: 2,

    name: 'Writing Essay - ITSW',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-02-27T15:00+01:00',
    endDate: '2020-02-27T17:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [ {id: 0, name: 'How Dorothy Saved the Scarecrow'} ],

    type: 'Lab', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 8,
    courseInstance: 2,

    name: 'Basics - ITSW',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-02-20T15:00+01:00',
    endDate: '2020-02-27T17:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [],

    type: 'Task', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 9,
    courseInstance: 2,

    name: 'Basics - ITSW',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-02-28T15:00+01:00',
    endDate: '2020-02-28T17:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [],

    type: 'Lab', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 10,
    courseInstance: 2,

    name: 'Basics - ITSW',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-02-25T00:00+01:00',
    endDate: '2020-02-28T00:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'Task', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 11,
    courseInstance: 2,

    name: 'Writing - ALONE',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'the time when they began to grow ripe it was found that every night one of ' +
      'them was gone. The king became very angry at this, and ordered the gardener ' +
      'to keep watch all night under the tree. The gardener set his eldest son to watch; ' +
      'but about twelve o’clock he fell asleep, and in the morning another of the apples ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-02-20T10:00+01:00',
    endDate: '2020-02-20T11:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'OralExam', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },

  {
    id: 12,
    courseInstance: 2,

    name: 'Exam - ITSW',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'the time when they began to grow ripe it was found that every night one of ' +
      'them was gone. The king became very angry at this, and ordered the gardener ' +
      'to keep watch all night under the tree. The gardener set his eldest son to watch; ' +
      'but about twelve o’clock he fell asleep, and in the morning another of the apples ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-02-29T11:00+01:00',
    endDate: '2020-02-29T12:00+01:00',

    subEvent: '', // Event
    superEvent: '', //Event

    materials: [],

    type: 'TestTake', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  // /////////////////////////---------------------------///////////////////
  {
    id: 13,
    courseInstance: 2,

    name: 'Development process',
    description:
      'Software development process in software engineering describes distinct ' +
      'phases needed to develop a full software project. This block consists of two main ' +
      'topics. First topic discloses different development methodologies used today in ' +
      'software development. We will talk more about agile methodologies, waterfall ' +
      'methodology and prototype-based methodologies. Second part summarizes what is ' +
      'needed to develop a successful web application which is the aim of this course. ' +
      "We will use terms as usability, user experience and learn about basic user's needs. ",
    location: '',

    startDate: '2020-03-01T11:00+01:00',
    endDate: '2020-03-28T24:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [],

    type: 'Block',
  },
  {
    id: 14,
    courseInstance: 2,

    name: 'Basics - DP',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-03-02T09:00+01:00',
    endDate: '2020-03-02T13:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'Lecture', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 15,
    courseInstance: 2,

    name: 'Basics Part 1 - DP',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-03-19T13:00+01:00',
    endDate: '2020-03-19T15:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'Lab', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 16,
    courseInstance: 2,

    name: 'Basics Part 2 - DP',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-03-10T13:00+01:00',
    endDate: '2020-03-10T15:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'Lab', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 17,
    courseInstance: 2,

    name: 'Writing - DP',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-03-25T10:00+01:00',
    endDate: '2020-03-25T13:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'Lecture', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 18,
    courseInstance: 2,

    name: 'Writing 2 - DP',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'the time when they began to grow ripe it was found that every night one of ' +
      'them was gone. The king became very angry at this, and ordered the gardener ' +
      'to keep watch all night under the tree. The gardener set his eldest son to watch; ' +
      'but about twelve o’clock he fell asleep, and in the morning another of the apples ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-03-26T11:00+01:00',
    endDate: '2020-03-26T14:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'Lecture', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },

  {
    id: 19,
    courseInstance: 2,

    name: 'Writing - ITSW',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-02-27T15:00+01:00',
    endDate: '2020-02-27T17:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [ {id: 0, name: 'How Dorothy Saved the Scarecrow'} ],

    type: 'Lab', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 20,
    courseInstance: 2,

    name: 'Basics - DP',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-03-10T15:00+01:00',
    endDate: '2020-03-27T17:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [],

    type: 'Task', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 21,
    courseInstance: 2,

    name: 'Basics - DP',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-03-28T15:00+01:00',
    endDate: '2020-03-28T17:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [],

    type: 'Lab', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 22,
    courseInstance: 2,

    name: 'Basics - DP',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-03-25T00:00+01:00',
    endDate: '2020-03-28T00:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'Task', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 23,
    courseInstance: 2,

    name: 'Writing - DP',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'the time when they began to grow ripe it was found that every night one of ' +
      'them was gone. The king became very angry at this, and ordered the gardener ' +
      'to keep watch all night under the tree. The gardener set his eldest son to watch; ' +
      'but about twelve o’clock he fell asleep, and in the morning another of the apples ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-03-27T10:00+01:00',
    endDate: '2020-03-27T11:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'OralExam', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },

  {
    id: 24,
    courseInstance: 2,

    name: 'Exam - DP',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'the time when they began to grow ripe it was found that every night one of ' +
      'them was gone. The king became very angry at this, and ordered the gardener ' +
      'to keep watch all night under the tree. The gardener set his eldest son to watch; ' +
      'but about twelve o’clock he fell asleep, and in the morning another of the apples ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-03-28T17:00+01:00',
    endDate: '2020-03-28T19:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [],

    type: 'TestTake', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },

  ///////////////////////////---------------------------///////////////////
  {
    id: 25,
    courseInstance: 2,

    name: 'Interaction design',
    description:
      'Interaction design aka "the practice of designing interactive digital' +
      ' products, environments, systems, and services." We will explain what does it ' +
      'mean for a software engineer. In this block we will explain basics of ' +
      'user-centred design and we will model personas for your final projects. This ' +
      'will give your perspective to design your web application in a meaningful way.',
    location: '',

    startDate: '2020-03-28T10:00+01:00',
    endDate: '2020-03-28T15:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [],

    type: 'Lecture',
  },
  ///////////////////////////---------------------------///////////////////
  {
    id: 26,
    courseInstance: 2,

    name: 'The Rabbit Sends in a Little Bill',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'the time when they began to grow ripe it was found that every night one of ' +
      'them was gone. The king became very angry at this, and ordered the gardener ' +
      'to keep watch all night under the tree. The gardener set his eldest son to watch; ' +
      'but about twelve o’clock he fell asleep, and in the morning another of the apples ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-04-01T10:00+01:00',
    endDate: '2020-04-30T15:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'Block', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 27,
    courseInstance: 2,

    name: 'Basics - Rabbit',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-04-02T09:00+01:00',
    endDate: '2020-04-02T13:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'Lecture', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 28,
    courseInstance: 2,

    name: 'Basics - Rabbit',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-04-05T13:00+01:00',
    endDate: '2020-04-05T15:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'Lab', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 29,
    courseInstance: 2,

    name: 'Writing - Rabbit',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-04-10T10:00+01:00',
    endDate: '2020-04-10T13:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'Lecture', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 30,
    courseInstance: 2,

    name: 'Writing 2 - Rabbit',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'the time when they began to grow ripe it was found that every night one of ' +
      'them was gone. The king became very angry at this, and ordered the gardener ' +
      'to keep watch all night under the tree. The gardener set his eldest son to watch; ' +
      'but about twelve o’clock he fell asleep, and in the morning another of the apples ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-04-12T11:00+01:00',
    endDate: '2020-04-12T14:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'Lecture', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },

  {
    id: 31,
    courseInstance: 2,

    name: 'Writing Essay - Rabbit',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-04-14T15:00+01:00',
    endDate: '2020-04-14T17:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [ {id: 0, name: 'How Dorothy Saved the Scarecrow'} ],

    type: 'Lab', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 32,
    courseInstance: 2,

    name: 'Basics - Rabbit',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-04-10T15:00+01:00',
    endDate: '2020-04-27T17:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [],

    type: 'Task', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 33,
    courseInstance: 2,

    name: 'Basics - Rabbit',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-04-15T00:00+01:00',
    endDate: '2020-04-18T00:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'Task', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  {
    id: 34,
    courseInstance: 2,

    name: 'Writing - Rabbit',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'the time when they began to grow ripe it was found that every night one of ' +
      'them was gone. The king became very angry at this, and ordered the gardener ' +
      'to keep watch all night under the tree. The gardener set his eldest son to watch; ' +
      'but about twelve o’clock he fell asleep, and in the morning another of the apples ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-04-27T10:00+01:00',
    endDate: '2020-04-27T11:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'OralExam', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },

  {
    id: 35,
    courseInstance: 2,

    name: 'Exam - Rabbit',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'the time when they began to grow ripe it was found that every night one of ' +
      'them was gone. The king became very angry at this, and ordered the gardener ' +
      'to keep watch all night under the tree. The gardener set his eldest son to watch; ' +
      'but about twelve o’clock he fell asleep, and in the morning another of the apples ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-04-28T11:00+01:00',
    endDate: '2020-04-28T12:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [],

    type: 'TestTake', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
  ///////////////////////////---------------------------///////////////////
  {
    id: 36,
    courseInstance: 2,

    name: 'Survival',
    description:
      'A certain king had a beautiful garden, and in the garden stood a ' +
      'tree which bore golden apples. These apples were always counted, and about ' +
      'the time when they began to grow ripe it was found that every night one of ' +
      'them was gone. The king became very angry at this, and ordered the gardener ' +
      'to keep watch all night under the tree. The gardener set his eldest son to watch; ' +
      'but about twelve o’clock he fell asleep, and in the morning another of the apples ' +
      'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
    location: 'H6',

    startDate: '2020-05-01T11:00+01:00',
    endDate: '2020-05-15T12:00+01:00',

    subEvent: '', //Event
    superEvent: '', //Event

    materials: [
      {id: 0, name: 'How Dorothy Saved the Scarecrow'},
      {id: 1, name: 'The Council with the Munchkins'},
    ],

    type: 'Lab', //Block, Session (Lecture, Lab), TaskEvent, ExaminationEvent (OralExam, TestTake)
    //hasInstructor: '', //Session
    //task: {}, //{name: '', description: ''}, //TaskEvent
    //extraTime: '',//TaskEvent
  },
]
