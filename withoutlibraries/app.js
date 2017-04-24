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
      stdout.write('Hello, ' + this.user.fullName + '! Now we need your address.');
      return ask('What is your street address? ');
    })
    .then((answer)=>{
      this.user.street = answer;
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
      this.user.address = this.user.city + this.user.state + this.user.zip;
    })
    .catch(err => stdout.write(err))
}

Agitator.prototype.civicUrlGenerator = function(levelsQuery, rolesQuery, addressQuery){
  return `/civicinfo/v2/representatives?levels=${levelsQuery}&roles=${rolesQuery}&address=${addressQuery}&key=YOUR_GOOGLE_API_KEY`;
}

Agitator.prototype.chooseOfficial = function(){
 return ask('Please choose an official: ' + produceList(this.officialTitles))
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





const session = new Agitator();
session.init();

