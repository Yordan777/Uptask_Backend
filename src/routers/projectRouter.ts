import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExist } from "../middleware/project";
import { hasAuhtorization, taskBelongsToProject, taskExist } from "../middleware/task";
import { autheticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamMemberController";
import { NoteController } from "../controllers/NoteController";
const router = Router();

router.use(autheticate);

router.post(
  "/",
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description").notEmpty().withMessage("la descripcion es obligatoria"),
  handleInputErrors,
  ProjectController.createProject
);

router.get("/", ProjectController.getAllProjects);
router.get(
  "/:id",
  param("id").isMongoId().withMessage("ID no valido"),
  handleInputErrors,
  ProjectController.getProjectById
);
router.param("projectId", projectExist);

router.put(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID no válido"),
  body("projectName")
    .notEmpty()
    .withMessage("El Nombre del Proyecto es Obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El Nombre del Cliente es Obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripción del Proyecto es Obligatoria"),
  handleInputErrors,
  ProjectController.updateProject
);

router.delete(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID no valido"),
  handleInputErrors,
  ProjectController.deleteProject
);

/* Router for Task */

router.param("taskId", taskExist);
router.param("taskId", taskBelongsToProject);
router.post(
  "/:projectId/task",
  hasAuhtorization,
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("la descripcion de la tarea es obligatoria"),
  handleInputErrors,
  TaskController.createTask
);

router.get("/:projectId/task", TaskController.getProjectTasks);
router.get(
  "/:projectId/task/:taskId",
  param("taskId").isMongoId().withMessage("ID no valido"),
  handleInputErrors,
  TaskController.getTaskById
);

router.put(
  "/:projectId/task/:taskId",
  hasAuhtorization,
  param("taskId").isMongoId().withMessage("ID no valido"),
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("la descripcion de la tarea es obligatoria"),
  handleInputErrors,
  TaskController.updateTask
);

router.delete(
  "/:projectId/task/:taskId",
  hasAuhtorization,
  param("taskId").isMongoId().withMessage("ID no valido"),
  handleInputErrors,
  TaskController.deleteTask
);

router.post(
  "/:projectId/task/:taskId/status",
  param("taskId").isMongoId().withMessage("ID no valido"),
  body("status").notEmpty().withMessage("el estado es obligatorio"),
  handleInputErrors,
  TaskController.updateStatus
);

/**Router for Team */
router.post("/:projectId/team/find",
  body("email").isEmail().toLowerCase().withMessage("E-mail no válido"),
  handleInputErrors,
  TeamMemberController.findMemberByEmail
);

router.get("/:projectId/team", TeamMemberController.GetProjectTeam);

router.post(
  "/:projectId/team",
  body("id").isMongoId().withMessage("ID No válido"),
  handleInputErrors,
  TeamMemberController.AddMemberById
);

router.delete(
  "/:projectId/team/:userId",
  param("userId").isMongoId().withMessage("ID No válido"),
  handleInputErrors,
  TeamMemberController.DeletedMember
);


/** Router for Note */

router.post('/:projectId/task/:taskId/notes',
  body('content').notEmpty().withMessage('El campo del contenido no puede ir vacio'),
  handleInputErrors,
  NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
  handleInputErrors,
  NoteController.getTaskNote
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
  NoteController.deleteTaskNote
)
export default router;
