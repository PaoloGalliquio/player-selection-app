// /////////////////////////////////////////////////////////////////////////////
// TESTING AREA
// THIS IS AN AREA WHERE YOU CAN TEST YOUR WORK AND WRITE YOUR OWN TESTS
// /////////////////////////////////////////////////////////////////////////////

import request from "supertest";
import "@babel/polyfill";
import api from "../src/api";
import db from "../src/db";
import models from "../src/db/model";

describe("list player api", () => {
  beforeEach(async () => {
    await db.sync();
    createPlayers();
  });

  function createPlayers() {
    const players = [
      {
        name: "player name 1",
        position: "defender",
        playerSkills: [
          {
            skill: "defense",
            value: 85,
          },
          {
            skill: "strength",
            value: 75,
          },
        ],
      },
      {
        name: "player name 2",
        position: "midfielder",
        playerSkills: [
          {
            skill: "attack",
            value: 60,
          },
          {
            skill: "speed",
            value: 80,
          },
        ],
      },
      {
        name: "player name 3",
        position: "forward",
        playerSkills: [
          {
            skill: "attack",
            value: 90,
          },
          {
            skill: "speed",
            value: 85,
          },
          {
            skill: "stamina",
            value: 70,
          },
        ],
      },
    ];

    async function createPlayer(player) {
      await request(api).post("/api/player").send(player);
    }

    players.forEach(async (player) => {
      await createPlayer(player);
    });
  }

  afterEach(async () => {
    await models.Player.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
    });

    await models.PlayerSkill.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
    });

    await db.query('DELETE FROM `sqlite_sequence` WHERE `name` = "players"');
    await db.query(
      'DELETE FROM `sqlite_sequence` WHERE `name` = "playerSkills"'
    );
  });

  it("list should work", async () => {
    const response = await request(api).get("/api/player");

    expect(response.body).toEqual(
      expect.objectContaining([
        expect.objectContaining({
          id: 1,
          name: "player name 1",
          position: "defender",
          playerSkills: [
            expect.objectContaining({
              skill: "defense",
              value: 85,
            }),
            expect.objectContaining({
              skill: "strength",
              value: 75,
            }),
          ],
        }),
        expect.objectContaining({
          id: 2,
          name: "player name 2",
          position: "midfielder",
          playerSkills: [
            expect.objectContaining({
              skill: "attack",
              value: 60,
            }),
            expect.objectContaining({
              skill: "speed",
              value: 80,
            }),
          ],
        }),
        expect.objectContaining({
          id: 3,
          name: "player name 3",
          position: "forward",
          playerSkills: [
            expect.objectContaining({
              skill: "attack",
              value: 90,
            }),
            expect.objectContaining({
              skill: "speed",
              value: 85,
            }),
            expect.objectContaining({
              skill: "stamina",
              value: 70,
            }),
          ],
        }),
      ])
    );
  });
});
