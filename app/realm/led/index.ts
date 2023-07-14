import {createRealmContext} from '@realm/react';
import Realm, { BSON } from 'realm';
import { LEDLISTREALM, LEDREALM, PERSISTLEDARRAYREALM, PERSISTLEDLISTREALM, PERSISTLEDREALM } from './models/led.models';


export const LedRealmContext = ({
  name: "Led",
  path: 'realmLed.realm',
  schema: [LEDREALM, LEDLISTREALM, PERSISTLEDREALM, PERSISTLEDARRAYREALM, PERSISTLEDLISTREALM],
  schemaVersion: 1,
});
