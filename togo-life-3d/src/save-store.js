/**
 * Browser persistence for serialized, versioned game data.
 * `validate(raw)` must return true only for a loadable save; use a fresh probe,
 * because a validator such as Simulation.load can mutate its own instance.
 * Each Web Storage setItem is atomic. Two keys are deliberately not presented
 * as a transaction: a failed primary write leaves the prior primary intact.
 */
function validSave(raw,validate) {
  if(typeof raw!=='string'||typeof validate!=='function')return false;
  try {return validate(raw)===true;} catch {return false;}
}

function readItem(storage,key) {
  try {return {raw:storage.getItem(key),available:true};}
  catch {return {raw:null,available:false};}
}

/** Read without repairing, deleting, or overwriting unknown/future saves. */
export function readSave(storage,key,validate) {
  const result={data:null,recovered:false,primaryInvalid:false};
  if(typeof key!=='string'||!key)return result;
  const primary=readItem(storage,key);
  if(primary.available&&primary.raw!=null) {
    if(validSave(primary.raw,validate))return {...result,data:primary.raw};
    result.primaryInvalid=true;
  }
  const backup=readItem(storage,key+':backup');
  if(backup.available&&validSave(backup.raw,validate)) {
    result.data=backup.raw;result.recovered=true;
  }
  return result;
}

/**
 * Preserve a known-good recovery point before committing the primary value.
 * A corrupt/future primary never replaces a valid backup. A first save seeds
 * both keys, so even its subsequent corruption has a loadable recovery point.
 * `data` is a JSON string; the injected validator owns schema and migration.
 */
export function writeSave(storage,key,data,validate) {
  if(typeof key!=='string'||!key)return {ok:false,reason:'invalid-key'};
  if(!validSave(data,validate))return {ok:false,reason:'invalid-data'};
  const primary=readItem(storage,key);
  if(!primary.available)return {ok:false,reason:'storage-unavailable'};
  const backupKey=key+':backup';
  let recoveryPoint;
  if(validSave(primary.raw,validate))recoveryPoint=primary.raw;
  else {
    const backup=readItem(storage,backupKey);
    if(!backup.available)return {ok:false,reason:'storage-unavailable'};
    if(!validSave(backup.raw,validate))recoveryPoint=data;
  }
  if(recoveryPoint!==undefined) {
    try {storage.setItem(backupKey,recoveryPoint);}
    catch {return {ok:false,reason:'backup-write-failed'};}
  }
  try {storage.setItem(key,data);return {ok:true};}
  catch {return {ok:false,reason:'primary-write-failed'};}
}
