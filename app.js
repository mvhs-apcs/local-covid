const covid_data_url_base = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/'
const douglas_county_code = '08035';
const checkInterval = 1000*60*15; // check every 15 minutes
const timeUpdateInterval = 1000*10; // every 10 seconds
let checkedAt;
let lastUpdatedAt;

var county2_name = window.prompt("Enter your county name").toLowerCase();
var state2_name = window.prompt("Enter your state name").toLowerCase();

let ready = function() {
  checkForUpdate();

  setInterval(() => {
    checkForUpdate();
  }, checkInterval);

  setInterval(() => {
    updateTimes();
  }, timeUpdateInterval);
}

let checkForUpdate = () => {
  let date = new Date();
  checkedAt = moment(date);
  loadData(date)
    .then(info => {
      displayInfo(info);
    });
}

let loadData = async (date) => {
  try {
    let res = await fetch(`${covid_data_url_base}${formatDate(date)}.csv`)
    if (res && res.status === 404) { // no update yet today
      console.log("A");
      let yesterday = new Date();
      yesterday.setDate(date.getDate() - 1);
      return loadData(yesterday);
    }

    let data = await res.text();
    return parseData(data);
  } catch(err) {
    console.log("err");
    let yesterday = new Date();
    yesterday.setDate(date.getDate() - 1);
    return loadData(yesterday);
  }
}

let parseData = (text) => {
  let localData = text.split('\n')
                    .filter(line => line.startsWith(douglas_county_code))[0]
                    .split(',');

  let localData2 = text.split('\n')
                    .filter(line => line.toLowerCase().includes(county2_name) && line.toLowerCase().includes(state2_name))[0]
                    .split(',');

  return {
    county: localData[1],
    state: localData[2],
    country: localData[3],
    lastUpdated: moment(localData[4]),
    confirmed: localData[7],
    deaths: localData[8],
    recovered: localData[9],
    active: localData[10],

    county2: localData2[1],
    state2: localData2[2],
    country2: localData2[3],
    lastUpdated2: moment(localData2[4]),
    confirmed2: localData2[7],
    deaths2: localData2[8],
    recovered2: localData2[9],
    active2: localData2[10]
  }
}

let displayInfo = (info) => {
  //let countyEl = document.getElementById('county');
  let infoEl = document.getElementById('info');

  //countyEl.innerText = info.county;

  let table = document.createElement('table');
  table.innerHTML = `
    <tr>
      <th>Confirmed Cases</th>
      <th>Deaths</th>
      <th>County</th>
      <th>State</th>
    </tr>
    <tr>
      <td>${info.confirmed}</td>
      <td>${info.deaths}</td>
      <td>${info.county}</td>
      <td>${info.state}</td>
    </tr>
    <tr>
      <td>${info.confirmed2}</td>
      <td>${info.deaths2}</td>
      <td>${info.county2}</td>
      <td>${info.state2}</td>
    </tr>
  `;

  infoEl.innerHTML = '';
  infoEl.append(table);

  lastUpdatedAt = info.lastUpdated;
  updateTimes();
}

let updateTimes = () => {
  let lastUpdatedEl = document.getElementById('last-updated');
  let lastCheckedEl = document.getElementById('last-check');

  lastUpdatedEl.innerText = `Latest update: ${lastUpdatedAt.fromNow()}`;
  lastCheckedEl.innerText = `Last checked:  ${checkedAt.fromNow()}`;
}

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  console.log(d);

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [month, day, year].join('-');
}

document.addEventListener('DOMContentLoaded', ready);
