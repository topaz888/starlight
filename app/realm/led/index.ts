import {createRealmContext} from '@realm/react';
import Realm, { BSON } from 'realm';
import { LEDLISTREALM, LEDARRAYREALM, PERSISTLEDARRAYREALM, PERSISTLEDLISTREALM, PERSISTLEDREALM, LEDREALM } from './models/led.models';


export const LedRealmContext = ({
  name: "Led",
  path: 'realmLed.realm',
  schema: [LEDARRAYREALM, LEDLISTREALM, LEDREALM, PERSISTLEDREALM, PERSISTLEDARRAYREALM, PERSISTLEDLISTREALM],
  schemaVersion: 1,
});
