"use client"
import Link from "next/link"

export default function PoolsPage() {
    return (
        <div className="flex flex-col h-screen overflow-y-hidden">
                <div className="fixed group w-full bg-[#26231f] hover:bg-[#3d3d3d] h-16 items-center">
            <Link href="/markets/overview">
                <header className="flex items-center h-16 justify-between bg-[#26231f] text-white max-w-[1350px] lg:w-[1350px] mx-auto group-hover:bg-[#3d3d3d]">
                    <div className="flex flex-inline items-center">
                    <ArrowLeftIcon className="h-6 w-6 mr-2 animate-pulse group-hover:scale-110 group-hover:stroke-neutral-300" />

                    <p className="ani-text-underline relative inline text-lg font-semibold">
                        <span>Back to Catalyst Dashboard</span><span className="absolute -bottom-1 left-0 w-0 transition-all h-[1px] bg-neutral-200 opacity-50 group-hover:w-full"></span>

                    </p>
                    </div>
                    <div className="hidden md:flex align-end self-justify-end"><p className="text-xs">External API in use - data may be inaccurate.</p></div>

                </header>
            </Link>
            

            </div>
            <div className="flex-1 bg-transparent">
                <iframe
                    loading="eager"
                    frameBorder="0" seamless allowTransparency
                    className="my-6 py-16 w-full h-screen overflow-y-scroll bg-background-secondary"
                    src="https://pools-alpha.vercel.app/"></iframe>
            </div>
        </div>
    )
}

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
        </svg>
    )
}
