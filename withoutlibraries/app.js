const stdin = process.stdin;
const stdout = process.stdout;
const { ask } = require('./helpers');

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
  ask('What is your full name? ')
    .then((answer)=>{
      this.user.fullName = answer
      stdout.write('Hello, ' + this.user.fullName + '! Now we need your address. ');
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
      this.user.address = this.user.street + ' ' + this.user.city + ' ' + this.user.state + ' ' + this.user.zip;
      stdout.write(this.user.address)
    })
    .catch(err => console.log(err))
}

Agitator.prototype.civicUrlGenerator = function(levelsQuery, rolesQuery, addressQuery){
  return `/civicinfo/v2/representatives?levels=${levelsQuery}&roles=${rolesQuery}&address=${addressQuery}&key=YOUR_GOOGLE_API_KEY`;
}

const session = new Agitator();
session.getUserInfo();

