"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { toast } from 'react-toastify';

export function GiftCard() {
  const handleGiftClick = () => {
    toast.success('Gift subscription initiated!');
    // Add your actual gift logic here
  };

  return (
    <Card className="border-slate-800 bg-slate-900/50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full">
              <Image 
                src="/gift.png" 
                alt="Gift" 
                width={60} 
                height={60} 
                className="h-[60px] w-[60px]" 
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium bg-gradient-to-r from-[#60A5FA] via-[#FD84D4] to-[#4A79FF] text-transparent bg-clip-text">
                Gift your Friends and family subscription
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Share love your friends and family gift them with any type of subscription you wish
              </p>
            </div>
            <Button 
              className="bg-[#1B89A4] hover:bg-[#1B89A4]/80 text-white cursor-pointer"
              onClick={handleGiftClick}
            >
              Gift Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}