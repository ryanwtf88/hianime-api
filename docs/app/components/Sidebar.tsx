import Link from 'next/link';

export default function Sidebar() {
    return (
        <aside className="w-64 h-screen fixed left-0 top-0 overflow-y-auto border-r border-gray-200 bg-white p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-blue-600">HiAnime API</h1>
                <p className="text-sm text-gray-500 mt-2">Documentation</p>
            </div>

            <nav className="space-y-6">
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Getting Started
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/" className="block text-gray-700 hover:text-blue-600 text-sm">
                                Introduction
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Core Features
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/home" className="block text-gray-700 hover:text-blue-600 text-sm">
                                Home Page
                            </Link>
                        </li>
                        <li>
                            <Link href="/anime" className="block text-gray-700 hover:text-blue-600 text-sm">
                                Anime Details
                            </Link>
                        </li>
                        <li>
                            <Link href="/search" className="block text-gray-700 hover:text-blue-600 text-sm">
                                Search & Filter
                            </Link>
                        </li>
                        <li>
                            <Link href="/schedule" className="block text-gray-700 hover:text-blue-600 text-sm">
                                Schedules
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Streaming
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/streaming" className="block text-gray-700 hover:text-blue-600 text-sm">
                                Episodes & Servers
                            </Link>
                        </li>
                        <li>
                            <Link href="/embed" className="block text-gray-700 hover:text-blue-600 text-sm">
                                Embed Player
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Metadata & Utils
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/metadata" className="block text-gray-700 hover:text-blue-600 text-sm">
                                Genres & Characters
                            </Link>
                        </li>
                        <li>
                            <Link href="/utils" className="block text-gray-700 hover:text-blue-600 text-sm">
                                Utils (Random, W2G)
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </aside>
    );
}
