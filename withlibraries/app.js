const prompt = require('readline-sync')
const axios = require('axios')
const Lob = require('lob')('YOUR_LOB_API_KEY');

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
  this.user.fullName = prompt.question('What is your full name? ');
  console.log('Hello, ' + this.user.fullName + '! Now we need your address. ');
  this.user.street = prompt.question('What is your street address? ');
  this.user.apt = prompt.question('Please enter apt #. If you don\'t have one, press enter ');
  this.user.city = prompt.question('What city do you live in? ');
  this.user.state = prompt.question('What is the abbreviation of your state? ');
  this.user.zip = prompt.question('What is your zipcode? ');
  this.user.address = this.user.street + ' ' + this.user.city + ' ' + this.user.state + ' ' + this.user.zip;
}

Agitator.prototype.chooseOfficial = function(){
  index = prompt.keyInSelect(this.officialTitles, 'Which official? ')
  this.official = this.officialTitles[index]
}

Agitator.prototype.civicUrlGenerator = function(levelsQuery, rolesQuery, addressQuery){
  return `https://www.googleapis.com/civicinfo/v2/representatives?levels=${levelsQuery}&roles=${rolesQuery}&address=${addressQuery}&key=YOUR_GOOGLE_API_KEY`;
}

Agitator.prototype.fetchOfficial = function(){
  let url = this.civicUrlGenerator(this.titles[this.official].level, this.titles[this.official].role, this.user.address)
  return axios.get(url)
  .then((data)=>{
    this.fetchedOfficial.name = data.data.officials[0].name;
    this.fetchedOfficial.street = data.data.officials[0].address[0].line1;
    this.fetchedOfficial.city = data.data.officials[0].address[0].city;
    this.fetchedOfficial.state = data.data.officials[0].address[0].state;
    this.fetchedOfficial.zip = data.data.officials[0].address[0].zip;
    this.fetchStatus = true;
    console.log(`Your ${this.official} is ${this.fetchedOfficial.name}`)
  })
  .catch((err) => {
    this.errorHandler(err.status_code)
    console.log(`This was the address you entered: ${this.user.address}`)
  })
}

Agitator.prototype.errorHandler = function(code){
  switch(code){
    case 401:
      console.log('You are unauthorized to make this request')
      break;
    case 403:
      console.log('You are forbidden')
      break;
    case 404:
      console.log('The item is not found')
      break;
    case 422:
      console.log('The provided inputs are incorrect')
      break;
    case 429:
      console.log('You have made too many requests recently. Come back later.')
      break;
    case 500:
      console.log('Something went wrong with our server. Sorry!')
    default:
      console.log('There was some error with your request.')
  }
}

Agitator.prototype.getUserMessage = function(){
  console.log()
  this.userMessage = prompt.question(`What would you like to say to your ${this.official}? `)
}

Agitator.prototype.produceLetter = function(){
    Lob.letters.create({
      description: 'Civil Disobedience Letter',
      to: {
        name: this.fetchedOfficial.name,
        address_line1: this.fetchedOfficial.street,
        address_city: this.fetchedOfficial.city,
        address_state: this.fetchedOfficial.state,
        address_zip: this.fetchedOfficial.zip,
        address_country: 'US',
      },
      from: {
        name: this.user.fullName,
        address_line1: this.user.street,
        address_line2: this.user.apt,
        address_city: this.user.city,
        address_state: this.user.state,
        address_zip: this.user.zip,
        address_country: 'US',
      },
      file: 'tmpl_50a41c38638a0de',
      data: {
        message: this.userMessage,
        recipient: this.fetchedOfficial.name,
        sender: this.user.fullName
      },
      color: true
    })
  .then(res => console.log('You can find your letter here: ', res.url))
  .catch(err => this.errorHandler(err.status_code))
}




