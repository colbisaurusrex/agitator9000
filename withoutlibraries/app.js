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