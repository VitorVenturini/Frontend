import React from 'react';
import CardNotificationSensor from './CardNotificationSensor';
import CardNotificationChat from './CardNotificationChat';
import CardNotificationAlarm from './CardNotificationAlarm';

export default function Notify() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <CardNotificationSensor />
      <CardNotificationChat />
      <div className="col-span-2">
        <CardNotificationAlarm />
      </div>
    </div>
  );
}
