export const PLAYER_REQUIRED_FIELDS = Object.freeze([
    { field: 'name', message: 'Name is required' },
    { field: 'position', message: 'Position is required' },
]);

export const PLAYER_SKILL_REQUIRED_FIELDS = Object.freeze([
    { field: 'skill', message: 'Skill is required for skill #' },
    { field: 'value', message: 'Value is required for skill #' },
]);

export const POSITIONS = Object.freeze({
    DEFENDER: 'defender',
    MIDFIELDER: 'midfielder',
    FORWARD: 'forward',
});

export const SKILLS = Object.freeze({
    DEFENSE: 'defense',
    ATTACK: 'attack',
    SPEED: 'speed',
    STRENGTH: 'strength',
    STAMINA: 'stamina',
});