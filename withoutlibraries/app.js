const stdin = process.stdin;
const stdout = process.stdout;
const https = require('https');
const { ask, produceList } = require('./helpers');

const Agitator = function(){
  this.official = null;
  this.userMessage = null;
  this.fetchedOfficial = {};
  this.fetchStatus = false;
  this.user = {};
  this.titles = {
    'US House Representative': {role: 'legislatorLowerBody', level:'country'},
    'US Congress Representative': {role: 'legislatorUpperBody', level: 'country'},
    'State House Representative': {role: 'legislatorLowerBody', level:'administrativeArea1'},
    'State Congress Representative': {role: 'legislatorUpperBody', level: 'administrativeArea1'},
    Governor: {role: 'headOfGovernment', level: 'administrativeArea1' },
    President: {role:'headOfState', level: 'country' },
    }
  this.officialTitles = Object.keys(this.titles);
}

Agitator.prototype.getUserInfo = function(){
  return ask('What is your full name? ')
    .then((answer)=>{
      this.user.fullName = answer
      stdout.write('Hello, ' + this.user.fullName + '! Now we need your address.' + '\r\n');
      return ask('What is your street address? ');
    })
    .then((answer)=>{
      this.user.street = answer.replace(/\s/g, '');
      return ask('Please enter apt #. If you don\'t have one, press enter ');
    })
    .then((answer) => {
      this.user.apt = answer;
      return ask('What city do you live in? ');
    })
    .then((answer) => {
      this.user.city = answer;
      return ask('What is the abbreviation of your state? ');
    })
    .then((answer)=>{
      this.user.state = answer;
      return ask('What is your zipcode? ')
    })
    .then((answer) =>{
      this.user.zip = answer
      this.user.address = this.user.street + this.user.city + this.user.state + this.user.zip;
    })
    .catch(err => stdout.write(err))
}

Agitator.prototype.civicUrlGenerator = function(levelsQuery, rolesQuery, addressQuery){
  return `/civicinfo/v2/representatives?levels=${levelsQuery}&roles=${rolesQuery}&address=${addressQuery}&key=AIzaSyBkx1kMqxMYYRu03iJKsetRWSmHWODC9Ac`;
}

Agitator.prototype.chooseOfficial = function(){
 return ask('Please choose an official: '  + '\r\n' + produceList(this.officialTitles))
  .then((index) =>{
    this.official = this.officialTitles[index];
  })
  .catch(err => stdout.write(err))
}

Agitator.prototype.fetchOfficial = function(callback){
    let url = this.civicUrlGenerator(this.titles[this.official].level, this.titles[this.official].role, this.user.address)
    let body = "";
    return new Promise(function(resolve, reject){
      let request = https.get({
        host: 'www.googleapis.com',
        path: url,
        },
        function(response){
          response.on('data', function(data){
            body += data;
          })
          response.on('end', function(){
            body = JSON.parse(body);
            resolve(body);
          })
        })
      request.on('error', function(err){
          reject(err)
        })
    })
}

Agitator.prototype.getUserMessage = function(){
  return ask(`What would you like to say to your ${this.official}? `)
  .then((answer)=>{
    this.userMessage = answer;
  })
}

Agitator.prototype.produceLetter = function(){
  //TODO: https post request to Lob create letter endpoint
}

Agitator.prototype.init = function(){
  this.getUserInfo()
  .then(() => {
    return this.chooseOfficial();
  })
  .then(() => {
    return this.fetchOfficial();
  })
  .then((data) =>{
    this.fetchedOfficial.name = data.officials[0].name;
    this.fetchedOfficial.street = data.officials[0].address[0].line1;
    this.fetchedOfficial.city = data.officials[0].address[0].city;
    this.fetchedOfficial.state = data.officials[0].address[0].state;
    this.fetchedOfficial.zip = data.officials[0].address[0].zip;
    this.fetchStatus = true;
    stdout.write(`Your ${this.official} is ${this.fetchedOfficial.name}.` + '\r\n')
  })
  .then(()=>{
    if(this.fetchStatus){
      this.getUserMessage();
    } else {
      stdout.write('Try re-entering your information');
      let newSession = new Agitator;
      newSession.init();
    }
  })
  .then(()=>{
    return this.produceLetter()
    .catch(err => console.log(err))
  })
  .catch((err)=>{
    stdout.write(err)
  })
}


const session = new Agitator();
session.init();

