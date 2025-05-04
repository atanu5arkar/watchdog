// pkg needs CommonJS Module

const { io } = require("socket.io-client");
const os = require("node:os");
const { setTimeout } = require("node:timers/promises");

function cpuTotal() {
    const cpu = os.cpus();

    let
        idleMS = 0,
        totalMS = 0;

    cpu.forEach(ele => {
        for (const key in ele.times) {
            totalMS += ele.times[key];
        }
        idleMS += ele.times.idle;
    });

    return {
        totalMS: totalMS / cpu.length,
        idleMS: idleMS / cpu.length
    }
};

async function cpuAvg() {
    const start = cpuTotal();
    await setTimeout(100);
    const end = cpuTotal();

    const idleDifference = end.idleMS - start.idleMS;
    const totalDifference = end.totalMS - start.totalMS;
    const percentageCpu = 100 - Math.floor(100 * idleDifference / totalDifference);
    return percentageCpu;
}

async function getCPUVitals() {
    const
        totalMem = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2),
        freeMem = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2),
        usedMem = (totalMem - freeMem).toFixed(2),
        memUsagePer = (100 * usedMem / totalMem).toFixed(2),
        upTime = (os.uptime() / (60 * 60)).toFixed(2),
        osType = os.type();

    const
        cpuInfo = os.cpus(),
        cores = cpuInfo.length,
        cpuModel = cpuInfo[0].model,
        cpuSpeed = cpuInfo[0].speed;

    const nI = os.networkInterfaces();
    let macAddress;

    for (let key in nI) {
        if (!nI[key][0].internal) {
            macAddress = nI[key][0].mac;
            break;
        }
    }
    
    const cpuUsage = await cpuAvg();

    return {
        macAddress,
        osType,
        upTime: `${upTime} hrs`,
        totalMemory: `${totalMem} GB`,
        freeMemory: `${freeMem} GB`,
        usedMemory: `${usedMem} GB`,
        memoryUsagePer: `${memUsagePer}%`,
        cpuModel,
        cpuSpeed,
        cores,
        cpuUsage
    }
}

const socket = io("https://watchdog.atanu.dev", {
    auth: {
        token: "9b40e73b-8613-410d-8c44-0a5201cb4b87"
    }
});

socket.on("connect", async () => {
    console.log("Connected to the Watchdog server.");

    const data = await getCPUVitals();
    socket.emit("register", data);

    socket.on("OK", () => {
        console.log("Device Registered Successfully.");

        setInterval(async () => {
            const res = await getCPUVitals();
            socket.emit("vitals", res);
        }, 200);
    });
});

socket.on("disconnect", () => {
    console.log("Disconnected");
});