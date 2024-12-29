import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log('Recipe API route called');
  
  try {
    const { ingredients } = await request.json();
    console.log('Received ingredients:', ingredients);

    if (!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
      console.error('OpenRouter API key not configured');
      return NextResponse.json(
        { error: { message: 'API configuration error' } },
        { status: 500 }
      );
    }

    console.log('Attempting OpenRouter API call...');
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        "X-Title": "Pantry Manager",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen-2-7b-instruct:free",
        messages: [
          {
            role: "user",
            content: `Given these ingredients: ${ingredients}, suggest 3 possible recipes that could be made. For each recipe, include:
              1. Recipe name
              2. Required ingredients (marking which ones the user has from their pantry)
              3. Brief cooking instructions
              Please format nicely with clear sections.`,
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();

    if (response.status === 429) {
      console.error('Rate limit exceeded');
      return NextResponse.json(
        { 
          error: { message: 'Rate limit exceeded' },
          code: 429 
        },
        { status: 429 }
      );
    }

    if (!response.ok) {
      console.error('OpenRouter API error:', {
        status: response.status,
        data: data
      });
      return NextResponse.json(
        { error: { message: data.error?.message || 'API error' } },
        { status: response.status }
      );
    }

    console.log('OpenRouter API response received');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Recipe API route error:', error);
    return NextResponse.json(
      { error: { message: error.message || 'Internal server error' } },
      { status: 500 }
    );
  }
}
