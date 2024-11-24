import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, notification, Spin } from 'antd';
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
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // To show a spinner while fetching data

  const url = 'http://localhost:4000/api/permissions';

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Fetch permissions from the server
  const fetchPermissions = async () => {
    try {
      const res = await axios.get(url);
      setPermissions(res.data);
    } catch (err) {
      notification.error({
        message: 'Error',
        description: 'Failed to fetch permissions.',
      });
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  // Add or update permission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editingPermission) {
        await axios.put(`${url}/${editingPermission.id}`, data);
        setPermissions((prev) =>
          prev.map((permission) =>
            permission.id === editingPermission.id ? { ...permission, ...data } : permission
          )
        );
        notification.success({
          message: 'Success',
          description: 'Permission updated successfully.',
        });
      } else {
        const res = await axios.post(url, data);
        setPermissions((prev) => [...prev, res.data]);
        notification.success({
          message: 'Success',
          description: 'Permission added successfully.',
        });
      }
      reset();
      setIsModalOpen(false);
    } catch (err) {
      notification.error({
        message: 'Error',
        description: 'Failed to save permission.',
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete permission
  const deletePermission = async (id) => {
    const oldPermissions = [...permissions];
    setPermissions((prev) => prev.filter((permission) => permission.id !== id));
    try {
      await axios.delete(`${url}/${id}`);
      notification.success({
        message: 'Success',
        description: 'Permission deleted successfully.',
      });
    } catch (err) {
      setPermissions(oldPermissions); // Revert changes on failure
      notification.error({
        message: 'Error',
        description: 'Failed to delete permission.',
      });
      console.error(err);
    }
  };

  // Open modal for editing
  const editPermission = (permission) => {
    setEditingPermission(permission);
    reset({ name: permission.name, code: permission.code });
    setIsModalOpen(true);
  };

  // Open modal for adding
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
      <div className="flex flex-col md:flex-row justify-between align-center">
        <h1 className="text-2xl font-bold mb-4">Permissions Management</h1>
        <Button type="primary" onClick={showModal} className="mb-6">
          Add Permission
        </Button>
      </div>

      {/* Modal */}
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
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {loading ? 'Saving...' : editingPermission ? 'Update Permission' : 'Add Permission'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Table */}
      {isFetching ? (
        <div className="text-center my-6">
          <Spin size="large" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Code
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
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
                      className="text-blue-600 hover:text-blue-900 mr-2"
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
      )}
    </div>
  );
};

export default Permissions;
