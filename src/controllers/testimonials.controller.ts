import { Request, Response } from 'express';
import * as TestimonialService from '../services/testimonials.service.js';
import { createTestimonialSchema, updateTestimonialSchema } from '../schemas/testimonials.schema';

/**
 * Controlador para a criação de um novo depoimento.
 * Responsável por lidar com a requisição HTTP POST, validar os dados de entrada
 * e chamar a camada de serviço para criar o recurso no banco de dados.
 * @param req - O objeto de requisição do Express, contendo o corpo (body) com os dados do depoimento.
 * @param res - O objeto de resposta do Express, usado para enviar a resposta ao cliente.
 */
export const createTestimonial = async (req: Request, res: Response) => {
    try {
        // 1. Validação: O corpo da requisição (req.body) é validado contra o schema do Zod.
        // `safeParse` é usado para não lançar um erro, mas sim retornar um objeto com o resultado.
        const validation = createTestimonialSchema.safeParse(req.body);
        if (!validation.success) {
            // Se a validação falhar, retorna um status 400 (Bad Request) com os detalhes do erro.
            // Isso informa ao cliente exatamente quais campos estão incorretos.
            return res.status(400).json({ error: validation.error.format() });
        }

        // 2. Chamada ao Serviço: Se a validação passar, os dados validados (validation.data) são enviados
        // para a função `createTestimonial` no serviço, que contém a lógica de negócio.
        const testimonial = await TestimonialService.createTestimonial(validation.data);

        // 3. Resposta de Sucesso: Retorna um status 201 (Created), que é o padrão para criação de novos
        // recursos, e envia o objeto do depoimento recém-criado de volta para o cliente.
        res.status(201).json(testimonial);
    } catch (e: any) {
        // 4. Tratamento de Erro: Se ocorrer qualquer erro inesperado durante o processo (ex: falha no banco de dados),
        // ele é capturado aqui. Logamos o erro no console para depuração.
        console.error("Error creating testimonial:", e);
        // E retornamos um erro genérico 500 (Internal Server Error) para o cliente.
        res.status(500).json({ error: 'Failed to create testimonial.' });
    }
};

/**
 * Controlador para buscar todos os depoimentos.
 * Lida com a requisição GET para listar todos os recursos.
 */
export const getTestimonials = async (_req: Request, res: Response) => {
    try {
        // Delega a busca de todos os depoimentos para a camada de serviço.
        const testimonials = await TestimonialService.getTestimonials();
        // Retorna a lista de depoimentos com um status 200 (OK).
        res.json(testimonials);
    } catch (e: any) {
        console.error("Error fetching testimonials:", e);
        res.status(500).json({ error: 'Failed to fetch testimonials.' });
    }
};

/**
 * Controlador para buscar um depoimento específico pelo seu ID.
 * Lida com a requisição GET para um recurso específico.
 */
export const getTestimonialById = async (req: Request, res: Response) => {
    try {
        // Extrai o `id` dos parâmetros da URL (ex: /api/admin/testimonials/some-id-123).
        const { id } = req.params;
        // Chama o serviço para buscar o depoimento pelo ID fornecido.
        const testimonial = await TestimonialService.getTestimonialById(id);

        // Se o serviço retornar `null`, significa que o depoimento não foi encontrado.
        if (!testimonial) {
            // Retornamos um status 404 (Not Found) para indicar que o recurso não existe.
            return res.status(404).json({ error: 'Testimonial not found' });
        }

        // Se encontrado, retorna o objeto do depoimento.
        res.json(testimonial);
    } catch (e: any) {
        console.error(`Error fetching testimonial ${req.params.id}:`, e);
        res.status(500).json({ error: 'Failed to fetch testimonial.' });
    }
};

/**
 * Controlador para atualizar um depoimento existente.
 * Lida com a requisição PUT para modificar um recurso.
 */
export const updateTestimonial = async (req: Request, res: Response) => {
    try {
        // Extrai o ID da URL e os dados para atualização do corpo da requisição.
        const { id } = req.params;
        const validation = updateTestimonialSchema.safeParse(req.body);

        // Valida os dados de entrada.
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.format() });
        }

        // Chama o serviço para realizar a atualização.
        const updatedTestimonial = await TestimonialService.updateTestimonial(id, validation.data);

        // Se o serviço retornar `null`, o depoimento com o ID fornecido não existe.
        if (!updatedTestimonial) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }

        // Retorna o depoimento atualizado.
        res.json(updatedTestimonial);
    } catch (e: any) {
        console.error(`Error updating testimonial ${req.params.id}:`, e);
        res.status(500).json({ error: 'Failed to update testimonial.' });
    }
};

/**
 * Controlador para deletar um depoimento.
 * Lida com a requisição DELETE para remover um recurso.
 */
export const deleteTestimonial = async (req: Request, res: Response) => {
    try {
        // Extrai o ID do depoimento a ser deletado da URL.
        const { id } = req.params;
        // Chama o serviço para deletar o depoimento. O serviço retorna `true` se foi deletado, `false` se não foi encontrado.
        const wasDeleted = await TestimonialService.deleteTestimonial(id);

        // Se o item não foi encontrado para ser deletado, retorna 404.
        if (!wasDeleted) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }

        // Se a exclusão for bem-sucedida, retorna um status 204 (No Content).
        // Este status indica sucesso e que não há conteúdo no corpo da resposta.
        res.status(204).send(); // Envia 204 No Content apenas se a exclusão foi bem-sucedida.
    } catch (e: any) {
        console.error(`Error deleting testimonial ${req.params.id}:`, e);
        res.status(500).json({ error: 'Failed to delete testimonial.' });
    }
};