import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import Whatsapp from "../models/Whatsapp";
import Ticket from "../models/Ticket"; // Importe o modelo de Ticket

type HeaderParams = {
  Bearer: string;
};

const tokenAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    const whatsapp = await Whatsapp.findOne({ where: { token } });

    if (whatsapp) {
      // Recuperar o último ticketId associado a este Whatsapp
      const lastTicket = await Ticket.findOne({
        where: { whatsappId: whatsapp.id },
        order: [['createdAt', 'DESC']] // Ordena pelos tickets mais recentes
      });

      if (lastTicket) {
        req.user = {
          whatsappId: whatsapp.id.toString(),
          companyId: whatsapp.companyId.toString(), // Supondo que companyId esteja disponível no modelo Whatsapp
          lastTicketId: lastTicket.id.toString(),
          // Adicione outras chaves estrangeiras, se necessário
        }
      } else {
        throw new Error("Não foi encontrado nenhum ticket associado a este Whatsapp.");
      }
    } else {
      throw new Error("Whatsapp não encontrado.");
    }
  } catch (err) {
    throw new AppError(
      "Acesso não permitido",
      401
    );
  }

  return next();
};

export default tokenAuth;
