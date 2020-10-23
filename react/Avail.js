import React from "react";

export default function Avail({availobj}) {
  return (
      <div>
          <label>
              {availobj.day + ' '}
              {tonormtime(availobj.start) + ' - '}
              {tonormtime(availobj.end) + ' '}
          </label>
      </div>
  )
}

function tonormtime(mil) {
    var smil = '00' + mil.toString();
    var hour = parseInt(smil.substring(0, smil.length - 2));
    var ispm = hour >= 12;
    if (ispm) hour -= 12;
    if (hour == 0) hour = 12;
    var min = smil.substring(smil.length - 2, smil.length);
    if (min.length < 2) min = '0' + min;
    return `${hour}:${min}${ispm ? 'pm' : 'am'}`;
}

export {tonormtime};