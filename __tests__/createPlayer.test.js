// /////////////////////////////////////////////////////////////////////////////
// TESTING AREA
// THIS IS AN AREA WHERE YOU CAN TEST YOUR WORK AND WRITE YOUR OWN TESTS
// /////////////////////////////////////////////////////////////////////////////

import request from 'supertest';
import '@babel/polyfill';
import api from '../src/api';
import db from '../src/db'
import models from '../src/db/model'

describe('create player api', () => {
  beforeEach(async () => {
    await db.sync();
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

  it('create player should work', async () => {
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
    const response = await request(api).post('/api/player').send(data);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: 1,
        name: 'player name',
        position: 'defender',
        playerSkills: [
          expect.objectContaining({
            skill: 'attack',
            value: 60
          }),
          expect.objectContaining({
            skill: 'speed',
            value: 80
          })
        ]
      })
    );
  });

  it('create player with wrong position', async () => {
    const data = {
      "name": "player name",
      "position": "defender1",
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
    const response = await request(api).post('/api/player').send(data);

    expect(response.body).toEqual({ message: 'Invalid value for position: defender1' });
  });

  it('create player without skills', async () => {
    const data = {
      "name": "player name",
      "position": "defender",
    };
    const response = await request(api).post('/api/player').send(data);

    expect(response.body).toEqual({ message: 'Player skills are required' });
  });

  it('create player with wrong skill', async () => {
    const data = {
      "name": "player name",
      "position": "defender",
      "playerSkills": [
        {
          "skill": "attack1",
          "value": 60
        }
      ]
    };
    const response = await request(api).post('/api/player').send(data);

    expect(response.body).toEqual({ message: 'Invalid value for skill: attack1' });
  });
});