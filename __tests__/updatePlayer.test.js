// /////////////////////////////////////////////////////////////////////////////
// TESTING AREA
// THIS IS AN AREA WHERE YOU CAN TEST YOUR WORK AND WRITE YOUR OWN TESTS
// /////////////////////////////////////////////////////////////////////////////

import request from 'supertest';
import '@babel/polyfill';
import api from '../src/api';
import db from '../src/db'
import models from '../src/db/model'

describe('update player api', () => {
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

  it('update player should work', async () => {
    const createDate = {
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
    await request(api).post('/api/player').send(createDate);

    const updateData = {
      "name": "player name updated",
      "position": "midfielder",
      "playerSkills": [
        {
          "skill": "strength",
          "value": 40
        },
        {
          "skill": "stamina",
          "value": 30
        }
      ]
    };
    const response = await request(api).put('/api/player/1').send(updateData);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: 1,
        name: 'player name updated',
        position: 'midfielder',
        playerSkills: [
          expect.objectContaining({
            id: 3,
            skill: 'strength',
            value: 40
          }),
          expect.objectContaining({
            id: 4,
            skill: 'stamina',
            value: 30
          })
        ]
      })
    );
  });

  it('update player with wrong position', async () => {
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
    const response = await request(api).put('/api/player/1').send(data);

    expect(response.body).toEqual({ message: 'Invalid value for position: defender1' });
  });

  it('update player without skills', async () => {
    const data = {
      "name": "player name",
      "position": "defender",
    };
    const response = await request(api).put('/api/player/1').send(data);

    expect(response.body).toEqual({ message: 'Player skills are required' });
  });

  it('update player with wrong skill', async () => {
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
    const response = await request(api).put('/api/player/1').send(data);

    expect(response.body).toEqual({ message: 'Invalid value for skill: attack1' });
  });
});