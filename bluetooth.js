var noble = require('noble');
console.log('scanning...');

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  console.log('\thello my local name is:');
  console.log('\t\t' + peripheral.advertisement.localName);
  console.log('\tcan I interest you in any of the following advertised services:');
  console.log('\t\t' + JSON.stringify(peripheral.advertisement.serviceUuids));

  if (peripheral.advertisement.manufacturerData) {
    console.log('\there is my manufacturer data:');
    console.log('\t\t' + JSON.stringify(peripheral.advertisement.manufacturerData.toString('hex')));
  }

  if (peripheral.advertisement.localName === 'MLT-BT05') {
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
        console.log('found service:', service.uuid);
      });
    });
  });
}
