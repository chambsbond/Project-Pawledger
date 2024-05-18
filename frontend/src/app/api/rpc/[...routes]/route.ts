import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { routes: string[] } }
) {
  // const apiUrl = "https://arb-sepolia.g.alchemy.com/v2/ktAimmXFK-XpEJSjR5wvccGBvFT-RQsU";
  const apiUrl = "https://api.g.alchemy.com";
  const apiKey = process.env.ALCHEMY_API_KEY;
  console.log(apiKey);

  if (apiKey == null) {
    return NextResponse.json(
      { error: "ALCHEMY_API_KEY is not set" },
      { status: 500 }
    );
  }

  const body = await req.json();

  const res = await fetch(apiUrl + `/${params.routes.join("/")}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...req.headers,
    },
    body: JSON.stringify(body),
  });

  console.log(res);
  if (!res.ok) {
    return NextResponse.json(await res.json().catch((e) => ({})), {
      status: res.status,
    });
  }

  return NextResponse.json(await res.json());
}
