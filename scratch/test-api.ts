import fetch from 'node-fetch';

async function testAPI() {
  try {
    const dummyImage = 'data:image/jpeg;base64,' + Buffer.from('dummy image content of sufficient length ' + 'A'.repeat(200)).toString('base64');
    const res = await fetch('http://localhost:4011/api/detect-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: dummyImage,
        mimeType: 'image/jpeg',
        roomType: 'kitchen'
      })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', data);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testAPI();
