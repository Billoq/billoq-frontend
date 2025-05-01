import React from 'react'
import { SearchIcon } from 'lucide-react'

function DashboardSupport() {
  return (
    <section className="bg-gray-900 text-white px-4 py-10 md:px-20 space-y-10">
      <div className="max-w-2xl">
        <p className="text-2xl font-medium">
          Need help? We&apos;re here for you — fast and secure support for your Web3 payments.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center w-full md:max-w-xl bg-[#252e3a] rounded-2xl px-6 py-4 shadow-sm">
          <SearchIcon />
          <input type="text" placeholder="Search for a topic"
            className="ml-4 bg-transparent outline-none text-[#b4afa8] text-xl w-full placeholder-[#b4afa8]" />
        </div>
        <button className="bg-blue-700 hover:bg-blue-600 transition-colors text-white text-xl font-medium px-8 py-3 rounded-2xl">
          Search
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Common Topics</h2>
        {/*  */}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Guides & Resources</h2>
        <ul className="grid md:grid-cols-3 gap-6">
          <li className="bg-[#252e3a] p-6 rounded-lg transition transform hover:scale-105">
            <h3 className="text-xl font-medium mb-2">How to Pay a Bill</h3>
            <p className="text-sm text-[#b4afa8] mb-3">Step-by-step guide to complete your Web3 bill payments.</p>
            <a href="#" className="text-blue-400 hover:underline">Read article →</a>
          </li>
          <li className="bg-[#252e3a] p-6 rounded-lg transition transform hover:scale-105">
            <h3 className="text-xl font-medium mb-2">Gas Fees Explained</h3>
            <p className="text-sm text-[#b4afa8] mb-3">Understand what gas fees are and how to reduce them.</p>
            <a href="#" className="text-blue-400 hover:underline">Read article →</a>
          </li>
          <li className="bg-[#252e3a] p-6 rounded-lg transition transform hover:scale-105">
            <h3 className="text-xl font-medium mb-2">Security & Privacy Tips</h3>
            <p className="text-sm text-[#b4afa8] mb-3">Best practices for protecting your wallet and data.</p>
            <a href="#" className="text-blue-400 hover:underline">Read article →</a>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Community & Updates</h2>
        <ul className="flex space-x-8">
          <li>
            <a href="#" className="text-xl hover:underline">
              Join Billoq Discord
            </a>
          </li>
          <li>
            <a href="#" className="text-xl hover:underline">
              Follow on Twitter
            </a>
          </li>
          <li>
            <a href="#" className="text-xl hover:underline">
              Check Status Page
            </a>
          </li>
        </ul>
      </div>

    </section>

  )
}

export default DashboardSupport
