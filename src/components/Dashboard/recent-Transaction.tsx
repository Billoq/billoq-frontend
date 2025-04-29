import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
];

export function RecentTransactions() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-300">
          Recent Transactions
        </h2>
        <Link
          href="/transactions"
          className="text-sm font-medium text-blue-400"
        >
          View All
        </Link>
      </div>

      <Card className=" py-0 border-0 bg-[#252E3A80]/50 rounded-t-2xl">
        <CardContent className=" bg-[#252E3A80]/50 p-0  rounded-t-2xl">
          <div className="overflow-hidden">
            <table className="w-full ">
              <thead className="bg-[#111C2F]  rounded-t-2xl">
                <tr className="">
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className=" ">
                {transactions.map((transaction, index) => (
                  <>
                    <tr key={index}>
                      <td className="px-4 py-5 text-sm text-slate-300">
                        {transaction.date}
                      </td>
                      <td className="px-4 py-5 text-sm text-slate-300">
                        {transaction.description}
                      </td>
                      <td className="px-4 py-5 text-right text-sm text-slate-300">
                        {transaction.amount}
                      </td>
                    </tr>
                    {/* Spacer Line Row */}
                    {index !== transactions.length - 1 && (
                      <tr>
                        <td colSpan={3}>
                          <div className="h-[1px] mx-4 bg-[#42556C]"></div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
