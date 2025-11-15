/**
 * Location Parser Utility
 * Single Responsibility: Parse location strings
 */

/**
 * Parse location string to extract floor and room information
 * Example: "25\\BESANCON\\Siege\\VIOTTE\\1er etage\\105"
 * @param {string} location - Location string
 * @returns {Object} Parsed location with floor and room
 */
function parseLocation(location) {
    if (!location) {
        return { floor: null, room: null, fullPath: null };
    }

    const parts = location.split('\\');
    const floor = parts.length >= 5 ? parts[4] : null;
    const room = parts.length >= 6 ? parts[5] : null;

    return {
        floor: floor,
        room: room,
        fullPath: location,
        building: parts.length >= 4 ? parts[3] : null,
        site: parts.length >= 3 ? parts[2] : null,
        city: parts.length >= 2 ? parts[1] : null
    };
}

module.exports = { parseLocation };
