import React, { useEffect, useState } from "react";

const USER_NAME = "j2pmv2-0";
const API_URL = `https://playground.4geeks.com/todo/todos/${USER_NAME}`;
const USER_URL = `https://playground.4geeks.com/todo/users/${USER_NAME}`;

const Home = () => {
	const [task, setTask] = useState("");
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		const inicializarApp = async () => {
			await inicializarUsuario();
		};

		inicializarApp();
	}, []);

	const crearUsuario = async () => {
		try {
			const resp = await fetch(USER_URL, {
				method: "POST",
			});
			const data = await resp.text();
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	const obtenerTareas = async () => {
		try {
			const resp = await fetch(USER_URL);

			if (!resp.ok) {
				throw new Error(`No se pudo obtener el usuario: ${resp.status}`);
			}

			const datos = await resp.json();
			setTasks(datos.todos || []);
		} catch (error) {
			console.log(error);
			setTasks([]);
		}
	};

	const inicializarUsuario = async () => {
		try {
			const resp = await fetch(USER_URL);

			if (resp.status === 404) {
				await crearUsuario();
			}

			await obtenerTareas();
		} catch (error) {
			console.log(error);
			setTasks([]);
		}
	};

	const agregarTarea = async (e) => {
		e.preventDefault();

		if (!task.trim()) return;

		const nuevaTarea = {
			label: task.trim(),
			is_done: false,
		};

		try {
			const resp = await fetch(API_URL, {
				method: "POST",
				body: JSON.stringify(nuevaTarea),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await resp.text();
			console.log(data);
			setTask("");
			await obtenerTareas();
		} catch (error) {
			console.log(error);
		}
	};

	const eliminarTarea = async (id) => {
		try {
			const resp = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
				method: "DELETE",
			});
			console.log(resp.status);
			await obtenerTareas();
		} catch (error) {
			console.log(error);
		}
	};

	const limpiarTodo = async () => {
		try {
			await fetch(USER_URL, {
				method: "DELETE",
			});
			setTasks([]);
			await crearUsuario();
			await obtenerTareas();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="container mt-5">
			<h1 className="text-center mb-4">Mi Todo List</h1>

			<form onSubmit={agregarTarea} className="d-flex gap-2 mb-4">
				<input
					type="text"
					value={task}
					onChange={(e) => setTask(e.target.value)}
					placeholder="Escribe una tarea"
					className="form-control"
				/>
				<button type="submit" className="btn btn-primary">
					Agregar
				</button>
			</form>

			<button onClick={limpiarTodo} className="btn btn-danger mb-3">
				Limpiar todo
			</button>

			<ul className="list-group">
				{tasks.map((item) => (
					<li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
						<span>{item.label}</span>
						<button
							className="btn btn-sm btn-outline-danger"
							onClick={() => eliminarTarea(item.id)}
						>
							Borrar
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Home;
