import {
  PLAYER_REQUIRED_FIELDS,
  PLAYER_SKILL_REQUIRED_FIELDS,
  POSITIONS,
  SKILLS,
} from "./constants";

export function playerValidation(player) {
  if (!player) return "Player is required";

  for (const { field, message } of PLAYER_REQUIRED_FIELDS) {
    if (!player[field]) return message;
  }

  if (!Object.values(POSITIONS).includes(player?.position)) {
    return `Invalid value for position: ${player?.position}`;
  }

  if (!player?.playerSkills || player?.playerSkills?.length === 0) {
    return "Player skills are required";
  }

  for (let i = 0; i < player?.playerSkills?.length; i++) {
    const playerSkill = player.playerSkills[i];
    for (const { field, message } of PLAYER_SKILL_REQUIRED_FIELDS) {
      if (!playerSkill[field]) return `${message}${i + 1}`;
    }
    if (!Object.values(SKILLS).includes(playerSkill.skill)) {
      return `Invalid value for skill: ${playerSkill.skill}`;
    }
  }

  return null;
}

export function teamRequirementsValidation(teamRequirements) {
  const positions = new Set();
  const positionsAndSkills = new Set();
  for (const requirement of teamRequirements) {
    if (!Object.values(POSITIONS).includes(requirement.position)) {
      return `Invalid value for position: ${requirement.position}`;
    }
    positions.add(requirement.position);
    if (!Object.values(SKILLS).includes(requirement.mainSkill)) {
      return `Invalid value for skill: ${requirement.mainSkill}`;
    }
    if (
      positionsAndSkills.has(`${requirement.position}-${requirement.mainSkill}`)
    ) {
      return `Position: ${requirement.position} and skill: ${requirement.mainSkill} combination is duplicated`;
    }
    positionsAndSkills.add(`${requirement.position}-${requirement.mainSkill}`);
    if (requirement.numberOfPlayers <= 0) {
      return `Invalid value for number of players: ${requirement.numberOfPlayers}`;
    }
  }
  return null;
}

export function validateNumberOfPlayersPosition(teamRequirements, players) {
  const requiredPositions = teamRequirements.reduce((acc, requirement) => {
    acc[requirement.position] =
      (acc[requirement.position] || 0) + requirement.numberOfPlayers;
    return acc;
  }, {});

  const playerCounts = players.reduce((acc, player) => {
    acc[player.position] = (acc[player.position] || 0) + 1;
    return acc;
  }, {});

  for (const [position, requiredCount] of Object.entries(requiredPositions)) {
    const actualCount = playerCounts[position] || 0;
    if (actualCount < requiredCount) {
      return `Insufficient number of players for position: ${position}`;
    }
  }

  return null;
}
