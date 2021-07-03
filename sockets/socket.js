const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');


const bands = new Bands();
console.log('Init server');

bands.addBand(new Band('Opeth'));
bands.addBand(new Band('Metallica'));
bands.addBand(new Band('Within Temptation'));
bands.addBand(new Band('Arch Enemy'));

console.log(bands);

//Mensajes de sockets



io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());
    client.on('disconnect', () => { console.log('Cliente desconectado'); });

    client.on('mensaje', (payload) => {

        console.log('Mensaje!!!', payload);
        io.emit('mensaje', { admin: 'Nuevo mensaje' });
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
            const newBand = new Band(payload.name);
            bands.addBand(newBand);
            io.emit('active-bands', bands.getBands());            
    });
    client.on('delete-band', (payload) => {
       bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());            
});

});