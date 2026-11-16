export const dynamic='force-dynamic';
export function GET(request:Request){return Response.redirect(new URL('/#excel',request.url),302);}
