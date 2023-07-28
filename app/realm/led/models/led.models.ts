export const LEDARRAYREALM = {
    name: 'LedArrayRealm',
    properties:{
      ledId: 'string',
      modeId: 'string',
      mode:'string',
      cycle: 'string',
      cycle2: 'string?',
      delay: 'string?',
      brightness: 'string',
      waitTime:'string?',
      waitTimeLen:'string?',
    },
  }

  export const LEDREALM = {
    name: 'LedRealm',
    properties:{
      modeId: 'string',
      cycle: 'string?',
      brightness: 'string',
    }
  }
  
export const LEDLISTREALM = {
    name: 'LedListRealm',
    properties:{
      _id: 'objectId',
      modeId: 'string?',
      message: { type: 'list', objectType: 'LedArrayRealm'},
      BrightAndCycle: {type: 'LedRealm'},
      createdAt: 'date',
    },
    primaryKey: '_id',
  }


  export const PERSISTLEDREALM = {
    name: 'PersistLedRealm',
    properties:{
      modeId: 'string',
      cycle: 'string?',
      brightness: 'string',
    }
  }

  export const PERSISTLEDARRAYREALM = {
    name: 'PersistLedArrayRealm',
    properties:{
      modeId: 'string',
      cycle: { type: 'string?[]' },
      cycle2: { type: 'string?[]' },
      brightness: { type: 'string?[]'},
    }
  }
  
export const PERSISTLEDLISTREALM = {
    name: 'PersistLedListRealm',
    properties:{
      _id: 'objectId',
      modeId: 'string?',
      message: { type: 'PersistLedRealm'},
      ledArray: {type: 'PersistLedArrayRealm?'},
      default: 'bool',
      createdAt: 'date',
    },
    primaryKey: '_id',
  }