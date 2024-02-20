'use server'
import { gql } from '../../app/grafbase'
import { formatDollarAmount, formatUnits } from '@/lib/helpers';
import { Card, Metric, Text, Title, AreaChart, BadgeDelta, Flex, DeltaType, Grid } from "@tremor/react";
import { NetworkData, DataItem, HoldingData, DataReturnType, TokenPrice } from '@/lib/types';


async function fetchPrice(): Promise<TokenPrice[]> {
  try {
    const res = await fetch('https://api.geckoterminal.com/api/v2/simple/networks/evmos/token_price/0x2C68D1d6aB986Ff4640b51e1F14C716a076E44C4%2C0xd4949664cd82660aae99bedc034a0dea8a0bd517', { next: { revalidate: 300 } })
    if (!res.ok) {
      return []; // Return an empty array if fetch fails
    }
    const data = await res.json();
    const tokenPrices = data.data.attributes.token_prices

    const tokenMapping: { [key: string]: string } = {
      '0x2c68d1d6ab986ff4640b51e1f14c716a076e44c4': 'stEVMOS',
      '0xd4949664cd82660aae99bedc034a0dea8a0bd517': 'EVMOS'
    };
    const tokenPricesArray = Object.entries(tokenPrices).map(([key, value]) => ({
      token: tokenMapping[key],
      price: Number(value)
    }));

    return tokenPricesArray;
  } catch (error) {
    console.log(error);
    return []; // Return an empty object if an error occurs
  }
}
async function getData(): Promise<DataReturnType> {
  try {
    const res = await fetch(`https://api.covalenthq.com/v1/evmos-mainnet/address/0x21708707f03A19C3a4ea5E1a132B5cF96b86F294/portfolio_v2/?days=30&key=${process.env.GRAPH_ONE_KEY2}`, { next: { revalidate: 600 } })
    if (!res.ok) {
      return { holdings: [] }; // Return an empty object if fetch fails
    }

    const data = await res.json();

    // Filter items where contract_ticker_symbol is 'stEVMOS'
    const filteredItems = data.data.items.filter((item: any) => item.contract_ticker_symbol === 'stEVMOS');

    // Construct new object with only required properties
    const result = {
      address: data.data.address,
      updated_at: data.data.updated_at,
      holdings: filteredItems.flatMap((item: any) =>
        item.holdings.map((holding: any) => {
          const closeValue = parseFloat(formatUnits(holding.close.balance, 18));
          return {
            close: closeValue < 0 ? 0 : closeValue, // Set close to 0 if it's negative
            timestamp: new Date(holding.timestamp).toISOString().split('T')[0] // Format the timestamp
          };
        })
      )
    };
    return result;
  } catch (error) {
    console.error(error);
    return { holdings: [] }; // Return an object with an empty holdings array if an error occurs
  }
}
async function getCachedMarket() {
  const res = await fetch('https://wnr1c6qx6jcz9qde.public.blob.vercel-storage.com/data/cachedMarket.1705622400.json')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default async function KPICards() {
  const cachedMarketResponse = await fetch('https://wnr1c6qx6jcz9qde.public.blob.vercel-storage.com/data/cachedMarket.1705622400.json');
  const cachedMarket = await cachedMarketResponse.json();

  const query = `{ arkiver2 { DayProducts(filter: { _operators: {date:{gte: 1705622400 }}, chainId: 9001} sort: DATE_DESC limit: 500) { date cumulativeVolumeUsd cumulativeFeesUsd positionCount tradeCount } } }`
  const data = await getData()
  const priceData = await fetchPrice()
  const stData = priceData.find(token => token.token === 'stEVMOS') as TokenPrice;

  const stDataPrice = stData ? stData.price : 0;

  const networkdata = await gql(query) as { arkiver2: { DayProducts: NetworkData[] } };
  // const pooldata = await gql2() as { data: { items: holdings[] } };  
  const mergedCachedData = [...networkdata?.arkiver2?.DayProducts, ...cachedMarket?.DayProducts];
const networkDataArray: NetworkData[] = mergedCachedData.sort((a, b) => a.date - b.date);

const networkDataObject = networkDataArray.reduce<{ [key: string]: NetworkData }>((acc, item: NetworkData) => {
      const date = new Date(item.date * 1000); // Convert epoch to milliseconds
    const dateString = date.toISOString().split('T')[0]; // Get the date part of the ISO string
    acc[dateString] = item;
    return acc;
  }, {});

  const netdata: DataItem[] = networkDataArray.map(item => ({
    day: new Date(item.date * 1000).toISOString().split('T')[0],
    vol: item.cumulativeVolumeUsd,
    activity: item.tradeCount + item.positionCount,
    rev: item.cumulativeFeesUsd * 0.75,
    tvl: 0, // Placeholder for now
  }));

  const holdingsData = data.holdings.map((item: HoldingData) => ({
    day: item.timestamp,
    tvl: (item.close * stDataPrice),
    vol: item.vol || 0,
    activity: item.activity || 0,
    rev: item.rev || 0,
  })).reverse();

  const mergedData = netdata.map(item => ({
    ...item,
    tvl: holdingsData.find((h: { day: string; tvl: string | number }) => h.day === item.day)?.tvl || 0,
  }));
  const titleMap = {
    'vol': 'Volume (USD)',
    'tvl': 'Collateral Pool (USD)',
    'activity': 'Market Pulse',
    'rev': 'Est. Protocol Rev.'
  };
  function sumDuplicates(data: DataItem[], key: string) {
    return data.reduce((acc: { [key: string]: number }, item: DataItem) => {
      if (acc[item.day]) {
        acc[item.day] += Number(item[key]);
      } else {
        acc[item.day] = Number(item[key]);
      }
      return acc;
    }, {});
  }
  const categories = ['vol', 'tvl', 'activity', 'rev'].map(id => {
    const summedData = sumDuplicates(mergedData, id);
    const dates = Object.keys(summedData).sort();

    const thisWeekData = dates.slice(-30).map(date => ({ day: date, [id]: summedData[date] }));
    const lastWeekData = dates.slice(-60, -30).map(date => ({ day: date, [id]: summedData[date] }));
    // For 'tvl', metric is the latest data point from close
    const metric = id === 'tvl' ? holdingsData[holdingsData.length - 1].tvl : thisWeekData.reduce((sum, item: { [x: string]: string | number; day: string; }) => sum + Number(item[id]), 0);

    const metricPrev = id === 'tvl' ? holdingsData[holdingsData.length - 31].tvl : lastWeekData.reduce((sum, item: { [x: string]: string | number; day: string; }) => sum + Number(item[id]), 0);

    let delta: number = metricPrev !== 0 ? ((metric - metricPrev) / metricPrev) * 100 : 0;
    let deltaDisplay: string = metricPrev !== 0 ? `${delta.toFixed(1)}%` : "N/A";
    let deltaType = 'unchanged';
    if (delta > 0) {
      deltaType = delta > 10 ? 'increase' : 'moderateIncrease';
    } else if (delta < 0) {
      deltaType = delta < -10 ? 'decrease' : 'moderateDecrease';
    }

    let formattedMetric = id === 'activity' ? metric.toString() : formatDollarAmount(metric);
    let formattedMetricPrev = id === 'activity' ? metricPrev.toString() : formatDollarAmount(metricPrev);

    return {
      id,
      title: titleMap[id as keyof typeof titleMap],
      metric: formattedMetric,
      metricPrev: formattedMetricPrev,
      delta: `${delta.toFixed(0)}%`,
      deltaType,
    };
  });


  // console.log(categories)
  // console.log(typeof categories)

  return (
    <Grid numItemsSm={2} numItemsMd={2} numItemsLg={4} className="gap-6 mt-6">
      {categories.map((item) => {
        // Get the date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 32);
  
        // Filter the data
        const filteredData = item.id === 'tvl' ? holdingsData : netdata;
        const filteredDataMapped = filteredData.map(({ day, tvl, vol = 0, activity = 0, rev = 0 }) => ({ day, tvl, vol, activity, rev }));
        const last30DaysData = filteredDataMapped.filter(dataItem => new Date(dataItem.day) >= thirtyDaysAgo);
        const summedData = last30DaysData.reduce((acc: { day: string; tvl: number; vol: number; activity: number; rev: number; }[], item: { day: string; tvl: number; vol: number; activity: number; rev: number; }) => {
          const existingItem = acc.find(accItem => accItem.day === item.day);
          if (existingItem) {
            existingItem.tvl += item.tvl;
            existingItem.vol += item.vol;
            existingItem.activity += item.activity;
            existingItem.rev += item.rev;
          } else {
            acc.push({ ...item });
          }
          return acc;
        }, []);
        return (
          <Card key={item.id}>
            <Flex alignItems="start">
              <Title className="text-[1.1rem]">{item.title}</Title>
              <BadgeDelta deltaType={item.deltaType}>{item.delta}</BadgeDelta>
            </Flex>
            <Flex className="mt-2 space-x-3 truncate" justifyContent="start" alignItems="baseline">
              <Metric className="font-mono">{item.metric}</Metric>
              <Text className="uppercase tracking-wide">from {item.metricPrev}</Text>
            </Flex>
            <AreaChart
              className="marketcharts mt-6 h-28"
              data={summedData} // Use the filtered data
              index="day"
              categories={[item.id]}
              colors={["orange"]}
              showXAxis={true}
              showGridLines={false}
              startEndOnly={true}
              showYAxis={false}
              showLegend={false}
              showTooltip={true}
              showGradient
              showAnimation
              animationDuration={1800}
              
            />
          </Card>
        );
      })}
    </Grid>
  );
}