import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Input } from 'antd';
import { MdModeEdit, MdDelete } from "react-icons/md";
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  name: yup.string().required('Permission Name is required'),
  code: yup.string().required('Permission Code is required'),
});

const Permissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [editingPermission, setEditingPermission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const url = 'http://localhost:4000/api/permissions';

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchPermissions = async () => {
    try {
      const res = await axios.get(url);
      setPermissions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async (data) => {
    if (editingPermission) {
      await axios.put(`${url}/${editingPermission.id}`, data);
      setPermissions(
        permissions.map((permission) =>
          permission.id === editingPermission.id ? { ...permission, ...data } : permission
        )
      );
      setEditingPermission(null);
    } else {
      const res = await axios.post(url, data);
      setPermissions([...permissions, res.data]);
    }
    reset();
    setIsModalOpen(false);
  };

  const deletePermission = async (id) => {
    await axios.delete(`${url}/${id}`);
    setPermissions(permissions.filter((permission) => permission.id !== id));
  };

  const editPermission = (permission) => {
    setEditingPermission(permission);
    reset({ name: permission.name, code: permission.code });
    setIsModalOpen(true);
  };

  const showModal = () => {
    setEditingPermission(null);
    reset({ name: '', code: '' });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingPermission(null);
    reset();
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Permissions Management</h1>
        <Button type="primary" onClick={showModal} className="mb-6">
          Add Permission
        </Button>
      </div>
      <Modal
        title={editingPermission ? 'Edit Permission' : 'Add Permission'}
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
                <Input
                  {...field}
                  placeholder="Permission Name"
                  className={errors.name ? 'border-red-500' : ''}
                />
              )}
            />
            {errors.name && <span className="text-red-500">{errors.name.message}</span>}

            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Permission Code"
                  className={errors.code ? 'border-red-500' : ''}
                />
              )}
            />
            {errors.code && <span className="text-red-500">{errors.code.message}</span>}
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
              {editingPermission ? 'Update Permission' : 'Add Permission'}
            </button>
          </div>
        </form>
      </Modal>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Access</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {permissions.map((permission) => (
              <tr key={permission.id}>
                <td className="px-6 py-4">{permission.role}</td>
                <td className="px-6 py-4">{permission.access}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => editPermission(permission)}
                    className="text-blue-600 me-4 hover:text-blue-900 mr-2"
                  >
                    <MdModeEdit className="text-2xl" />
                  </button>
                  <button
                    onClick={() => deletePermission(permission.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <MdDelete className="text-2xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Permissions;
