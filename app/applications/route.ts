import html from '../../lib/applications.html?raw';
const celebration=(s:string)=>s.replace('</head>','<link rel="stylesheet" href="/madar100.css"></head>').replace('</body>','<script src="/madar100.js" defer></script></body>');
export function GET(){return new Response(celebration(html.replace('<head>','<head><base href="/">')),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'}});}
