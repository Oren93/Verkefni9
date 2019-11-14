const API_URL = 'https://apis.is/company?name=';
const error = [
  'Lén verður að vera strengur',
  'Villa við að sækja gögn',
  'Ekkert fyrirtæki fannst fyrir leitarstreng'
];

const formBtn = document.querySelector('form');
const resultSet = document.querySelector('.results');

formBtn.onsubmit = function submit(evt) {
  const ourRequest = new XMLHttpRequest();
  let ourData;

  const company = document.querySelector('input').value;
  evt.preventDefault();
  // Clear previous datanpx install-peerdeps --dev eslint-config-airbnb
  resultSet.innerHTML = '';
  if (company === '') {
    errorHandler(0);
    return;
  }
  loading();
  ourRequest.open('GET', API_URL + company, true);
  ourRequest.onload = function load() {
    if (ourRequest.status >= 200 && ourRequest.status < 400) {
      ourData = JSON.parse(ourRequest.responseText);
      ourData = ourData.results; // simplify for later calls

      resultSet.innerHTML = '';
      preRender(ourData);
      if (ourData.length === 0) {
        errorHandler(2);
      }
    } else {
      console.log('We connected to the server, but it returned an error.');
      errorHandler(1);
    }
  };

  ourRequest.onerror = function connError() {
    console.log('Connection error');
    resultSet.innerHTML = '';
    errorHandler(1);
  };

  ourRequest.send();
};

function preRender(data) {
  let i;
  // Show all active companies first, then all inactive companies
  for (i = 0; i < data.length; i += 1) {
    if (data[i].active === 1) {
      renderHTML(data[i], true);
    }
  }
  for (i = 0; i < data.length; i += 1) {
    if (data[i].active === 0) {
      renderHTML(data[i], false);
    }
  }
}

function renderHTML(data, status) {
  const infobox = document.createElement('div');
  let elem;
  let elemdt;
  let elemdd;
  const list = document.createElement('dl');

  infobox.className = status
    ? 'company company--active'
    : 'company company--inactive';
  ;
  
  for (var i in data) console.log(i + ':\t' + data[i]);
  console.log('\n');

  // Create Nafn element
  elem = document.createTextNode('Nafn');
  elemdt = document.createElement('dt');
  elemdt.appendChild(elem);
  list.appendChild(elemdt);
  // Create company name elemnt
  elem = document.createTextNode(data.name);
  elemdd = document.createElement('dd');
  elemdd.appendChild(elem);
  list.appendChild(elemdd);
  // Create 'Kennitala' element
  elem = document.createTextNode('Kennitala');
  elemdt = document.createElement('dt');
  elemdt.appendChild(elem);
  list.appendChild(elemdt);
  // Create kt number element
  elem = document.createTextNode(data.sn);
  elemdd = document.createElement('dd');
  elemdd.appendChild(elem);
  list.appendChild(elemdd);
  if (status) {
    // Create Heimilisfang element
    elem = document.createTextNode('Heimilisfang');
    elemdt = document.createElement('dt');
    elemdt.appendChild(elem);
    list.appendChild(elemdt);
    // Create address element
    elem = document.createTextNode(data.address);
    elemdd = document.createElement('dd');
    elemdd.appendChild(elem);
    list.appendChild(elemdd);
  }
  infobox.appendChild(list);
  resultSet.appendChild(infobox);
}

function errorHandler(err) {
  const errorP = document.createElement('p');;
  const errormsg = document.createTextNode(error[err]);;
  // err is error-index for the array 'error' defined on top
  errorP.appendChild(errormsg);
  resultSet.appendChild(errorP);
}

function loading() {
  // Define variables on top. Create div wrapper with class='loading'
  const loadingmsg = 'Leita að fyrirtækjum...';
  const loadDiv = document.createElement('div');
  const errorP = document.createElement('p');
  const errormsg = document.createTextNode(loadingmsg);
  const gif = document.createElement('img');
  loadDiv.className = 'loading';
  // push loading-gif into wrapper
  gif.src = 'loading.gif';
  loadDiv.appendChild(gif);
  // pus message into wrapper
  errorP.appendChild(errormsg);
  loadDiv.appendChild(errorP);

  resultSet.appendChild(loadDiv);
}
