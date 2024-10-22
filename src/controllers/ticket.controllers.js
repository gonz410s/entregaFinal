
import { ticketService } from '../services/ticket.service.js';

export async function postController(req, res, next) {
    try {
        const amount = req.body;
        const ticket = await ticketService.createTicket(amount);

        res.json({ status: 'success', message: 'compra realizada' });
    } catch (error) {
        console.error(error); 
        res.status(500).json({
            status: 'ticket error',
            message: error.message,
        });
    }
}
