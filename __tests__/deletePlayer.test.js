// /////////////////////////////////////////////////////////////////////////////
// TESTING AREA
// THIS IS AN AREA WHERE YOU CAN TEST YOUR WORK AND WRITE YOUR OWN TESTS
// /////////////////////////////////////////////////////////////////////////////

import request from 'supertest';
import '@babel/polyfill';
import api from '../src/api';
import db from '../src/db'
import models from '../src/db/model'

require('dotenv').config()

describe('delete player api', () => {
  beforeEach(async () => {
    await db.sync();
    const data = {
      "name": "player name",
      "position": "defender",
      "playerSkills": [
        {
          "skill": "attack",
          "value": 60
        },
        {
          "skill": "speed",
          "value": 80
        }
      ]
    };
    await request(api).post('/api/player').send(data);
  });

  afterEach(async () => {
    await models.Player.destroy({
      where: {},
      truncate: true,
      restartIdentity: true
    });

    await models.PlayerSkill.destroy({
      where: {},
      truncate: true,
      restartIdentity: true
    });

    await db.query('DELETE FROM `sqlite_sequence` WHERE `name` = "players"');
    await db.query('DELETE FROM `sqlite_sequence` WHERE `name` = "playerSkills"');
  });

  it('delete should work', async () => {
    const response = await request(api)
      .delete('/api/player/1')
      .set('Authorization', `${process.env.API_TOKEN}`)
      .send();

    expect(response.body).toEqual({ message: 'Player deleted' });
  });

  it('delete should not work', async () => {
    const response = await request(api)
      .delete('/api/player/1')
      .set('Authorization', `123`)
      .send();

    expect(response.body).toEqual({ message: 'Unauthorized' });
  });

  it('delete a not existing player', async () => {
    const response = await request(api)
      .delete('/api/player/99')
      .set('Authorization', `${process.env.API_TOKEN}`)
      .send();

    expect(response.body).toEqual({ message: 'Player not found' });
  });
});