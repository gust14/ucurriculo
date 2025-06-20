import { createClient } from 'redis';

// Criei o cliente Redis aqui, fora do handler.
// Ele será reutilizado em todas as invocações da função.
const redisClient = createClient({
    url: process.env.REDIS_URL
});

// Pega erros para o caso de a conexão com o Redis cair.
redisClient.on('error', (err) => {
    console.error('Erro no Cliente Redis:', err);
});

// Garantimos que a conexão seja feita apenas uma vez.
// A Vercel mantém a função "quente" por um tempo, então não precisamos reconectar a cada chamada.
if (!redisClient.isOpen) {
    redisClient.connect();
}

export default async function handler(request, response) {
    try {
        // Se a requisição for um 'POST', incrementamos o contador.
        if (request.method === 'POST') {
            const downloads = await redisClient.incr('downloads');
            return response.status(200).json({ downloads });
        }
        // Para qualquer outro tipo de requisição (como 'GET'), apenas lemos o valor.
        else {
            const downloads = await redisClient.get('downloads');
            // Se a chave não existir, o Redis retorna null. Tratamos como 0.
            return response.status(200).json({ downloads: Number(downloads) || 0 });
        }

    } catch (error) {
        console.error('Erro na API do contador:', error);
        return response.status(500).json({ error: 'Erro interno do servidor.' });
    }
}