const covid_data_url_base = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/'
const douglas_county_code = '08035';
const checkInterval = 1000*60*15; // check every 15 minutes
let checkedAt;


let ready = function() {
  checkForUpdate();

  setInterval(() => {
    checkForUpdate();
  }, checkInterval);
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

  return {
    county: localData[1],
    state: localData[2],
    country: localData[3],
    lastUpdated: moment(localData[4]),
    confirmed: localData[7],
    deaths: localData[8],
    recovered: localData[9],
    active: localData[10]
  }
}

let displayInfo = (info) => {
  let countyEl = document.getElementById('county');
  let infoEl = document.getElementById('info');
  let lastUpdatedEl = document.getElementById('last-updated');
  let lastCheckedEl = document.getElementById('last-check');

  countyEl.innerText = info.county

  let table = document.createElement('table');
  table.innerHTML = `
    <tr>
      <th>Confirmed Cases</th>
      <th>Deaths</th>
    </tr>
    <tr>
      <td>${info.confirmed}</td>
      <td>${info.deaths}</td>
    </tr>
  `;

  infoEl.innerHTML = '';
  infoEl.append(table);

  lastUpdatedEl.innerText = `Latest update: ${info.lastUpdated.fromNow()}`;
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
