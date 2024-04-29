import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import Whatsapp from "../models/Whatsapp";

const tokenAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Verificar se o cabeçalho Authorization está presente e começa com "Bearer "
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Token de acesso não fornecido", 401);
  }

  // Extrair o token do cabeçalho Authorization
  const token = authHeader.replace("Bearer ", "");

  try {
    // Procurar pelo Whatsapp associado ao token
    const whatsapp = await Whatsapp.findOne({ where: { token } });
    if (whatsapp) {
      // Se encontrado, anexar o ID do Whatsapp aos parâmetros da requisição
      req.params = {
        whatsappId: whatsapp.id.toString(),
      };
    } else {
      throw new Error();
    }
  } catch (err) {
    // Em caso de erro ou Whatsapp não encontrado, retornar erro de acesso não permitido
    throw new AppError("Acesso não permitido", 401);
  }

  return next();
};

export default tokenAuth;
