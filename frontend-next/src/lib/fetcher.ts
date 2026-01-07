const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`);
  
  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }
  
  const json = await res.json();
  return json.data;
}

export async function fetchWithBody<T, B>(
  url: string, 
  method: 'POST' | 'PUT' | 'DELETE',
  body?: B
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }
  
  const json = await res.json();
  return json.data;
}
