// src/pages/EmployeesPage.tsx
import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import EmployeeList from '../components/employees/EmployeeList';
import EmployeeModal from '../components/employees/EmployeeModal';
import { toast } from 'react-toastify';
import { Employee } from '../api/employees';
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee
} from '../api/employees';

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('خطأ في تحميل الموظفين:', error);
      toast.error('فشل في تحميل بيانات الموظفين');
    }
  };

  const handleAddEmployee = () => {
    setIsModalOpen(true);
  };

  const handleSaveEmployee = async (employee: Employee) => {
    try {
      const isNew = !employees.some(e => e.id === employee.id);

      if (isNew) {
        await addEmployee({
          name: employee.name,
          position: employee.position,
          department: employee.department,
          avatarUrl: employee.avatarUrl || ''
        });
        toast.success('تمت إضافة الموظف بنجاح');
      } else {
        await updateEmployee(employee);
        toast.success('تم تحديث بيانات الموظف بنجاح');
      }

      loadEmployees();
      setIsModalOpen(false);
    } catch (error) {
      console.error('فشل في حفظ الموظف:', error);
      toast.error('حدث خطأ أثناء حفظ الموظف');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await deleteEmployee(id);
      toast.success('تم حذف الموظف بنجاح');
      loadEmployees();
    } catch (error) {
      console.error('فشل في حذف الموظف:', error);
      toast.error('حدث خطأ أثناء حذف الموظف');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">إدارة الموظفين</h1>
          <p className="text-sm text-gray-600">
            إضافة وتعديل وحذف بيانات الموظفين
          </p>
        </div>
        <button
          onClick={handleAddEmployee}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <UserPlus className="mr-2 -ml-1 h-5 w-5" />
          إضافة موظف
        </button>
      </div>

      {employees.length > 0 ? (
        <EmployeeList
          employees={employees}
          monthlyTopPerformer={undefined} // التقييم الشهري يمكن ربطه لاحقًا
          onEdit={handleSaveEmployee}
          onDelete={handleDeleteEmployee}
        />
      ) : (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">لا يوجد موظفين حالياً</p>
          <button
            onClick={handleAddEmployee}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <UserPlus className="mr-2 -ml-1 h-5 w-5" />
            إضافة موظف جديد
          </button>
        </div>
      )}

      {isModalOpen && (
        <EmployeeModal
          employee={null}
          onSave={handleSaveEmployee}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default EmployeesPage;