import type { Request, Response } from "express";
import Note, { INote } from "../models/Note";
import { Types } from "mongoose";

type NoteType = {
  noteId: Types.ObjectId;
};

export class NoteController {
  static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
    const { content } = req.body;

    const note = new Note();
    note.content = content;
    note.createBy = req.user.id;
    note.task = req.task.id;

    req.task.notes.push(note.id);

    try {
      await Promise.allSettled([req.task.save(), note.save()]);
      res.send("Tarea creada correctamente");
    } catch (error) {
      return res.status(500).json({ error: "hubo un error" });
    }
  };

  static getTaskNote = async (req: Request, res: Response) => {
    try {
      const note = await Note.find({ task: req.task.id });
      res.json(note);
    } catch (error) {
      return res.status(500).json({ error: "hubo un error" });
    }
  };

  static deleteTaskNote = async (req: Request<NoteType>, res: Response) => {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);
    
    if (!note) {
      const error = new Error("Nota no encontrada");
      return res.status(404).json({ error: error.message });
    }
    if (note.createBy.toString() !== req.user.id.toString()) {
      const error = new Error("Accion no valida");
      return res.status(404).json({ error: error.message });
    }

    req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString())

    try {
      await Promise.allSettled([req.task.save(), note.deleteOne()])
      res.send('Nota eliminada')
    } catch (error) {
      return res.status(500).json({ error: "hubo un error" });
    }
  };
}
