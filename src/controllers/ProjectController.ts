import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);

    //asignar manager al proyecto
    project.manager = req.user.id;

    try {
      await project.save();
      res.send("Proyecto Creando con Exito");
    } catch (error) {
      console.log(error);
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const project = await Project.find({
        $or: [
          { manager: { $in: req.user.id } },
          { team: { $in: req.user.id } },
        ],
      });
      res.json(project);
    } catch (error) {
      console.log(error);
    }
  };
  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id).populate("tasks");
      if (!project) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ error: error.message });
      }

      if (
        project.manager.toString() !== req.user.id &&
        !project.team.includes(req.user.id)
      ) {
        const error = new Error("Accion no valida");
        return res.status(404).json({ error: error.message });
      }

      res.json(project);
    } catch (error) {
      console.log(error);
    }
  };
  static updateProject = async (req: Request, res: Response) => {
    try {
      req.project.description = req.body.description;
      req.project.clientName = req.body.clientName;
      req.project.projectName = req.body.projectName;

      await req.project.save();
      res.send("proyecto actualizado");
    } catch (error) {
      console.log(error);
    }
  };
  static deleteProject = async (req: Request, res: Response) => {
    try {
      await req.project.deleteOne();
      res.send("proyecto eliminado");
    } catch (error) {
      console.log(error);
    }
  };
}
