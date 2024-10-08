// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import Player from '../../db/model/player';
import PlayerSkill from '../../db/model/playerSkill';
import { playerValidation } from '../../utils/validations';

export default async (req, res) => {
  const player = req.body;
  const message = playerValidation(player);
  if (message !== null) {
    res.status(400).json({ message: message });
    return;
  }
  
  try {
    const result = await Player.create(player, {
      include: [PlayerSkill]
    });
    
    res.json(result);
  } catch (error) {
    res.status(412).json({ message: error.message });
  }
};