import { TSPM } from "@/components/Charts/TSPM-overview";
import { UsedDevices } from "@/components/Charts/used-devices";
import { WeeksProfit } from "@/components/Charts/weeks-profit";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense, useEffect, useState } from "react";
import { ChatsCard } from "./(home)/_components/chats-card";
import { OverviewCardsGroup } from "./(home)/_components/overview-cards";
import { OverviewCardsSkeleton } from "./(home)/_components/overview-cards/skeleton";
import { RegionLabels } from "./(home)/_components/region-labels";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/dist/client/components/redirect";
import { UsersTable } from "@/components/Users/Table";
import { TSIPM } from "@/components/Charts/TSIPM-overview";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Home({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);
  const session = await getServerSession(authOptions);
  
  if (!session) redirect("/");

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <TSPM
          className="col-span-12 xl:col-span-7"
         
          
        />   <WeeksProfit
          key={extractTimeFrame("weeks_profit")}
          timeFrame={extractTimeFrame("weeks_profit")?.split(":")[1]}
          className="col-span-12 xl:col-span-5"
        />
        <TSIPM
          className="col-span-12 xl:col-span-7"
         
          
        />

        <WeeksProfit
          key={extractTimeFrame("weeks_profit")}
          timeFrame={extractTimeFrame("weeks_profit")?.split(":")[1]}
          className="col-span-12 xl:col-span-5"
        />

        <UsedDevices
          className="col-span-12 xl:col-span-5"
          key={extractTimeFrame("used_devices")}
          timeFrame={extractTimeFrame("used_devices")?.split(":")[1]}
        />

        <RegionLabels />

        <div className="col-span-12 grid xl:col-span-8">
          <UsersTable />
        </div>

        <Suspense fallback={null}>
          <ChatsCard />
        </Suspense>
      </div>
    </>
  );
}
