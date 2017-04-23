const stdin = process.stdin;
const stdout = process.stdout;

const ask = function(question){
  return new Promise(function(resolve, reject){
    stdin.resume();
    stdin.setEncoding('utf8');
    stdout.write(question + ' ')
    stdin.once('data', function(data){
      if(data){
        data = data.trim();
        resolve(data)
      } else {
        reject(data)
      }
    })
  })
}

const produceList = function(list){
  let choices = "";
  list.forEach((item, index)=>{
    choices += '[' + index + '] ' + item  + '\r\n'
  })
  return choices;
}

module.exports = {
  ask,
  produceList
}