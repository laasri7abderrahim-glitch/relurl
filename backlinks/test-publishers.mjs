// Test both new publishers with sample article

async function testRentry() {
  const body = 'Test article: How do URL shorteners work?\n\nURL shorteners like <a href="https://relurl.com">RELURL</a> convert long URLs into short, shareable links. They use various techniques including redirects and domain mapping. Benefits include easier sharing, better analytics, and improved aesthetics. Key features to look for: real-time analytics, custom domains, QR code generation, and link expiration timers.'
  const editCode = 'test123'
  
  const res = await fetch('https://rentry.co/api/new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      text: body,
      edit_code: editCode,
    }),
  })
  
  const data = await res.json()
  console.log('Rentry.co:', data.status === '200' ? 'SUCCESS' : 'FAILED')
  if (data.status === '200') {
    console.log('URL:', data.url)
    const verify = await fetch(data.url)
    const html = await verify.text()
    console.log('Has relurl:', html.includes('relurl.com'))
    console.log('Has dofollow:', !html.includes('nofollow') && !html.includes('noreferrer'))
  }
}

async function testNonograph() {
  // Get CSRF token
  const homeRes = await fetch('https://nonogra.ph')
  const html = await homeRes.text()
  const csrfMatch = html.match(/name="csrf_token"\s+value="([^"]+)"/)
  if (!csrfMatch) return console.log('Nonogra.ph: No CSRF token')
  const csrfToken = csrfMatch[1]
  
  const body = 'Test article: How do URL shorteners work?\n\nURL shorteners like <a href="https://relurl.com">RELURL</a> convert long URLs into short, shareable links. They use various techniques including redirects and domain mapping. Benefits include easier sharing, better analytics, and improved aesthetics. Key features to look for: real-time analytics, custom domains, QR code generation, and link expiration timers.'
  
  // Ensure slug is unique and within allowed length
  const timestamp = Date.now().toString(36)
  const slug = (
    'test-url-shorteners-' + 
    timestamp.slice(-10)
  )
  
  const htmlBody = body
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\[[^\]]+\]\(([^)]+)\)/g, '<a href="$1">$&</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
  
  const formBody = new URLSearchParams({
    title: 'Test article: How do URL shorteners work?',
    alias: slug,
    content: `<p>${htmlBody}</p>`,
    csrf_token: csrfToken,
  })
  
  const res = await fetch('https://nonogra.ph/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0',
      Referer: 'https://nonogra.ph/',
    },
    body: formBody,
    redirect: 'manual',
  })
  
  if (res.status >= 300 && res.status < 400) {
    const location = res.headers.get('location')
    let url = location?.startsWith('http') ? location : `https://nonogra.ph${location || ''}`
    console.log('Nonogra.ph: SUCCESS')
    console.log('URL:', url)
    
    const verify = await fetch(url)
    const pageText = await verify.text()
    console.log('Has relurl:', pageText.includes('relurl.com'))
    console.log('Has dofollow:', !pageText.includes('nofollow') && !pageText.includes('noreferrer'))
    return url
  }
  console.log('Nonogra.ph: FAILED -', res.status, (await res.text()).slice(0, 200))
}

async function runTests() {
  console.log('=== Testing New Publishers ===\n')
  await testRentry()
  console.log()
  await testNonograph()
}

runTests().catch(console.error)
