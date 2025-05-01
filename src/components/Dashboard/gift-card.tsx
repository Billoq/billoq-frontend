import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function GiftCard() {
  return (
    <Card className="border-slate-800 bg-slate-900/50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-900/50">
              <Image src="/placeholder.svg?height=48&width=48" alt="Gift" width={48} height={48} className="h-8 w-8" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-purple-400">Gift your Friends and family subscription</h3>
              <p className="mt-1 text-sm text-slate-400">
                Share love your friends and family gift them with any type of subscription you wish
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Gift Now</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
