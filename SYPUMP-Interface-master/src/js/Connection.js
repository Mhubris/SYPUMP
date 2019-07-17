//@Miguel Andrade
//17/04/2019

// Port States
const FIND_PORT_ERROR = "Error_On_Port";
const CONNECTED = "Connected";
const DEVICE_DISCONNECTED = "Disconnected";


const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

class Connection {

    constructor(baudRate = 96000) {
        this.baudRate= baudRate;
        this.eventListeners = {
            'dataReceived': [],
            'dataSent': [],
            'connectionStateChange': []
        };

    }


    //This method is responsible for establish the connection and set
    //some Connection Object Properties
    makeConnection() {
        var self = this;
        SerialPort.list((err, ports) => {

            // This if is triggered when there is no ports or any error is throwed
            if (err || ports.length === 0) {
                this.arduinoPortName = FIND_PORT_ERROR;
                this.triggerEvent('connectionStateChange',FIND_PORT_ERROR);
                return;
            }

            ports.forEach((port) => {
                // Where he should put a condition to identify microncontroller
                if (port['manufacturer'] === "wch.cn") {
                    this.arduinoPortName = port["comName"].toString();
                    this.serialPort = new SerialPort(this.arduinoPortName, {
                        buadRate: this.baudRate
                    });
                    this.triggerEvent('connectionStateChange',CONNECTED);
                    this.parser = this.serialPort.pipe(new Readline());
                }
            });

            // Listeners defenitions
            this.parser.on('data', function (data) {
                self.triggerEvent("dataReceived", data);
            });

            this.serialPort.on('close', function(){
                self.triggerEvent('connectionStateChange',FIND_PORT_ERROR);
            });
        });
    }

    // Close the connection
    closeConnection() {
        if(this.getConnectionState()){
            this.serialPort.close();
        }
    }

    // Return connection state
    getConnectionState() {
        if(typeof this.serialPort !== 'undefined'){
            return this.serialPort.isOpen;
        }
        return false;
    }


    // Make a pointer to a funtion on UiControl class
    on(event, callback) {
        if (typeof event !== 'string' || typeof callback !== 'function') {
            throw new TypeError("Invalid arguments on 'on' function.");
        }

        this.eventListeners[event].push(callback);
    };


    //Execute the function pointed by On method
    triggerEvent(event, ...args) {
        var callbacks = this.eventListeners[event];
        callbacks.forEach(function (elem, index, arr) {
            elem(...args);
        });
    };

}


