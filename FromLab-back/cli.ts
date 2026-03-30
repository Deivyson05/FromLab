import fs from "fs";
import inquirer from "inquirer";
import path from "path";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function cli() {
    const entidade = await inquirer.prompt([
        {
            type: "input",
            name: "nome",
            message: "Digite o nome da entidade: "
        }
    ]);

    if(entidade.nome == null) {
        return console.log("Entrada inválida");
    }

    const baseName = entidade.nome.toLowerCase();

    const paths = {
        model: path.join(__dirname, 'src/routes', `${baseName}.routes.ts`),
        controller: path.join(__dirname, 'src/controllers', `${baseName}.controller.ts`),
        service: path.join(__dirname, 'src/services', `${baseName}.service.ts`)
    };

    fs.writeFileSync(paths.model, `
import { Router } from "express";
import { ${entidade.nome}Controller } from "../controllers/${baseName}.controller";
            
const ${baseName}Router = Router();
            
//${baseName}Router.post("/", ${entidade.nome}Controller.createUser);
            
export default ${baseName}Router;
    `);
    fs.writeFileSync(paths.controller, `
import { Request, Response } from "express";
import { HttpError } from "../core/httpError";
import { ${entidade.nome}Service } from "../services/${baseName}.service";
        
export class ${entidade.nome}Controller {
    static async create(req: Request, res: Response) {
        try {
            await ${entidade.nome}Service.create(req.body);
            return res.status(201).json({ message: "created successfully" });
        } catch (err: HttpError | any) {
            console.error("Error:", err);
            return res.status(err.status || 500).json({ error: err.message });
        }
    }
}
    `);
    fs.writeFileSync(paths.service, `
import { prisma } from "../../lib/prisma";
import { HttpError } from "../core/httpError";

export class ${entidade.nome}Service {
    static async create(body: any) {
        //const { name, email, password } = body;

        //if (!name || !email || !password) {
        //    throw new HttpError("Name, email, and password are required", 400);
        //}

        //const ${baseName} = await prisma.${baseName}.create({
        //    data: {
        //        
        //    },
        //    include: {
        //        
        //    },
        //});
    }
}
    `);

    console.log(`Entidade ${entidade.nome} criada com sucesso!`);

}

cli();