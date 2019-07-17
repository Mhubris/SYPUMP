class UiControl {

    constructor() {
        this.connection = new Connection(9600);
        this.setButtonEnabled(false);

        // Set oBject Variables
        this.connectionPause = false;
        this.capacitanceData= [];
        this.temperatureData=[];
        this.humidityData=[];

        // Set Listeners
        this.connection.on('dataReceived', (data) => {
            this.plotCapacitance(data)
        });
        this.connection.on('connectionStateChange', (state) => {
            this.onConnectionStateChanged(state, this);
        });

    }


    plotCapacitance(data) {
        try {
            if (!this.connectionPause) {
                data = JSON.parse(data);

                // Those arrays were created to store values in csv
                this.capacitanceData.push([this.capacitanceData.length, data['capacitante']]);
                this.temperatureData.push([this.temperatureData.length, data['temperature']]);
                this.humidityData.push([this.humidityData.length, data['hummidity']]);

                // This is use full for a smooth scroll
                if(this.capacitanceData.length>150 ){
                    this.capacitancePlot.updateOptions({
                        'file': this.capacitanceData,
                        dateWindow: [ this.capacitanceData.length - 150,  this.capacitanceData.length]
                    });
                    this.temperaturePlot.updateOptions({
                        'file': this.temperatureData,
                        dateWindow: [this.temperatureData.length - 150, this.temperatureData.length]
                    });
                    this.humidityPlot.updateOptions({
                        'file': this.humidityData,
                        dateWindow: [this.temperatureData.length - 150, this.temperatureData.length]
                    });
                }else{
                    this.capacitancePlot.updateOptions({
                        'file': this.capacitanceData
                    });
                    this.temperaturePlot.updateOptions({
                        'file': this.temperatureData
                    });
                    this.humidityPlot.updateOptions({
                        'file': this.humidityData
                    });
                }
            }
        } catch (e) {
        }
    }


    getMatrixColumn(index) {
       return dataMatrix.map(x => x[index]);
    }

    onConnectionStateChanged(state, self) {
        switch (state) {
            // if loop true In case of error try to connect again
            case FIND_PORT_ERROR:
                self.findPortError();
                break;
            case CONNECTED:
                self.enablePreloader("Preparing Everything");
                self.changeButtonState(true);
                self.setButtonEnabled(true);
                setTimeout(() => {
                    $(".body").load("src/body/data-acquisition.html", () => {
                        self.setCapacitancePlot();
                        self.setTemperaturePlot();
                        self.setHumidityPlot();
                    });
                    self.disablePreloader();
                }, 1000);
                break;
        }
    }

    tryToConnect() {
        // Connect device case
        this.enablePreloader("Trying To Connect");
        this.changeButtonState(false);
        this.connection.makeConnection();
    }

    findPortError() {
        this.changeButtonState(false);
        this.enablePreloader("Connection Error")
    }

    disconnect() {
        this.cleanGraphs();
        this.connection.closeConnection();
    }


    disablePreloader() {
        $(".pre-loader").addClass("d-none");
    }

    enablePreloader(message = "") {
        $(".pre-loader").removeClass("d-none");
        $(".pre-loader .message").text(message);
    }


// On Off Button control
    changeButtonState(state = false) {
        $("#change-device-state").prop('checked', state);
    }

    setButtonEnabled(enabled = false) {
        $("#change-device-state").prop('disabled', !enabled);
    }


//Graphs
    setCapacitancePlot() {
        // // var capacitanceElement = document.getElementById('tester');
        // this.line = {
        //     type: "scattergl",
        //     y: [],
        //     mode: 'line',
        //     marker: {color: '#3949ab', size: 8},
        //     line: {width: 2}
        // };
        // let layout = {
        //     autosize: true,
        //     margin: {
        //         l: 30,
        //         r: 30,
        //         b: 30,
        //         t: 30,
        //         pad: 4
        //     },
        //     xaxis: {
        //         fixedrange: false,
        //         showgrid: true,
        //         zeroline: false,
        //         showline: false,
        //         autotick: true,
        //         ticks: '',
        //         showticklabels: true
        //     },
        //     yaxis: {
        //         fixedrange: true,
        //         showgrid: true,
        //         zeroline: false,
        //         showline: false,
        //         autotick: true,
        //         ticks: '',
        //         showticklabels: true
        //     },
        //     paper_bgcolor: 'rgba(0,0,0,0)',
        //     plot_bgcolor: 'rgba(0,0,0,0)',
        //     showlegend: false
        // };
        // Plotly.plot('capacitanceChart', [this.line], layout, {displayModeBar: false});
        this.capacitancePlot = new Dygraph(document.getElementById("capacitanceChart"), [[0, 0]],
            {
                drawPoints: true,
                showRoller: true,
                labels: ['Capacitance/F', 'Sample']
            });

    }

    setTemperaturePlot() {
        this.temperaturePlot = new Dygraph(document.getElementById("temperatureChart"), [[0, 0]],
            {
                drawPoints: true,
                showRoller: true,
                labels: ['Temperature/F', 'Sample']
            });
    }

    setHumidityPlot() {
        this.humidityPlot = new Dygraph(document.getElementById("humidityChart"), [[0, 0]],
            {
                drawPoints: true,
                showRoller: true,
                labels: ['Humidity/F', 'Sample']
            });
    }



    setAcquistionPause(pause) {
        this.connectionPause = pause;
    }

    clearDataArrays() {
        this.capacitanceData=this.humidityData=this.temperatureData=[];
    }

    saveAsCsv() {
        console.log("oiio");
        console.log(dataMatrix)
        let csvContent = dataMatrix.map(e => e.join(";")).join("\n");


        // Or with ECMAScript 6
        const {dialog} = require('electron').remote;
        var fs = require('fs');

        var options = {
            filters: [
                {name: 'csv', extensions: ['csv']},
            ]
        };

        dialog.showSaveDialog(options, (fileName) => {
            if (fileName === undefined) {
                console.log("You didn't save the file");
                return;
            }

            // fileName is a string that contains the path and filename created in the save file dialog.
            fs.writeFile(fileName, csvContent, (err) => {
                if (err) {
                    alert("An error ocurred creating the file " + err.message)
                }

                alert("The file has been succesfully saved");
            });
        });
    }


}
