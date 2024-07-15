
interface KDPersistentNPC {
	Name: string,
	id: number,
	entity: entity,
	mapX: number, mapY: number,
	room: string,
	captured: boolean,
	collect: boolean,
	opinion: number,
}

interface WorldCoord {
	mapX: number,
	mapY: number,
	room: string,
}

let KDPersistentNPCs: {[_ : string]: KDPersistentNPC} = {};

/**
 * Syncs a persistent NPC with the world entity, if present
 */
function KDUpdatePersistentNPC(id: number) {
	if (KDPersistentNPCs[id]) {
		let enemy = KinkyDungeonFindID(id);
		if (enemy) {
			let entry = KDPersistentNPCs[id];
			entry.entity = enemy;

			KDSetNPCLocation(id, KDGetCurrentLocation());
		}
	}
}

/**
 * Syncs a persistent NPC with the world entity, in reverse, updating the entity from the persistent one
 */
function KDRefreshPersistentNPC(id: number) {
	if (KDPersistentNPCs[id]) {
		let enemy = KinkyDungeonFindID(id);
		if (enemy) {
			let entry = KDPersistentNPCs[id];
			KDMapData.Entities[KDMapData.Entities.indexOf(enemy)] = entry.entity;
		}
	}
}

function KDIsNPCPersistent(id: number): boolean {
	return KDPersistentNPCs[id] != undefined;
}

function KDGetPersistentNPC(id: number): KDPersistentNPC {
	if (!KDPersistentNPCs[id]) {

		let enemy = KinkyDungeonFindID(id);
		if (enemy) {
			let entry = {
				Name: enemy.CustomName || KDGetEnemyName(enemy),
				id: enemy.id,
				entity: enemy,
				mapX: KDCurrentWorldSlot.x,
				mapY: KDCurrentWorldSlot.y,
				room: KDGameData.RoomType,
				collect: false,
				captured: false,
				opinion: enemy.opinion || 0,
			};
			KDPersistentNPCs[enemy.id] = entry;
		}
	}
	KDUpdatePersistentNPC(id);
	return KDPersistentNPCs[id];
}

function KDGetCurrentLocation(): WorldCoord {
	return {
			mapX: KDCurrentWorldSlot.x,
			mapY: KDCurrentWorldSlot.y,
			room: KDGameData.RoomType,
		};
}
function KDGetNPCLocation(id: number): WorldCoord {
	let npc = KDPersistentNPCs[id];
	if (npc) {
		return {
			mapX: npc.mapX,
			mapY: npc.mapY,
			room: npc.room,
		};
	}
	return undefined;
}
function KDSetNPCLocation(id: number, coord: WorldCoord): boolean {
	let npc = KDPersistentNPCs[id];
	if (npc) {
		let altered = false;
		if (npc.mapX != coord.mapX) {
			altered = true;
			npc.mapX = coord.mapX;
		}
		if (npc.mapY != coord.mapY) {
			altered = true;
			npc.mapY = coord.mapY;
		}
		if (npc.room != coord.room) {
			altered = true;
			npc.room = coord.room;
		}
		return altered;
	}
	return false;
}