var noble = require('noble');

const DEVICE_NAME = 'MLT-BT05';
const SERVICE_UUID = 'ffe0';

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
        console.log('found service:', service.uuid);
        if (service.uuid === SERVICE_UUID) {
          service.discoverCharacteristics([], function(err, characteristics) {
            characteristics.forEach(function(characteristic) {
              console.log('found characteristic:', characteristic.uuid);
              characteristic.subscribe(function(){
                characteristic.read(function(error, data){
                  console.log(data);
                });
              });
            });
	        });
        }
      });
    });
  });
}
