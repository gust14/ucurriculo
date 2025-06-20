import { createClient } from 'redis';

// O cliente é criado aqui fora para ser reutilizado entre as requisições,
// o que é mais eficiente. A URL é lida automaticamente da variável de ambiente.
const redisClient = createClient({
    url: process.env.REDIS_URL
});

// Adiciona um "ouvinte" de erros para o caso de a conexão com o Redis cair.
redisClient.on('error', (err) => {
    console.error('Erro no Cliente Redis:', err);
});

// Conecta ao Redis. A Vercel gerencia o cache dessa conexão.
// A conexão é feita apenas uma vez e reutilizada.
await redisClient.connect();

export default async function handler(request, response) {
    try {
        // Se a requisição for um 'POST', incrementamos o contador.
        if (request.method === 'POST') {
            // O comando 'incr' do node-redis para somar 1.
            const downloads = await redisClient.incr('downloads');
            return response.status(200).json({ downloads });
        }
        // Para qualquer outro tipo de requisição (como 'GET'), apenas lemos o valor.
        else {
            // O comando 'get' para buscar o valor.
            const downloads = await redisClient.get('downloads');
            // Se o contador nunca foi incrementado (chave não existe), o valor será 'null'.
            // Nesse caso, retornamos 0.
            return response.status(200).json({ downloads: Number(downloads) || 0 });
        }
    } catch (error) {
        console.error('Erro na API do contador:', error);
        return response.status(500).json({ error: 'Erro interno do servidor.' });
    }
}