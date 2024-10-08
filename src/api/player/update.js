// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import Player from '../../db/model/player';
import PlayerSkill from '../../db/model/playerSkill';
import { playerValidation } from '../../utils/validations';

export default async (req, res) => {
  const playerId = req.params;
  const newPlayer = req.body;

  const message = playerValidation(newPlayer);
  if (message !== null) {
    res.status(400).json({ message: message });
    return;
  }
  
  try {
    const player = await Player.findByPk(playerId.id);
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
    } else {
      await player.update(newPlayer);
      await PlayerSkill.destroy({ where: { playerId: playerId.id } });
      await PlayerSkill.bulkCreate(newPlayer.playerSkills.map(skill => ({ ...skill, playerId: playerId.id })));
      // return updated player
      const updatedPlayer = await Player.findByPk(playerId.id, {
        include: [PlayerSkill]
      });
      res.json(updatedPlayer);
    }
  } catch (error) {
    res.status(412).json({ message: error.message });
  }
}
