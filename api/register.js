export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, phone } = req.body;

  if (!email || !firstName || !lastName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const GC_API_KEY = '73f5c85ded8e55bbee19cef706770ddca40bd1edaa18a4f63164a0341ad28428';
  const TAG_ID = '6a0ce7aa923e61233052f9ba'; // web-dream tag

  try {
    // Fire tag - this automatically creates/updates the contact
    const tagResponse = await fetch(`https://api.globalcontrol.io/api/ai/tags/fire-tag/${TAG_ID}`, {
      method: 'POST',
      headers: {
        'X-API-KEY': GC_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        phone: phone || ''
      })
    });

    if (!tagResponse.ok) {
      const errorData = await tagResponse.json();
      throw new Error(`Tag fire failed: ${tagResponse.status} - ${JSON.stringify(errorData)}`);
    }

    const result = await tagResponse.json();

    return res.status(200).json({ 
      success: true,
      message: 'Registration successful',
      data: result
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      error: 'Registration failed',
      message: error.message 
    });
  }
}
