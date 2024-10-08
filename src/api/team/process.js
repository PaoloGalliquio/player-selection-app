// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import Player from "../../db/model/player";
import PlayerSkill from "../../db/model/playerSkill";
import { validateNumberOfPlayersPosition, teamRequirementsValidation } from "../../utils/validations";

export default async (req, res) => {
  const teamRequirements = req.body;

  try{
    const message = teamRequirementsValidation(teamRequirements);
    if (message !== null) {
      res.status(400).json({ message: message });
      return;
    }

    const players = await getPlayers(teamRequirements);
    if (players.length === 0) {
      res.status(404).json({ message: 'No players found' });
      return;
    }
    
    const positionValidationResult = validateNumberOfPlayersPosition(teamRequirements, players);
    if (positionValidationResult !== null) {
      res.status(412).json({ message: positionValidationResult });
      return;
    }

    const team = getTeamByRequirements(teamRequirements, players);
    res.json(team);

  } catch (error) {
    res.status(412).json({ message: error.message });
  }
}

async function getPlayers(teamRequirements){
  return await Player.findAll({
    where: {
      position: teamRequirements.map((teamRequirement) => teamRequirement.position)
    },
    include: [{
      model: PlayerSkill,
      attributes: ['skill', 'value']
    }],
    attributes: ['name', 'position']
  });
}

function getTeamByRequirements(teamRequirements, players) {
  const team = [];
  const availablePlayers = new Set(players);

  for (const requirement of teamRequirements) {
    const eligiblePlayers = [...availablePlayers].filter(player => player.position === requirement.position);
    const sortedPlayers = sortBySkillValue(eligiblePlayers, requirement);
    const selectedPlayers = sortedPlayers.slice(0, requirement.numberOfPlayers);

    team.push(...selectedPlayers);
    
    for (const player of selectedPlayers) {
      availablePlayers.delete(player);
    }
  }

  return team;
}

function sortBySkillValue(players, requirement) {
  return [...players].sort((a, b) => {
    const skillA = a.playerSkills.find(skill => skill.skill === requirement.mainSkill)?.value;
    const skillB = b.playerSkills.find(skill => skill.skill === requirement.mainSkill)?.value;
    if (skillA === undefined || skillB === undefined) {
      const bestASkill = a.playerSkills.reduce((acc, skill) => skill?.value > acc?.value ? skill : acc);
      const bestBSkill = b.playerSkills.reduce((acc, skill) => skill?.value > acc?.value ? skill : acc);
      return bestBSkill.value - bestASkill.value;
    }
    return skillB - skillA;
  });
}