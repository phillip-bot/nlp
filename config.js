'use strict';

const {Entity, Intent} = require('./lib/db');

(async function () {
  try {
    const {id: timeZoneId} = await Entity.upsert({
      name: 'TimeZone',
      delimiter: '',
      entities: [],
      examples: {
        '3:15pm et': ' et',
        '12:35pm pt': ' pt',
        '10:35 pm pt': ' pt',
        '10:15 AM PT': ' PT',
        '5:50 PM CT': ' CT',
        '7:32 PM ct': ' ct',
        '5:50 AM ET': ' ET',
        '4am mt': ' mt',
        '2pm': '',
        '11am': '',
        '2 PM': '',
        '12am pt': ' pt'
      },
      system: true
    });

    const {id: timeId} = await Entity.upsert({
      name: 'Time',
      delimiter: '',
      entities: [
        {
          id: timeZoneId,
          optional: true
        }
      ],
      examples: {
        '!event tft 3:15pm et': '3:15pm et',
        '!event games 12:35pm pt': '12:35pm pt',
        '!event games 10:35 pm pt': '10:35 pm pt',
        '!event fun 10:15 AM PT': '10:15 AM PT',
        '!event games?? 5:50 PM CT': '5:50 PM CT',
        '!event games?? 5:50 AM ET': '5:50 AM ET',
        '!event games?? 4am mt': '4am mt',
        '!event test 2pm': '2pm',
        '!event test 11am': '11am',
        'Create an event pizza at 2pm on Tuesday': '2pm',
        'Create an event pizza at 2 PM on Tuesday': '2 PM',
        'create an event at 12am pt named pizza': '12 am pt'
      },
      system: true
    });

    await Intent.upsert({
      name: 'Event',
      examples: {'!event tft 3:00pm': '!event'},
      entities: [
        {
          id: timeId,
          optionl: false
        }
      ]
    });

    await Intent.upsert({
      name: 'Reschedule',
      examples: {'!reschedule 3:00pm': '!reschedule'},
      entities: [
        {
          id: timeId,
          optionl: false
        }
      ]
    });
  } catch (err) {
    console.log(err);
  }
})();
