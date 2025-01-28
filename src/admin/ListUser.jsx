import React, { useState, useEffect } from "react";
import axios from "axios";
import "./tabel.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users"); // Sesuaikan dengan URL endpoint backend Anda
      setUsers(response.data); // Sesuaikan dengan respon dari backend (response.data.users)
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id_user) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id_user}`); // Sesuaikan dengan URL endpoint untuk menghapus pengguna
      setUsers(users.filter((user) => user._id !== id_user));
      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      <h2>Daftar Pengguna</h2>
      <table className="tbb">
        <thead>
          <tr className="trr">
            <th className="thh">Nama</th>
            <th className="thh">Role</th>
            <th className="thh">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id} className="trr">
                <td className="tdd">{user.name}</td>
                <td className="tdd">
                  {user.role === 0 ? "Student" : "Teacher"}
                </td>
                <td className="tdd">
                  <button onClick={() => deleteUser(user._id)}>Hapus</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="tdd">
                Tidak ada data pengguna.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
