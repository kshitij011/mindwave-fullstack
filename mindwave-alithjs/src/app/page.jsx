import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-gray-200 p-6 flex flex-col items-center justify-center space-y-12">
            {/* Take Assessment Card */}
            <div className="w-full max-w-4xl rounded-3xl bg-white/80 shadow-2xl backdrop-blur-md p-8 flex flex-col md:flex-row justify-between items-center border border-gray-300">
                {/* Text */}
                <div className="w-full md:w-2/3 space-y-3">
                    <h2 className="text-3xl font-extrabold text-gray-800">
                        Are you an expert in your field?
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Help enterprises solve advanced problems.
                    </p>
                    <p className="text-gray-600 text-lg">
                        Take a short assessment and mint your Mindwave
                        Intelligence Token (MIT).
                    </p>
                </div>

                {/* Button */}
                <div className="mt-6 md:mt-0">
                    <Link href="/assessment">
                        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold text-lg rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300">
                            Take Assessment
                        </button>
                    </Link>
                </div>
            </div>

            {/* Submit Problem Card */}
            <div className="w-full max-w-4xl rounded-3xl bg-white/80 shadow-2xl backdrop-blur-md p-8 flex flex-col md:flex-row justify-between items-center border border-gray-300">
                {/* Text */}
                <div className="w-full md:w-2/3 space-y-3">
                    <h2 className="text-3xl font-extrabold text-gray-800">
                        Facing issues in your project?
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Submit a brief description of the problem.
                    </p>
                    <p className="text-gray-600 text-lg">
                        We'll decompose and distribute it to verified experts.
                    </p>
                </div>

                {/* Button */}
                <div className="mt-6 md:mt-0">
                    <Link href="/submit-problem">
                        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold text-lg rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300">
                            Submit Problem
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
