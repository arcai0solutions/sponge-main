"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, ShieldCheck, RadioTower, Factory, Truck } from 'lucide-react';

const sectors = [
    {
        name: "Banking",
        icon: Landmark,
        clients: [
            "Commercial Bank",
            "HSBC",
            "LankaPay",
            "NDB Bank",
            "DFCC Bank",
            "Nations Trust Bank",
            "Sampath Bank",
            "Commercial Bank of Maldives",
            "Maldives Islamic Bank",
        ],
    },
    {
        name: "Finance & Insurance",
        icon: ShieldCheck,
        clients: ["LOLC", "Janashakthi Insurance", "AIA", "SoftLogic Life", "Ceylinco Life"],
    },
    {
        name: "Telco & Technology",
        icon: RadioTower,
        clients: ["Edotco", "Dialog", "Airtel", "Hutch", "Mobitel", "Sri Lanka Telecom"],
    },
    {
        name: "Consumer & Manufacturing",
        icon: Factory,
        clients: [
            "Hayleys",
            "MAS Active",
            "Brandix",
            "Singer",
            "Arpico",
            "Kelani Cables",
            "Leader Batteries",
            "Verger",
        ],
    },
    {
        name: "Logistics, Health & Services",
        icon: Truck,
        clients: [
            "CMA CGM",
            "Li & Fung",
            "Scanwell Logistics",
            "Freight Links",
            "Maldives Ports Limited",
            "Lanka Hospitals",
            "Hemas",
            "LECO",
            "CIPM",
            "CIMA",
            "CPM",
            "SLIIT",
            "IIT",
            "CSID",
            "ICBS",
        ],
    },
];

const totalClients = sectors.reduce((sum, s) => sum + s.clients.length, 0);

function ClientName({ name }: { name: string }) {
    return (
        <div className="shrink-0 flex items-center">
            <span className="whitespace-nowrap text-white/70 hover:text-white font-semibold text-lg md:text-2xl tracking-tight transition-colors duration-300">
                {name}
            </span>
            <span className="mx-6 md:mx-10 w-1.5 h-1.5 rounded-full bg-[#E31E24]" />
        </div>
    );
}

function Marquee({ clients, reverse, duration }: { clients: string[]; reverse: boolean; duration: number }) {
    // Repeat short lists so one half of the track always spans wide screens, then double it for a seamless loop
    const repeats = Math.max(1, Math.ceil(10 / clients.length));
    const half = Array.from({ length: repeats }, () => clients).flat();

    return (
        <div className="group/marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div
                className={`flex w-max ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none`}
                style={{ animationDuration: `${duration}s` }}
            >
                {[0, 1].map(copy => (
                    <div key={copy} className="flex" aria-hidden={copy === 1}>
                        {half.map((client, i) => (
                            <ClientName key={`${client}-${i}`} name={client} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ClientSectors() {
    return (
        <section className="relative pb-32 -mt-8 z-20 overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-[#E31E24] rounded-full blur-[200px] opacity-[0.08] pointer-events-none" />
            <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-[#E31E24] rounded-full blur-[200px] opacity-[0.06] pointer-events-none" />

            {/* Header */}
            <div className="px-6 md:px-12 lg:px-24">
                <div className="max-w-[1400px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-10 mb-16 md:mb-20"
                    >
                        <div className="max-w-3xl">
                            <p className="text-[#E31E24] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-5">
                                Track Record
                            </p>
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                                Market leaders rely on us <br className="hidden md:block" />
                                for <span className="text-[#E31E24]">transformation.</span>
                            </h2>
                            <p className="mt-6 text-white/50 text-base md:text-lg font-light max-w-xl">
                                Selected clients across banking, telecoms, manufacturing and beyond.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-px rounded-2xl overflow-hidden border border-white/10 bg-white/10 shrink-0 w-full sm:w-auto sm:self-start xl:self-auto">
                            {[
                                { value: `${totalClients}+`, label: "Clients" },
                                { value: `${sectors.length}`, label: "Sectors" },
                                { value: "2", label: "Countries" },
                            ].map(stat => (
                                <div key={stat.label} className="bg-black/90 backdrop-blur-md px-4 py-5 md:px-8 md:py-6">
                                    <div className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                                        {stat.value}
                                    </div>
                                    <div className="mt-1 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-white/40">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Sector rows */}
            <div className="border-t border-white/10">
                {sectors.map((sector, index) => {
                    const Icon = sector.icon;
                    return (
                        <motion.div
                            key={sector.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
                            className="group/row relative border-b border-white/10 py-7 md:py-8"
                        >
                            {/* Red accent line that grows on hover */}
                            <div className="absolute left-0 top-0 h-full w-[3px] bg-[#E31E24] origin-top scale-y-0 group-hover/row:scale-y-100 transition-transform duration-500" />

                            <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-0">
                                <div className="px-6 md:px-12 lg:pl-24 lg:pr-10 lg:w-[420px] xl:w-[460px] shrink-0 flex items-center gap-5">
                                    <span className="text-white/20 font-black text-4xl md:text-5xl tracking-tighter tabular-nums group-hover/row:text-[#E31E24]/80 transition-colors duration-500">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2.5">
                                            <Icon className="w-4 h-4 md:w-5 md:h-5 text-[#E31E24]" strokeWidth={2.2} />
                                            <h3 className="text-lg md:text-2xl font-bold tracking-tight text-white">
                                                {sector.name}
                                            </h3>
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-[0.15em] text-white/40">
                                            {sector.clients.length} clients
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <Marquee
                                        clients={sector.clients}
                                        reverse={index % 2 === 1}
                                        duration={Math.max(sector.clients.length, 10) * 4.5}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
