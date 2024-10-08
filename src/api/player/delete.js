// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import Player from '../../db/model/player';
import isAuthorized from '../../hooks/context/authContext';

export default async (req, res) => { 
  if (!isAuthorized(req)) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const playerId = req.params;

  try {
    const player = await Player.findByPk(playerId.id);
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
    } else {
      await player.destroy();
      res.json({ message: 'Player deleted' });
    }
  } catch (error) {
    res.status(412).json({ message: error.message });
  }
}
