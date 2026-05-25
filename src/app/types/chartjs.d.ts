import 'chart.js';
import { PidEvent } from 'redux/EventsSlice';

declare module 'chart.js' {

  interface PluginOptionsByType<TType> {

    relayMarkersPlugin?: {

      events: PidEvent[];

    } & {
      visible?: {
        HEAT: boolean;
        COOL: boolean;
      };
    };

  }
}