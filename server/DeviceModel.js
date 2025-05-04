import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    macAddress: {
        type: String,
        required: true
    },
    osType: {
        type: String,
        required: true
    },
    upTime: {
        type: String,
        required: true
    },
    totalMemory: {
        type: String,
        required: true
    },
    freeMemory: {
        type: String,
        required: true
    },
    usedMemory: {
        type: String,
        required: true
    },
    memoryUsagePer: {
        type: String,
        required: true
    },
    cpuModel: {
        type: String,
        required: true
    },
    cpuSpeed: {
        type: Number,
        required: true,
        default: 0
    },
    cores: {
        type: Number,
        required: true
    },
    cpuUsage: {
        type: Number,
        required: true,
        default: 0
    }
});

const DeviceModel = mongoose.model("Device", deviceSchema, "devices");

export default DeviceModel;
