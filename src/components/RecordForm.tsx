
import React, { useState, useEffect } from 'react';

type FieldDef = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'time' | 'select' | 'textarea' | 'checkbox';
  options?: string[];
  placeholder?: string;
};

export type Schema = {
  collection: string;
  title: string;
  fields: FieldDef[];
  defaultValues?: Record<string, any>;
};

interface Props {
  schema: Schema;
  initial?: any;
  onSave: (values: any) => void;
  onCancel?: () => void;
}

const RecordForm: React.FC<Props> = ({ schema, initial, onSave, onCancel }) => {
  const [values, setValues] = useState<any>({});
  useEffect(() => {
    const defaults = schema.defaultValues || {};
    setValues({ ...defaults, date: new Date().toISOString().slice(0,10), ...initial });
  }, [initial, schema]);

  function handleChange(name: string, value: any) {
    setValues((v: any) => ({ ...v, [name]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave(values);
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {schema.fields.map((f) => (
        <div key={f.name} className="space-y-1">
          <label className="label">{f.label}</label>
          {f.type === 'textarea' ? (
            <textarea
              className="input min-h-[100px]"
              placeholder={f.placeholder}
              value={values[f.name] ?? ''}
              onChange={(e) => handleChange(f.name, e.target.value)}
            />
          ) : f.type === 'select' ? (
            <select
              className="input"
              value={values[f.name] ?? ''}
              onChange={(e) => handleChange(f.name, e.target.value)}
            >
              <option value="" disabled>Select...</option>
              {f.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : f.type === 'checkbox' ? (
            <input
              type="checkbox"
              checked={!!values[f.name]}
              onChange={(e) => handleChange(f.name, e.target.checked)}
            />
          ) : (
            <input
              className="input"
              type={f.type}
              step={f.type === 'number' ? 'any' : undefined}
              placeholder={f.placeholder}
              value={values[f.name] ?? ''}
              onChange={(e) => handleChange(f.name, f.type === 'number' ? Number(e.target.value) : e.target.value)}
            />
          )}
        </div>
      ))}

      <div className="flex gap-2 pt-2">
        <button className="btn btn-primary" type="submit">Save</button>
        {onCancel && <button className="btn" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
};

export default RecordForm;
