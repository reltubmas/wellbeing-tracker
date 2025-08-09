
import React from 'react';

interface Props {
  items: any[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  columns: { key: string; label: string; formatter?: (v: any, row: any) => string }[];
}

const RecordList: React.FC<Props> = ({ items, onEdit, onDelete, columns }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500">
            {columns.map(c => <th key={c.key} className="p-2">{c.label}</th>)}
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td className="p-3 text-slate-400" colSpan={columns.length+1}>No records yet.</td></tr>
          ) : items.map((row) => (
            <tr key={row.id} className="border-t">
              {columns.map(c => (
                <td key={c.key} className="p-2 align-top">
                  {c.formatter ? c.formatter(row[c.key], row) : String(row[c.key] ?? '')}
                </td>
              ))}
              <td className="p-2">
                <div className="flex gap-2">
                  <button className="btn" onClick={() => onEdit(row)}>Edit</button>
                  <button className="btn" onClick={() => onDelete(row.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecordList;
