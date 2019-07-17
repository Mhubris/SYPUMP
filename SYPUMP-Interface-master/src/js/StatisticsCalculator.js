// The main objective of this class its to compute statistics about the signal
// All the class methods returns a json with the stats of each physical quantity
class SatisticsCalculator {

    constructor(capacitanceData = [], temperatureData = [], humidityData = [], acquisitionTime) {
        this.capacitanceData = capacitanceData;
        this.temperatureData = temperatureData;
        this.humidityData = humidityData;
        this.acquisitionTime = acquisitionTime;
    }

    getSampleRate() {
        let sampleRate = this.capacitanceData.length / this.acquisitionTime;
        return {'capacitance': sampleRate, 'temperature': sampleRate, 'humidity': sampleRate};
    }

    getMaximum() {
        let capacitanceMaximum = max(this.capacitanceData);
        let temperaturMaximum = max(this.temperatureData);
        let humidityMaximum = max(this.humidityData);
        return {'capacitance': capacitanceMaximum, 'temperature': temperaturMaximum, 'humidity': humidityMaximum};
    }

    getAverage() {
        let capacitanceMean = mean(this.capacitanceData);
        let temperatureMean = mean(this.temperatureData);
        let humidityMean = mean(this.humidityData);

        return {'capacitance': capacitanceMean, 'temperature': temperatureMean, 'humidity': humidityMean};
    }

}