import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router';

import './App.css';
import CPUMonitor from './CPUMonitor.jsx';
import logo from "./assets/watchdog-logo.png";
import winClient from "./assets/win-client.png";

function Header() {
    return (
        <header className='lg:mx-auto lg:w-4/5 xl:w-7/10 p-4 flex items-center justify-between'>
            <NavLink to="/">
                <figure className='w-25'>
                    <img src={logo} alt="w-full h-full object-cover" />
                </figure>
            </NavLink>

            <nav className='font-medium text-sm space-x-4'>
                <NavLink to="/about" className='px-3 py-2 rounded-full ring ring-gray-300 hover:ring-blue-400'>About</NavLink>
                <a href="/api/downloads" className='px-3 py-2 rounded-full ring ring-gray-300 hover:ring-blue-400'>Downloads</a>
            </nav>
        </header>
    )
}

function Vitals({ data }) {
    const {
        macAddress,
        osType,
        upTime,
        totalMemory,
        freeMemory,
        memoryUsagePer,
        cpuModel,
        cpuSpeed,
        cores,
        cpuUsage
    } = data.info;

    const { isActive } = data;

    return (
        <div className="bg-gray-200 flex flex-col gap-y-4 py-6 h-full md:p-6">

            <div className="flex justify-between flex-wrap gap-4 *:basis-75 *:grow">

                <div className='flex flex-col justify-between gap-y-1 bg-white border border-gray-500 font-medium p-4 md:text-sm'>

                    <p className='text-xl font-black'>{osType}</p>

                    <p className='flex justify-between'>
                        <span>MAC: </span>
                        <span>{macAddress}</span>
                    </p>

                    <p className='flex justify-between'>
                        <span>Up time: </span>
                        <span>{isActive ? upTime : <i className="fa-solid fa-ellipsis fa-lg"></i>}</span>
                    </p>
                    {
                        isActive
                            ? <h1 className='text-green-500 text-lg font-black'>Connected</h1>
                            : <h1 className='text-red-500 text-lg font-black'>Disconnected</h1>
                    }
                </div>

                <div className='flex flex-col justify-between gap-y-1 p-4 bg-white border border-gray-500 md:text-sm'>
                    <h2 className='text-xl font-black'>Memory</h2>

                    <p className='flex justify-between font-medium'>
                        <span className=''>Total:</span>
                        <span>{isActive ? totalMemory : <i className="fa-solid fa-ellipsis fa-lg"></i>}</span>
                    </p>
                    <p className='flex justify-between font-medium'>
                        <span className=''>Free:</span>
                        <span>{isActive ? freeMemory : <i className="fa-solid fa-ellipsis fa-lg"></i>}</span>
                    </p>
                    <p className='flex justify-between font-medium'>
                        <span className=''>Usage:</span>
                        <span>{isActive ? memoryUsagePer : <i className="fa-solid fa-ellipsis fa-lg"></i>}</span>
                    </p>
                </div>

                <div className='flex flex-col justify-between gap-y-1 p-4 bg-white border border-gray-500 md:text-sm'>
                    <h2 className='text-xl font-black'>CPU</h2>

                    <p className='flex justify-between font-medium'>
                        <span className=''>Cores:</span>
                        <span>{isActive ? cores : <i className="fa-solid fa-ellipsis fa-lg"></i>}</span>
                    </p>
                    <p className='flex justify-between font-medium'>
                        <span className=''>Speed:</span>
                        <span>{isActive ? cpuSpeed : <i className="fa-solid fa-ellipsis fa-lg"></i>}</span>
                    </p>
                    <p className='flex justify-between font-medium'>
                        <span className=''>Utilization:</span>
                        <span>{isActive ? `${cpuUsage}%` : <i className="fa-solid fa-ellipsis fa-lg"></i>}</span>
                    </p>
                </div>

            </div>

            <div className='grow bg-white p-4 flex flex-col gap-y-4 border border-gray-500'>
                <p className='self-center font-bold'>{cpuModel}</p>

                {/* Chart */}
                <div className='grow min-h-75'>
                    <CPUMonitor
                        data={cpuUsage}
                        isActive={isActive}
                    />
                </div>
            </div>
        </div>
    );
}

function Devices({ devices }) {
    return (
        <>
            <Header />
            <section className='lg:w-4/5 space-y-10 self-center'>
                {
                    Object.keys(devices).map(mac => {
                        return (
                            <Vitals
                                key={mac}
                                data={devices[mac]}
                            />
                        )
                    })
                }
            </section>
        </>
    )
}

function About() {
    return (
        <>
            <Header />
            <section className='text-lg flex flex-col gap-y-10 p-4 lg:w-4/5 xl:w-7/10 lg:mx-auto'>
                <div className='space-y-4'>
                    <h1 className='font-bold text-3xl lg:text-4xl'>Do you know how's your machine doing?</h1>
                    <h2 className='text-blue-500 font-medium text-xl'>Me neither. So, I built Watchdog.</h2>
                </div>

                <p>
                    Watchdog is a real-time system monitoring tool leveraging WebSocket protocol to track essential system metrics remotely. Our product is tailored for IT administrators, DevOps teams, and professionals managing remote systems.
                </p>

                <div className='space-y-6'>
                    <h3 className='font-bold text-xl'>Now that I have your attention, follow the steps below:</h3>
                    <ul className='space-y-6'>
                        <li>
                            <span className="font-semibold">Step 1: </span>
                            Go to the "Downloads" page to get a copy of the Watchdog Tool as per your system type.
                            <span className="text-red-500"> We don't support ARM at the moment.</span>
                        </li>

                        <li>
                            <span className="font-semibold">Step 2: </span>
                            Next, just run the tool. It'll send your system vitals to our server. On Windows, you'll see something like this:

                            <figure className='w-full pt-4'>
                                <img src={winClient} alt="A screenshot of the Watchdog Windows Client" className='w-full h-full object-cover' />
                            </figure>
                        </li>
                    </ul>

                    <p>
                        That is it! Now, click the Watchdog Logo and <em>voila!</em>
                    </p>
                </div>
            </section>

            <footer className='border-t border-gray-300 flex items-center justify-between px-4 py-8 lg:w-4/5 xl:w-7/10 lg:mx-auto'>
                <p className="text-xs 2xl:text-sm text-gray-500">&#169; 2025 Atanu Sarkar</p>
                
                <div className="flex gap-x-6 items-center lg:gap-x-10">
                    <a href="mailto:atanu_sarkar1@outlook.com">
                        <i className="fa-regular fa-envelope fa-lg"></i>
                    </a>
                    <a href="https://github.com/atanu5arkar" target="_blank">
                        <i className="fa-brands fa-github fa-lg"></i>
                    </a>
                    <a href="https://www.instagram.com/atanu.dev/" target="_blank">
                        <i className="fa-brands fa-instagram fa-lg"></i>
                    </a>
                    <a href="https://x.com/x_atanu" target="_blank">
                        <i className="fa-brands fa-x-twitter fa-lg"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/atanu23/" target="_blank">
                        <i className="fa-brands fa-linkedin fa-lg"></i>
                    </a>
                </div>
            </footer>
        </>
    )
}

function App() {
    const [devices, setDevices] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loading) return;

        const socket = io("https://watchdog.atanu.dev", {
            auth: {
                token: "9b40e73b-8613-410d-8c44-0a5201cb4b87"
            }
        });

        socket.on("connect", () => {
            console.log("Connected to the Watchdog server.");

            socket.on("vitals", (data) => {
                const { socketId, info } = data

                setDevices(devices => {
                    if (!devices[info.macAddress])
                        return {
                            ...devices,
                            [info.macAddress]: { socketId, isActive: true, info }
                        };

                    // Dashboard lost connection for a while
                    if (socketId in devices[info.macAddress])
                        return {
                            ...devices,
                            [info.macAddress]: { ...devices[info.macAddress], info }
                        }

                    // An old client
                    return {
                        ...devices,
                        [info.macAddress]: { socketId, isActive: true, info }
                    }
                });
            });

            socket.on("clientDisconnect", (clientId) => {
                setDevices(devices => {
                    for (const mac in devices) {
                        if (devices[mac].socketId == clientId) {
                            return {
                                ...devices,
                                [mac]: { ...devices[mac], isActive: false }
                            };
                        }
                    }
                    return devices;
                });
            });
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from the Watchdog server.");
        });
    }, [loading]);

    useEffect(() => {
        async function fetchDevices() {
            try {
                const req = new Request("/api/devices", {
                    method: "GET",
                    headers: {
                        auth: "f8c48a9a-f5ff-4a93-8d0c-d7a5f343e661"
                    }
                });

                var res = await fetch(req);
                var resBody = await res.json();

                if (!resBody.length) {
                    setLoading(false);
                    return;
                }
                resBody.forEach(record => {
                    setDevices(prevState => {
                        return {
                            ...prevState,
                            [record.macAddress]: { socketId: '', isActive: false, info: record }
                        }
                    });
                });
                setLoading(false);

            } catch (error) {
                console.log(error);
            }
        }
        fetchDevices();
    }, []);

    if (loading) return (
        <div className='h-screen flex justify-center items-center'>
            <div className="text-gray-600 flex gap-x-4 items-center">
                <h1 className='font-[Inter] font-black text-2xl'>
                    Please Wait
                </h1>
                <i className="fa-solid fa-spinner fa-xl animate-spin"></i>
            </div>
        </div>
    );

    return (
        <main className='max-w-screen-2xl min-h-screen flex flex-col gap-y-6 font-[Inter] bg-white'>
            <BrowserRouter>
                <Routes>
                    <Route
                        path='/'
                        element={
                            Object.keys(devices).length

                                ? <Devices devices={devices} />
                                : <div className='h-screen flex flex-col justify-center items-center gap-y-10'>
                                    <div className="font-[Inter] flex flex-col gap-y-4 items-center">
                                        <div>
                                            <i className="fa-solid fa-hand-peace fa-2xl"></i>
                                        </div>
                                        <h1 className='font-black text-2xl'>
                                            Watchdog is sleeping
                                        </h1>
                                        <p className='font-medium text-gray-600'>No connected devices.</p>
                                    </div>

                                    <div className='flex items-center gap-x-4'>
                                        <NavLink to="/about" className='px-6 py-2 rounded-full ring ring-gray-300 hover:ring-blue-400'>About</NavLink>
                                        <a href="/api/downloads" className='px-6 py-2 rounded-full ring ring-gray-300 hover:ring-blue-400'>Downloads</a>
                                    </div>
                                </div>
                        }
                    />
                    <Route
                        path='about'
                        element={
                            <About />
                        }
                    />
                </Routes>
            </BrowserRouter>
        </main>
    )
}

export default App;
