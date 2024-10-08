// ---------------------------------------------------------------------------------------------
// YOU CAN MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// YOU SHOULD NOT CHANGE THE EXPORTED VALUE OF THIS FILE
// ---------------------------------------------------------------------------------------------

import Sequelize from 'sequelize';
import database from '../index';
import PlayerSkill from './playerSkill';

const Player = database.define('player', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(200),
    },
    position: {
        type: Sequelize.STRING(200),
    }
}, {
    timestamps: false
})

Player.PlayerSkill = Player.hasMany(PlayerSkill);

export default Player;
