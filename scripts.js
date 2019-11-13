const API_URL = 'https://apis.is/company?name=';
const error = [
  'Lén verður að vera strengur',
  'Villa við að sækja gögn',
  'Ekkert fyrirtæki fannst fyrir leitarstreng'];

const formBtn = document.querySelector("form");
const resultSet = document.querySelector(".results");
const nafn = "Nafn";

formBtn.onsubmit = function (evt) {
  evt.preventDefault();
  //Clear previous data
  resultSet.innerHTML = '';
  var company = document.querySelector('input').value;
  if (company == "") {
    errorHandler(0);
    return;
  }
  loading();

  var ourRequest = new XMLHttpRequest();
  ourRequest.open('GET', API_URL + company, true);
  ourRequest.onload = function () {
    if (ourRequest.status >= 200 && ourRequest.status < 400) {
      var ourData = JSON.parse(ourRequest.responseText);
      ourData = ourData.results; //simplify for later calls

      resultSet.innerHTML = '';
      preRender(ourData);
      if (ourData.length === 0) {
        resultSet.innerHTML = '';
        errorHandler(2);
        return;
      }
    } else {
      console.log("We connected to the server, but it returned an error.");
      errorHandler(1);
    }

  };

  ourRequest.onerror = function () {
    console.log("Connection error");
    resultSet.innerHTML = '';
    errorHandler(1);

  };

  ourRequest.send();
}

function preRender(data) {
  //show all active companies first, then all inactive companies
  for (i = 0; i < data.length; i++) {
    if (data[i].active === 1)
      renderHTML(data[i], true);
  }
  for (i = 0; i < data.length; i++) {
    if (data[i].active === 0)
      renderHTML(data[i], false);
  }
}

function renderHTML(data, status) {
  var infobox = document.createElement("div");

  infobox.className = ((status) ? "company company--active" : "company company--inactive");
  var list = document.createElement("dl");
  for (var i in data)
    console.log(i + ":\t" + data[i]);
  console.log("\n");

  //Create Nafn element
  var nafn = document.createTextNode("Nafn");
  var nafndt = document.createElement("dt");
  nafndt.appendChild(nafn);
  list.appendChild(nafndt);
  //   }
  //Create company name elemnt
  var name = document.createTextNode(data.name);
  var namedd = document.createElement("dd");
  namedd.appendChild(name);
  list.appendChild(namedd);
  //Create "Kennitala" element
  var kt = document.createTextNode("Kennitala");
  var ktdt = document.createElement("dt");
  ktdt.appendChild(kt);
  list.appendChild(ktdt);
  //Create kt number element
  var ktno = document.createTextNode(data.sn);
  var ktdd = document.createElement("dd");
  ktdd.appendChild(ktno);
  list.appendChild(ktdd);
  if (status) {
    //Create Heimilisfang element
    var hmf = document.createTextNode("Heimilisfang");
    var hmfdt = document.createElement("dt");
    hmfdt.appendChild(hmf);
    list.appendChild(hmfdt);
    //Create address element
    var address = document.createTextNode(data.address);
    var addressdd = document.createElement("dd");
    addressdd.appendChild(address);
    list.appendChild(addressdd);
  }
  infobox.appendChild(list);
  resultSet.appendChild(infobox);
  return;
}

function errorHandler(err) {
  //err is error-index for the array "error" defined on top
  var errorP = document.createElement("p");
  var errormsg = document.createTextNode(error[err])
  errorP.appendChild(errormsg);
  resultSet.appendChild(errorP);
}

function loading() {
  //Create div wrapper with class="loading"
  const loading = 'Leita að fyrirtækjum...';
  var loadDiv = document.createElement("div");
  loadDiv.className = "loading";
  //push loading-gif into wrapper
  var gif = document.createElement("img");
  gif.src = "/loading.gif";
  loadDiv.appendChild(gif);
  //pus message into wrapper
  var errorP = document.createElement("p");
  var errormsg = document.createTextNode(loading);
  errorP.appendChild(errormsg);
  loadDiv.appendChild(errorP);

  resultSet.appendChild(loadDiv);
}