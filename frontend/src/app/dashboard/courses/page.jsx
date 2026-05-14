"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { coursesService } from "@/services/courses.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const data = await coursesService.getCourses();
      setCourses(data);
    } catch (err) {
      setError("Error al cargar los cursos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const onSubmit = async (data) => {
    try {
      setError("");
      setSuccess("");
      const payload = {
        ...data,
        duration_hours: parseInt(data.duration_hours),
        price: parseFloat(data.price),
        is_active: data.is_active === true || data.is_active === "true",
      };

      if (editingCourse) {
        await coursesService.updateCourse(editingCourse.id, payload);
        setSuccess("Curso actualizado");
        setEditingCourse(null);
      } else {
        await coursesService.createCourse(payload);
        setSuccess("Curso creado");
      }
      reset();
      loadCourses();
    } catch (err) {
      setError(err.response?.data?.detail || "Error al guardar.");
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setValue("name", course.name);
    setValue("description", course.description);
    setValue("duration_hours", course.duration_hours);
    setValue("price", course.price);
    setValue("level", course.level);
    setValue("is_active", course.is_active);
    setError("");
    setSuccess("");
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    reset();
    setError("");
    setSuccess("");
  };

  const handleDelete = async (course) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar el curso "${course.name}"?`
    );
    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");
      await coursesService.deleteCourse(course.id);
      setSuccess("Curso eliminado");
      loadCourses();
    } catch (err) {
      setError("Error al eliminar");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Cursos</h1>
        <p className="text-gray-500">Gestiona el catálogo de cursos.</p>
      </div>

      <div className="grid gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{editingCourse ? "Editar curso" : "Registrar nuevo"}</CardTitle>
              <CardDescription>
                {editingCourse
                  ? `Editando: ${editingCourse.name}`
                  : "Añade un nuevo curso al sistema."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" {...register("name", { required: "El nombre es requerido" })} />
                  {errors.name && (
                    <p className="text-sm">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input id="description" {...register("description")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration_hours">Duración (horas)</Label>
                  <Input id="duration_hours" type="number" {...register("duration_hours", {
                      required: "La duración es requerida",
                      min: { value: 1, message: "Debe ser mayor que 0" },
                    })}
                  />
                  {errors.duration_hours && (
                    <p className="text-sm">{errors.duration_hours.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Precio</Label>
                  <Input id="price" type="number" step="0.01"
                    {...register("price", {
                      required: "El precio es requerido",
                      min: { value: 0, message: "Debe ser mayor o igual a 0" },
                    })}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">{errors.price.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Nivel</Label>
                  <select id="level" {...register("level", { required: "El nivel es requerido" })} className="border border-gray-300">
                    <option value="">Selecciona un nivel</option>
                    <option value="basic">Básico</option>
                    <option value="intermediate">Intermedio</option>
                    <option value="advanced">Avanzado</option>
                  </select>
                  {errors.level && (
                    <p className="text-sm text-red-500">{errors.level.message}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <input id="is_active" type="checkbox" {...register("is_active")} className="h-4 w-4"/>
                  <Label htmlFor="is_active">Activo</Label>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Guardando..."
                    : editingCourse
                    ? "Actualizar Curso"
                    : "Guardar Curso"}
                </Button>

                {editingCourse && (
                  <Button type="button" variant="outline" className="w-full" onClick={handleCancelEdit}> Cancelar edición </Button>
                )}
              </form>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-500">
                  <CheckCircle2 className="h-4 w-4" color="green" />
                  <AlertTitle>Éxito</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Listado de Cursos</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center text-gray-500">Cargando cursos...</p>
              ) : courses.length === 0 ? (
                <p className="text-center text-gray-500">No hay cursos registrados.</p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Duración</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Nivel</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.name}</TableCell>
                          <TableCell>{course.description}</TableCell>
                          <TableCell>{course.duration_hours}h</TableCell>
                          <TableCell>${course.price}</TableCell>
                          <TableCell className="capitalize">{course.level}</TableCell>
                          <TableCell>
                            {course.is_active ? (
                              <span className="text-green-600">Activo</span>
                            ) : (
                              <span className="text-red-500">Inactivo</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(course)}> Editar </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDelete(course)}> Eliminar </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}