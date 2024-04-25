import { NextRequest, NextResponse } from "next/server";
// import rateLimit from "../../../lib/rateLimit";
import { NextApiResponse } from "next";

// const limiter = rateLimit({
//   interval: 60 * 1000, // 60 seconds
//   uniqueTokenPerInterval: 500, // Max 500 users per second
// });

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    //await limiter.check(res, 10, "CACHE_TOKEN"); // 10 requests per minute
    const uniswapGraphQuery = `query {
        pools(orderBy: id) {
          token0 {
            symbol
          }
          token1 {
            symbol
          }
          txCount
          volumeUSD
          liquidity
          totalValueLockedUSD
        }
      }`;
    const { subgraphType } = (await req.json()) as {
      subgraphType: string;
    };
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: uniswapGraphQuery,
      }),
      next: { revalidate: 3600 }
    };
    const response = await fetch(`https://api.thegraph.com/subgraphs/name/${subgraphType}`, options);
    const queryResult = await response.json();

    const resData = queryResult?.data?.pools;
    const returnData = [];
    for (let i = 0; i < resData.length; i++) {
      let pool = resData[i];
      if (pool.token0.symbol.length > 8 || pool.token1.symbol.length > 8)
        continue;
      let newPool = {
        token0: pool.token0.symbol,
        token1: pool.token1.symbol,
        txCount: pool.txCount,
        volumeUSD: Number(pool.volumeUSD).toFixed(4),
        liquidity: Number(pool.liquidity).toFixed(4),
        totalValueLockedUSD: Number(pool.totalValueLockedUSD).toFixed(4)
      }

      returnData.push(newPool);
    }
    return NextResponse.json({ resData: returnData });
  } catch (error) {
    console.log(error);
  }
}
