import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://192.168.1.12:3000/usuarios/"

const App = () => {
  const [items, setItems] = useState([]);
  const [newNombre, setNewNombre] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // Cargar los items desde la API
  useEffect(() => {
    axios.get(`${BASE_URL}`)
      .then((response) => {
        setItems(response.data)
        console.log(response.data)
      })
      .catch((error) => console.error("Error al obtener los items:", error));
  }, []);

  // Crear un nuevo item
  const handleCreate = () => {
    if (newNombre.trim() && newEmail.trim()) {
      axios.post(`${BASE_URL}add`, { nombre: newNombre, email: newEmail })
        .then((response) => {
          setItems((prevItems) => [...prevItems, response.data]);
          setNewNombre("");
          setNewEmail("");
        })
        .catch((error) => console.error("Error al crear el item:", error));
    }
  };

  // Eliminar un item
  const handleDelete = (id) => {
    axios.delete(`${BASE_URL}delete/${id}`)
      .then(() => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      })
      .catch((error) => console.error("Error al eliminar el item:", error));
  };

  // Actualizar un item
  const handleUpdate = (id, nombre, email) => {
    const newName = prompt("Nuevo nombre:", nombre);
    const newEmail = prompt("Nuevo email:", email)
    if (newName !== nombre && newEmail !== email) {
      axios.put(`${BASE_URL}update/${id}`, { nombre: newName, email: newEmail })
        .then(() => {
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === id ? { ...item, nombre: newName, email: newEmail } : item
            )
          );
        })
        .catch((error) => console.error("Error al actualizar el item:", error));
    }
  };

  return (
    <div>
      <h1>CRUD con React y MySQL</h1>
      <input
        type="text"
        value={newNombre}
        onChange={(e) => setNewNombre(e.target.value)}
        placeholder="Nombre"
      />
      <input
        type="text"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        placeholder="Email"
      />
      <button onClick={handleCreate}>Crear</button>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span style={{ marginRight: '10px' }}>{item.id}</span>
            <span style={{ marginRight: '10px' }}>{item.nombre}</span>
            <span style={{ marginRight: '10px' }}>{item.email}</span>
            <button onClick={() => handleUpdate(item.id, item.nombre, item.email)}>Actualizar</button>
            <button onClick={() => handleDelete(item.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;