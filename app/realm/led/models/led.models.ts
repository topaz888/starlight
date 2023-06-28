import {Realm} from '@realm/react';
import { LedStaticModeMessage } from '../../../models/LedMessage';

export const LEDSTATICREALM = {
  name: 'LedRealm',
  properties:{
    ledId: 'string',
    modeId: 'string',
    mode:'string',
    cycle: 'string',
    delay: 'string',
    brightness: 'string',
  },
}

export const LEDSTATICLISTREALM = {
  name: 'LedListRealm',
  properties:{
    _id: 'objectId',
    modeId: 'string?',
    message: { type: 'list', objectType: 'LedRealm'},
    createdAt: 'date',
  },
  primaryKey: '_id',
}

export const LEDREALM = {
    name: 'LedRealm',
    properties:{
      ledId: 'string',
      modeId: 'string',
      mode:'string',
      cycle: 'string',
      delay: 'string',
      brightness: 'string',
      waitTime:'string',
      waitTimeLen:'string',
    },
  }
  
export const LEDLISTREALM = {
    name: 'LedListRealm',
    properties:{
      _id: 'objectId',
      modeId: 'string?',
      message: { type: 'list', objectType: 'LedRealm'},
      createdAt: 'date',
    },
    primaryKey: '_id',
  }


  export const PERSISTLEDREALM = {
    name: 'PersistLedRealm',
    properties:{
      id: 'string',
      cycle: 'string',
      delay: 'string',
      brightness: 'string',
    }
  }
  
export const PERSISTLEDLISTREALM = {
    name: 'PersistLedListRealm',
    properties:{
      _id: 'objectId',
      modeId: 'string?',
      message: { type: 'list', objectType: 'PersistLedRealm'},
      createdAt: 'date',
    },
    primaryKey: '_id',
  }