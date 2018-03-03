var noble = require('noble');
var http = require('http');
var querystring = require('querystring');

const DEVICE_NAME = 'MLT-BT05';
const SERVICE_UUID = 'ffe0';
const SERVER_URL = 'localhost';
const SERVER_PORT = 3000;
const DATA_PATH = 'move';

console.log('scanning...');

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  if (peripheral.advertisement.localName === DEVICE_NAME) {
    noble.stopScanning();
    explore(peripheral);
  }
});


function explore(peripheral) {
  console.log('services and characteristics:');
  
  peripheral.on('disconnect', function() {
    process.exit(0);
  });

  peripheral.connect(function(error) {
    console.log("connected...");
    peripheral.discoverServices([], function(err, services) {
      services.forEach(function(service) {
        handleService(service)
      });
    });
  });
}

function handleService(service) {
  console.log('found service:', service.uuid);
  if (service.uuid === SERVICE_UUID) {
    discoverCharacreistics(service);
  }
}

function discoverCharacreistics(service) {
  service.discoverCharacteristics([], function(err, characteristics) {
    characteristics.forEach(function(characteristic){
      handleCharacteristic(characteristic)
    });
  });
}

function handleCharacteristic(characteristic) {  
  console.log('found characteristic', characteristic.uuid);
  characteristic.subscribe(function(){
    console.log("subscribed");
    characteristic.on('data', function(data, isNotification){
      console.log("Data is: ");
      console.log(data);
      console.log("Sending data to server: ");
      pushToServer(data);
    });
  });
}

// {pos: 16, state: true}
function pushToServer(data) {
  // Build the post string from an object
  let post_data = JSON.stringify(data);
  post_data = JSON.parse(post_data)["data"];

  let structure = {pos: 0, state: true};
  structure.pos = post_data[0];
  structure.state = post_data[1] === 1;
  console.log('structure in pushToServer: ');
  console.log(JSON.stringify(structure));

  // An object of options to indicate where to post to
  var post_options = {
      host: SERVER_URL,
      port: SERVER_PORT,
      path: '/' + DATA_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });
  });
  // post the data
  post_req.write(JSON.stringify(structure));
  post_req.end();
}
