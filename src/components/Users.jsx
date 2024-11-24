import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Input } from 'antd';
import { MdModeEdit, MdDelete } from 'react-icons/md';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const Admin = () => <span className="bg-[#93ff28] rounded-full text-[#fff] px-4 py-2">Admin</span>;
const Guest = () => <span className="bg-[#2500ff] px-4 py-2 rounded-full text-[#fff]">Guest</span>;
const User = () => <span className="bg-[#ff6a00] px-4 py-2 rounded-full text-[#fff] p-2">User</span>;

const Active = () => <span className="text-[#93ff28]">Active</span>;
const InActive = () => <span className="text-red-500">InActive</span>;

const renderRoleComponent = (role) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return <Admin />;
    case 'guest':
      return <Guest />;
    case 'user':
      return <User />;
    default:
      return <span className="text-gray-500">{role}</span>;
  }
};

const renderStatus = (status) => {
  switch (status.toLowerCase()) {
    case 'active':
      return <Active />;
    case 'inactive':
      return <InActive />;
    default:
      return <span>{status}</span>;
  }
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");

 
  const handleSearchInput = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.role.toLowerCase().includes(value) ||
        user.status.toLowerCase().includes(value)
    );

    setFilteredUsers(filtered);
  };

  const url = 'http://localhost:4000/api/users';

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    role: yup.string().required('Role is required'),
    status: yup.string().required('Status is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur', 
  });

  const fetchUsers = async () => {
    const localUsers = JSON.parse(localStorage.getItem('users'));
    if (localUsers) {
      setUsers(localUsers);
      setFilteredUsers(localUsers);
    } else {
      try {
        const res = await axios.get(url);
        setUsers(res.data);
        setFilteredUsers(res.data); 
        localStorage.setItem('users', JSON.stringify(res.data));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const saveUsersToLocalStorage = (updatedUsers) => {
    setUsers(updatedUsers); 
    setFilteredUsers(updatedUsers); 
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const onSubmit = (data) => {
    if (editingUser) {
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id ? { ...user, ...data } : user
      );
      saveUsersToLocalStorage(updatedUsers);
    } else {
      const newUser = { id: users.length + 1, ...data };
      const updatedUsers = [...users, newUser];
      saveUsersToLocalStorage(updatedUsers);
    }
    reset();
    setIsModalOpen(false);
  };

  const deleteUser = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    saveUsersToLocalStorage(updatedUsers);
  };

  const editUser = (user) => {
    setEditingUser(user);
    reset(user);
    setIsModalOpen(true);
  };

  const showModal = () => {
    setEditingUser(null);
    reset();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4">
       <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="flex flex-col md:flex-row justify-between align-center">
      <form>
            <Input
              size="large"
              placeholder="Search by keyword..."
              value={searchValue}
              onChange={handleSearchInput}
              className="rounded-3xl border-[#064361] pr-20"
            />
          </form>
       
        <Button onClick={showModal} className="mb-6 mt-3 md:mt-0 bg-[#047857] text-[#fff] px-4 py-2 font-semibold rounded-full">
          Add User
        </Button>
      </div>

      <Modal
        title={editingUser ? 'Edit User' : 'Add User'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Name" className={`border ${errors.name && touchedFields.name ? 'border-red-500' : ''}`} />
              )}
            />
            {errors.name && <span className="text-red-500">{errors.name.message}</span>}

            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Role" className={`border ${errors.role && touchedFields.role ? 'border-red-500' : ''}`} />
              )}
            />
            {errors.role && <span className="text-red-500">{errors.role.message}</span>}

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Status" className={`border ${errors.status && touchedFields.status ? 'border-red-500' : ''}`} />
              )}
            />
            {errors.status && <span className="text-red-500">{errors.status.message}</span>}

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Email" className={`border ${errors.email && touchedFields.email ? 'border-red-500' : ''}`} />
              )}
            />
            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 mr-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {editingUser ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </Modal>

      <div className="hidden lg:block">
  <table className="min-w-full divide-y divide-gray-200 border">
    <thead className="bg-[#e0e7ff]">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
    {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 text-[#334155] font-medium">{user.name}</td>
                <td className="px-6 py-4">{renderRoleComponent(user.role)}</td>
                <td className="px-6 py-4 text-[#334155] font-medium">{user.email}</td>
                <td className="px-6 py-4 font-semibold">{renderStatus(user.status)}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => editUser(user)}
                    className="text-blue-600 me-3 hover:text-blue-900 mr-2"
                  >
                    <MdModeEdit className="text-2xl" />
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 ms-2 hover:text-red-900"
                  >
                    <MdDelete className="text-2xl" />
                  </button>
                </td>
              </tr>
            ))}
    </tbody>
  </table>
</div>
<div className="block lg:hidden">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
  {filteredUsers.map((user) => (
            <div className="shadow-md bg-[#f5f3ff] text-center p-4" key={user.id}>
              <h3 className="text-[#475569]">{user.name}</h3>
              <div className="mt-3">{renderRoleComponent(user.role)}</div>
              <div className="mt-3  text-sm lg:text-md">{user.email}</div>
              <p className="my-2">{renderStatus(user.status)}</p>
              <div className="flex align-center justify-center">
                <button
                  onClick={() => editUser(user)}
                  className="text-blue-600 me-3 hover:text-blue-900 mr-2"
                >
                  <MdModeEdit className="text-2xl" />
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="text-red-600 ms-2 hover:text-red-900"
                >
                  <MdDelete className="text-2xl" />
                </button>
              </div>
            </div>
          ))}
  </div>
</div>
    </div>
  );
};

export default Users;
