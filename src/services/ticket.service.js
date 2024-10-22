
import { getDaoTicket } from '../dao/ticket/ticket.dao.js';
import { transport } from '../config.js';

const ticketDao = getDaoTicket();

class TicketService {
    async createTicket(datos) {
        const ticket = await ticketDao.createTicket(datos);
        this.sendTicketMail(ticket);
        return ticket;
    }

    async sendTicketMail(ticket) {
        const mail = ticket.purchaser;
        try {
            let result = await transport.sendMail({
                from: '<gonz410@outlook.com>',
                to: mail,
                subject: 'resumen de compra',
                html: `
                        <div>
                            <h1>total de compra: $${ticket.amount}</h1>
                            <h3>codigo de compra :${ticket.code}
                        </div>
                            `,
                attachments: [],
            });

            return result;
        } catch (error) {
            return error;
        }
    }
}

export const ticketService = new TicketService();