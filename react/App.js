import React, { useState } from "react";
import AvailList from "./AvailList";
import TimeSet from "./TimeSet";
import { tonormtime } from "./Avail.js";

const phpdir = "http://localhost/~{{username}}/c2c_homework/";
export { phpdir };

var coachlist = [];

function App() {
  const [avails, setavails] = useState([]);
  //const coachlist = getallcoaches();
  //postData("https://p0lfjhbqci.execute-api.us-west-2.amazonaws.com/Homework/c2c-homework-assignment/coaches").then(data => alert(data));
  //getallcoachesscheduletest().then(a => alert(JSON.stringify(a)));
  //ajax.get(`${phpdir}/getcoaches.php`, {}, a => alert(a));
  //alert(JSON.stringify(coachlist));

  if (coachlist.length == 0) {
    refreshcoaches(avails, setavails);
  }

  return (
    <div class="center">
      <p>Choose a coach </p>
      <select id="selector" onChange={(e) => coachselected(e.target.value, setavails)}>
        <option value="null">none</option>
        {coachlist.map((o) => (
          <option value={o.id}>{`${o.firstName} ${o.lastName}`}</option>
        ))}
      </select>
      <div id="schedule" hidden="true">
        <h1>Availabilities</h1>
        <AvailList avails={avails} />
        <h1>Reserve</h1>
        <TimeSet avails={avails} setavails={() => refreshcoaches(avails, setavails)} />
        <h1>Appointments</h1>
        <div id="appointments">
          {getappointments().map((a) => {
            return (
              <>
              <label id={a.id}>
                {`${a.firstname} ${a.lastname} ${tonormtime(
                  a.start
                )}-${tonormtime(a.end)} `}
                <button
                  onClick={(e) => {
                    cancelappointment(e, a.coachid, a.id, setavails);
                  }}
                >
                  Cancel
                </button>
              </label>
              <br/>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function refreshcoaches(avails, setavails) {
  coachlist.length = 0;
  refreshjson(avails, setavails);
}

function refreshjson(avails, setavails) {
  var opts = {
    method: "GET",
    headers: {},
    //mode: 'no-cors',
  };
  fetch(`${phpdir}/getcoaches.php`, opts)
    .then(function (response) {
      return response.json();
    })
    .then(function (body) {
      //alert(JSON.stringify(body));
      rawjson = body;
      var clwaszero = coachlist.length == 0;
      coachlist = getallcoaches();
      if (clwaszero) {
        setavails(avails.length > 0 ? [] : [{}]);
      } else setavails([]);
    })
    .catch(function (err) {
      alert(err);
    });
}

function cancelappointment(e, coachid, id, setavails) {
  document.getElementById(id).hidden = true;
  var opts = {
    method: "GET",
    headers: {},
  };
  fetch(`${phpdir}/delsch.php?coachid=${coachid}&schid=${id}`, opts)
    .then(function (response) {
      return response.json();
    })
    .then(function (body) {})
    .catch(function (err) {
      //alert(err);
    });
}

function getappointments() {
  var allsch = getallcoachesschedule().records.schedules;
  var schs = allsch;
  var result = schs.map((sub) =>
    sub.appointments.map((a) => ({
      coachid: sub.id,
      id: a.scheduleId,
      firstname: sub.firstName,
      lastname: sub.lastName,
      day: a.dayOfTheWeek,
      start: a.startTime,
      end: a.endTime,
    }))
  );
  return flatten(result);
}

function coachselected(id, setavails) {
  document.getElementById("schedule").hidden = false;
  setavails(getavailsbycoach(id));
}

function getavailsbycoach(id) {
  var allsch = getallcoachesschedule().records.schedules;
  var schs = allsch.filter((sch) => sch.id === id);
  var result = schs.map((sub) =>
    sub.availability.map((sch) =>
      sch.available.map((a) => ({
        id: id,
        firstname: sub.firstName,
        lastname: sub.lastName,
        day: sch.dayOfTheWeek,
        start: a.start,
        end: a.end,
      }))
    )
  );
  return flatten(result);
}

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
    );
  }, []);
}

function getallcoaches() {
  var schedules = getallcoachesschedule().records.schedules;
  var result = schedules.map((sch) => ({
    firstName: sch.firstName,
    lastName: sch.lastName,
    id: sch.id,
  }));
  return getuniqueobjs(result);
}

function getuniqueobjs(arr) {
  return arr.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
}
/*
function getallcoachesscheduletest(f) {
    var elements = document.getElementsByClassName("formVal");
    var formData = new FormData(); 
    for(var i=0; i<elements.length; i++)
    {
        formData.append(elements[i].name, elements[i].value);
    }
    var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function()
        {
            if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
            {
                alert(xmlHttp.responseText);
            }
        }
        xmlHttp.open("get", "https://p0lfjhbqci.execute-api.us-west-2.amazonaws.com/Homework/c2c-homework-assignment/coaches"); 
        xmlHttp.setRequestHeader('x-api-key', 'pgVX9UJnUT5UV9w5GJ9vx1SwND261yx75a5Fq0XK');
        xmlHttp.setRequestHeader('candidateId', '1f20f580-361e-474e-9d62-03aaf8416c27');
        xmlHttp.send(formData); 
}
*/

/*
async function getallcoachesscheduletest() {
  const response = await fetch(`${phpdir}/getcoaches.php`, {
    method: 'POST',
    mode: 'no-cors',
  });
  alert(response);
  alert(JSON.stringify(response));
  return response;
}
*/

/*
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'no-cors', // no-cors, *cors, same-origin
    //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'x-api-key': 'pgVX9UJnUT5UV9w5GJ9vx1SwND261yx75a5Fq0XK',
      'candidateId': '1f20f580-361e-474e-9d62-03aaf8416c27',      
    },
    //redirect: 'follow', // manual, *follow, error
    //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
*/

/*
function getallcoachesschedule() {
  return {
    success: true / false,
    statusCode: 0,
    body: {
      error: {
        msg: "only when error happens",
      },
    },
    records: {
      candidateId: "uuid",
      schedules: [
        {
          id: "uuid",
          firstName: "john",
          lastName: "dow",
          availability: [
            {
              dayOfTheWeek: "Monday",
              abbreviation: "M",
              available: [
                {
                  start: "0900",
                  end: "1700",
                },
              ],
            },
          ],
          appointments: [
            {
              firstName: "patient",
              lastName: "zero",
              dayOfTheWeek: "Tuesday",
              abbreviation: "T",
              startTime: "11:15",
              endTime: "11:45",
            },
          ],
        },
        {
          id: "uuid2",
          firstName: "john",
          lastName: "bobbins",
          availability: [
            {
              dayOfTheWeek: "Monday",
              abbreviation: "M",
              available: [
                {
                  start: "0900",
                  end: "1700",
                },
              ],
            },
          ],
          appointments: [
            {
              firstName: "patient",
              lastName: "zero",
              dayOfTheWeek: "Tuesday",
              abbreviation: "T",
              startTime: "11:15",
              endTime: "11:45",
            },
          ],
        },
      ],
    },
  };
}
*/

var rawjson = {
  success: true / false,
  statusCode: 0,
  body: {
    error: {
      msg: "only when error happens",
    },
  },
  records: {
    candidateId: "uuid",
    schedules: [
      {
        id: "uuid",
        firstName: "john",
        lastName: "dow",
        availability: [
          {
            dayOfTheWeek: "Monday",
            abbreviation: "M",
            available: [
              {
                start: "0900",
                end: "1700",
              },
            ],
          },
        ],
        appointments: [
          {
            firstName: "patient",
            lastName: "zero",
            dayOfTheWeek: "Tuesday",
            abbreviation: "T",
            startTime: "11:15",
            endTime: "11:45",
          },
        ],
      },
      {
        id: "uuid2",
        firstName: "john",
        lastName: "bobbins",
        availability: [
          {
            dayOfTheWeek: "Monday",
            abbreviation: "M",
            available: [
              {
                start: "0900",
                end: "1700",
              },
            ],
          },
        ],
        appointments: [
          {
            firstName: "patient",
            lastName: "zero",
            dayOfTheWeek: "Tuesday",
            abbreviation: "T",
            startTime: "11:15",
            endTime: "11:45",
          },
        ],
      },
    ],
  },
};

function getallcoachesschedule() {
  return rawjson;
}

/*
var ajax = {};
ajax.x = function () {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
    }
    var versions = [
        "MSXML2.XmlHttp.6.0",
        "MSXML2.XmlHttp.5.0",
        "MSXML2.XmlHttp.4.0",
        "MSXML2.XmlHttp.3.0",
        "MSXML2.XmlHttp.2.0",
        "Microsoft.XmlHttp"
    ];

    var xhr;
    for (var i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch (e) {
        }
    }
    return xhr;
};

ajax.send = function (url, callback, method, data, async) {
    if (async === undefined) {
        async = true;
    }
    var x = ajax.x();
    x.open(method, url, async);
    x.onreadystatechange = function () {
        if (x.readyState == 4) {
            callback(x.responseText)
        }
    };
    if (method == 'POST') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    x.send(data)
};

ajax.get = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
};

ajax.post = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url, callback, 'POST', query.join('&'), async)
};
*/

export default App;
