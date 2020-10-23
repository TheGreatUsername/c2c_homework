import React from "react";
import {phpdir} from "./App";

export default function TimeSet({ avails, setavails}) {
  var hours = [];
  for (var i = 0; i < 12; i++) hours.push(i);
  var minutes = [0, 15, 30, 45];
  return (
    <div>
      <label>
        <select id='day'>
          {getavaildays(avails).map((day) => (
            <option value={day}>{day}</option>
          ))}
        </select>
        <select id='starthour'>
            {hours.map(h => <option value={h * 100}>{h == 0 ? 12 : h}</option>)}
        </select>
        <select id='startmin'>
            {minutes.map(m => <option value={m}>{m == 0 ? '00' : m}</option>)}
        </select>
        <select id='startampm'>
            <option value='pm'>pm</option>
            <option value='am'>am</option>
        </select>
        {' to '}
        <select id='endhour'>
            {hours.map(h => <option value={h * 100}>{h == 0 ? 12 : h}</option>)}
        </select>
        <select id='endmin'>
            {minutes.map(m => <option value={m}>{m == 0 ? '00' : m}</option>)}
        </select>
        <select id='endampm'>
            <option value='pm'>pm</option>
            <option value='am'>am</option>
        </select>
        {' '}
        <button onClick={() => reservetime(avails, setavails)}>reserve</button>
      </label>
    </div>
  );
}

function reservetime(avails, setavails) {
    var starthour = parseInt(document.getElementById('starthour').value);
    var startmin = parseInt(document.getElementById('startmin').value);
    var starttime = starthour + startmin;
    if (document.getElementById('startampm').value == 'pm') starttime += 1200;
    
    var endhour = parseInt(document.getElementById('endhour').value);
    var endmin = parseInt(document.getElementById('endmin').value);
    var endtime = endhour + endmin;
    if (document.getElementById('endampm').value == 'pm') endtime += 1200;

    var day = document.getElementById('day').value;

    if (endtime <= starttime) {
        alert('End time must be after start time.')
        return;
    }

    var av = avails.filter(d => d.day == day);
    var validfound = false;
    for (var i = 0; i < av.length; i++) {
        var a = av[i];
        if (parseInt(a.start) <= starttime && parseInt(a.end) >= endtime) {
            validfound = true;
            break;
        }
    }

    if (!validfound) {
        alert("Selected time doesn't fit in coach's schedule.");
        return;
    }

    var opts = {
        method: "GET",
        headers: {},
      };
      fetch(`${phpdir}/setsch.php?id=${av[0].id}&firstname=${av[0].firstname}&lastname=${av[0].lastname}&day=${day}&start=${starttime}&end=${endtime}`, opts)
      .then(function (response) {
        return response.json();
      })
      .then(function (body) {
        document.getElementById("selector").value = "null";
        setavails();
        //document.getElementById("apppointments")
        //alert(body);
      })
      .catch(function (err) {
        //alert(err);
      });
}

function getavaildays(avails) {
  return getuniquestrs(flatten(avails.map((a) => a.day)));
}

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
    );
  }, []);
}

function getuniquestrs(array) {
    return [...new Set(array)]
}

function formathour(mil) {
    var smil = '00' + mil.toString();
    var hour = parseInt(smil.substring(0, smil.length - 2));
    var ispm = hour >= 12;
    if (ispm) hour -= 12;
    if (hour == 0) hour = 12;
    return hour + (ispm ? 'pm' : 'am');
}
