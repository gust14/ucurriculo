// ucurriculo/api/counter.js

import { kv } from '@vercel/kv';

// Esta função 'handler' é a nossa API. Ela será executada nos servidores da Vercel.
export default async function handler(request, response) {

  try {
    // Se a requisição for um 'POST', nós incrementamos o contador.
    if (request.method === 'POST') {
      // O comando 'incr' é a forma mais segura de somar 1, evitando erros.
      const downloads = await kv.incr('downloads');
      return response.status(200).json({ downloads });
    }

    // Para qualquer outro tipo de requisição (como 'GET'), nós apenas lemos o valor.
    else {
      const downloads = await kv.get('downloads');
      // Se o contador nunca foi incrementado, ele pode ser nulo. Retornamos 0 nesse caso.
      return response.status(200).json({ downloads: downloads || 0 });
    }

  } catch (error) {
    // Se houver qualquer erro de conexão com o banco, retornamos um erro 500.
    return response.status(500).json({ error: error.message });
  }
}