calluserservice = function(){
    var kafka = Meteor.npmRequire('kafka-node')
    Producer = kafka.Producer,
    KeyedMessage = kafka.KeyedMessage,
    client = new kafka.Client(),
    producer = new Producer(client),
    km = new KeyedMessage('key', 'message'),
    payloads = [
        { topic: 't1', messages: 'hi', partition: 0 },
        { topic: 't2', messages: ['hello', 'world', km] }
    ];
    producer.on('ready', function () {
        producer.send(payloads, function (err, data) {
            console.log(data);
        });
    });
}

