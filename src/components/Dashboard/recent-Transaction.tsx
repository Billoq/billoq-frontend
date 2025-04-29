import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const transactions = [
  {
    date: "22/04/2025",
    description: "Internet Bill",
    amount: "10.02",
  },
  {
    date: "22/04/2025",
    description: "Electricity Bill",
    amount: "15.02",
  },
  {
    date: "22/04/2025",
    description: "Water Bill",
    amount: "10.02",
  },
  {
    date: "22/04/2025",
    description: "Mobile Recharge",
    amount: "2.02",
  },
  {
    date: "22/04/2025",
    description: "Gas Bill",
    amount: "15.02",
  },
]

export function RecentTransactions() {
  return (
    <div>

        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-300">Recent Transactions</h2>
            <Link href="/transactions" className="text-sm font-medium text-blue-400">
            View All
            </Link>
        </div>

    <Card className="border-slate-800 py-0 bg-[#252E3A80]/50">
      <CardContent className=" bg-[#252E3A80]/50 p-0">
        <div className="overflow-hidden">
          <table className="w-full ">
            <thead className="bg-[#111C2F]  rounded-t-md">
              <tr className="">
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Description</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y ">
              {transactions.map((transaction, index) => (
                <tr key={index} className="">
                  <td className="px-4 py-3 text-sm text-slate-300">{transaction.date}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{transaction.description}</td>
                  <td className="px-4 py-3 text-right text-sm text-slate-300">{transaction.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
