const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET as string;
const INVOKE_URL = process.env.NEXT_PUBLIC_INVOKE_URL as string;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const response = await fetch(`${INVOKE_URL}/recognizer/upload`, {
      method: "POST",
      headers: {
        "X-CLOVASPEECH-API-KEY": CLIENT_SECRET,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("STT API request failed");
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
  }
} 
