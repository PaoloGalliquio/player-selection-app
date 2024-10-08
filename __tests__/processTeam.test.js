// /////////////////////////////////////////////////////////////////////////////
// TESTING AREA
// THIS IS AN AREA WHERE YOU CAN TEST YOUR WORK AND WRITE YOUR OWN TESTS
// /////////////////////////////////////////////////////////////////////////////

import request from "supertest";
import "@babel/polyfill";
import api from "../src/api";
import db from "../src/db";
import models from "../src/db/model";

describe("process team api with for one position", () => {
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
      {
        name: "player name 4",
        position: "midfielder",
        playerSkills: [
          {
            skill: "defense",
            value: 70,
          },
          {
            skill: "stamina",
            value: 80,
          },
          {
            skill: "speed",
            value: 75,
          },
        ],
      },
      {
        name: "player name 5",
        position: "defender",
        playerSkills: [
          {
            skill: "defense",
            value: 95,
          },
          {
            skill: "strength",
            value: 80,
          },
          {
            skill: "stamina",
            value: 65,
          },
        ],
      },
      {
        name: "player name 6",
        position: "midfielder",
        playerSkills: [
          {
            skill: "defense",
            value: 10,
          },
          {
            skill: "strength",
            value: 90,
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

  it("process team should work", async () => {
    const data = [
      {
          "position": "midfielder",
          "mainSkill": "speed",
          "numberOfPlayers": 1
      },
      {
          "position": "defender",
          "mainSkill": "strength",
          "numberOfPlayers": 1
      },
      {
          "position": "defender",
          "mainSkill": "defense",
          "numberOfPlayers": 1
      }
    ];

    const response = await request(api).post("/api/team/process").send(data);

    expect(response.body).toEqual(
      expect.objectContaining([
        expect.objectContaining({
          name: "player name 6",
          position: "midfielder",
          playerSkills: [
            expect.objectContaining({
              skill: "defense",
              value: 10,
            }),
            expect.objectContaining({
              skill: "strength",
              value: 90,
            })
          ],
        }),
        expect.objectContaining({
          name: "player name 5",
          position: "defender",
          playerSkills: [
            expect.objectContaining({
              skill: "defense",
              value: 95,
            }),
            expect.objectContaining({
              skill: "stamina",
              value: 65,
            }),
            expect.objectContaining({
              skill: "strength",
              value: 80,
            })
          ],
        }),
        expect.objectContaining({
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
            })
          ],
        }),
      ])
    );
  });

  it("not enought players", async () => {
    const data = [
      {
        position: "defender",
        mainSkill: "defense",
        numberOfPlayers: 7,
      },
    ];

    const response = await request(api).post("/api/team/process").send(data);

    expect(response.body).toEqual({ message: "Insufficient number of players for position: defender"});
  });

  it("not enought players with the same position", async () => {
    const data = [
      {
        position: "defender",
        mainSkill: "defense",
        numberOfPlayers: 1,
      },
      {
        position: "defender",
        mainSkill: "strength",
        numberOfPlayers: 2,
      },
    ];

    const response = await request(api).post("/api/team/process").send(data);

    expect(response.body).toEqual({ message: "Insufficient number of players for position: defender"});
  });

  it("position and skill duplicated", async () => {
    const data = [
      {
        position: "defender",
        mainSkill: "defense",
        numberOfPlayers: 1,
      },
      {
        position: "defender",
        mainSkill: "defense",
        numberOfPlayers: 1,
      },
    ];

    const response = await request(api).post("/api/team/process").send(data);

    expect(response.body).toEqual({ message: "Position: defender and skill: defense combination is duplicated"});
  });

  it("invalid skill", async () => {
    const data = [
      {
        position: "defender",
        mainSkill: "defense1",
        numberOfPlayers: 1,
      }
    ];

    const response = await request(api).post("/api/team/process").send(data);

    expect(response.body).toEqual({ message: "Invalid value for skill: defense1"});
  });

  it("invalid position", async () => {
    const data = [
      {
        position: "defender1",
        mainSkill: "defense",
        numberOfPlayers: 1,
      }
    ];

    const response = await request(api).post("/api/team/process").send(data);

    expect(response.body).toEqual({ message: "Invalid value for position: defender1"});
  });

  it("should return the best player if none of them has the required skill", async () => {
    const data = [
      {
        position: "defender",
        mainSkill: "speed",
        numberOfPlayers: 1,
      }
    ];

    const response = await request(api).post("/api/team/process").send(data);

    expect(response.body).toEqual(
      expect.objectContaining([
        expect.objectContaining({
          name: "player name 5",
          position: "defender",
          playerSkills: [
            expect.objectContaining({
              skill: "defense",
              value: 95,
            }),
            expect.objectContaining({
              skill: "stamina",
              value: 65,
            }),
            expect.objectContaining({
              skill: "strength",
              value: 80,
            }),
          ],
        }),
      ])
    );
  });
});
