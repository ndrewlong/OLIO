
import React from 'react';
import { UserRole } from '../../types';

interface Column {
  header: string;
  accessor: string;
}

interface TableProps<T> {
  columns: Column[];
  data: T[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onToggleActive?: (item: T) => void;
  itemIsActive?: (item: T) => boolean;
  userRole?: UserRole;
}

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
);

const DeleteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

const PowerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
  </svg>
);


export function Table<T extends { id: string }>({ columns, data, onEdit, onDelete, onToggleActive, itemIsActive, userRole }: TableProps<T>) {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                    {columns.map((col) => (
                    <th key={col.accessor} scope="col" className="px-6 py-3">
                        {col.header}
                    </th>
                    ))}
                    {userRole === UserRole.Admin &&
                      <th scope="col" className="px-6 py-3 text-right">
                          Azioni
                      </th>
                    }
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={item.id || index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-150 ${itemIsActive && !itemIsActive(item) ? 'opacity-50' : 'opacity-100'}`}>
                    {columns.map((col) => (
                        <td key={col.accessor} className="px-6 py-4">
                        {(item as any)[col.accessor]}
                        </td>
                    ))}
                    {userRole === UserRole.Admin &&
                      <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-4">
                              {onToggleActive && itemIsActive && (
                                <button onClick={() => onToggleActive(item)} className={itemIsActive(item) ? "text-green-500 hover:text-green-700" : "text-red-500 hover:text-red-700"}>
                                  <PowerIcon className="w-5 h-5" />
                                </button>
                              )}
                              <button onClick={() => onEdit(item)} className="text-brand-green hover:text-brand-green-light">
                                  <EditIcon className="w-5 h-5" />
                              </button>
                              <button onClick={() => onDelete(item)} className="text-red-500 hover:text-red-700">
                                  <DeleteIcon className="w-5 h-5" />
                              </button>
                          </div>
                      </td>
                    }
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}
