import {createRealmContext} from '@realm/react';
import Realm, { BSON } from 'realm';
import { LEDLISTREALM, LEDREALM, PERSISTLEDLISTREALM, PERSISTLEDREALM } from './models/led.models';

const PERSON_SCHEMA = {
  name: 'person_schema',
  properties: {
    id: 'int?',
    data: {type: 'list', objectType: 'person_schema_data'},
  },
  primaryKey: 'id',
};

const PERSON_SCHEMA_DATA = {
  name: 'person_schema_data',
  properties: {
    name: 'string?',
    age: 'int?',
    favorites: {type: 'object', objectType: 'person_favorites'},
  },
};

const PERSON_SCHEMA_FAVORITES = {
  name: 'person_favorites',
  properties: {
    food: {type: 'list', objectType: 'string'},
    game: {type: 'list', objectType: 'string'},
    color: {type: 'list', objectType: 'string'},
  },
};


const LedRealmContext = ({
  name: "Led",
  path: 'realmLed.realm',
  schema: [LEDREALM, LEDLISTREALM],
  schemaVersion: 1,
});

export const realm = Realm.open(LedRealmContext);