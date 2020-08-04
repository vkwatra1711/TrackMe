/**const mqtt = require('mqtt');
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
client.on('connect', () => {
 console.log('connected');
});
const topic = '/myid/test/hello/';
const msg = 'Hello MQTT world!';
client.publish(topic, msg, () => {
 console.log('message sent...');
});*/
