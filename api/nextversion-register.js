export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, phone } = req.body;

  // Validation
  if (!email || !firstName || !lastName) {
    return res.status(400).json({ 
      success: false,
      error: 'Missing required fields',
      message: 'First name, last name, and email are required' 
    });
  }

  // Global Control API credentials
  const GC_API_KEY = '73f5c85ded8e55bbee19cef706770ddca40bd1edaa18a4f63164a0341ad28428';
  const TAG_ID = '6a1f06529623b6235f2f0386'; // Int-Free Training tag

  try {
    // Fire tag to Global Control
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
      const errorData = await tagResponse.json().catch(() => ({}));
      console.error('Tag fire failed:', tagResponse.status, errorData);
      throw new Error(`Global Control API error: ${tagResponse.status}`);
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
      success: false,
      error: 'Registration failed',
      message: error.message 
    });
  }
}
