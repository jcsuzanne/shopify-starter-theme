'use strict';
import EventsEmitter from 'events';

class Channels extends EventsEmitter {}
const channels = new Channels();

export default channels;
