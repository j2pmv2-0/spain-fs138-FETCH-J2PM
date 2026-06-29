import React, { useEffect, useState } from "react";

const USER_NAME = "j2pmv2-0";
const API_URL = `https://playground.4geeks.com/todo/todos/${USER_NAME}`;
const USER_URL = `https://playground.4geeks.com/todo/users/${USER_NAME}`;

const Home = () => {
	const [task, setTask] = useState("");
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		crearUsuario();
		obtenerTareas();
	}, []);

	const crearUsuario = () => {
		fetch(USER_URL, {
			method: "POST",
		})
			.then((resp) => resp.text())
			.then((data) => console.log(data))
			.catch((error) => console.log(error));
	};

	const obtenerTareas = () => {
		fetch(USER_URL)
			.then((resp) => resp.text())
			.then((data) => {
				const datos = JSON.parse(data);
				setTasks(datos.todos || []);
			})
			.catch((error) => {
				console.log(error);
				setTasks([]);
			});
	};

	const agregarTarea = (e) => {
		e.preventDefault();

		if (!task.trim()) return;

		const nuevaTarea = {
			label: task.trim(),
			is_done: false,
		};

		fetch(API_URL, {
			method: "POST",
			body: JSON.stringify(nuevaTarea),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((resp) => resp.text())
			.then((data) => {
				console.log(data);
				setTask("");
				obtenerTareas();
			})
			.catch((error) => console.log(error));
	};

	const eliminarTarea = (id) => {
		fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
			method: "DELETE",
		})
			.then((resp) => {
				console.log(resp.status);
				obtenerTareas();
			})
			.catch((error) => console.log(error));
	};

	const limpiarTodo = () => {
		fetch(USER_URL, {
			method: "DELETE",
		})
			.then(() => {
				setTasks([]);
				crearUsuario();
			})
			.catch((error) => console.log(error));
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
