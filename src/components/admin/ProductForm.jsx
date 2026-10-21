import { useState } from 'react';
import Overlay from '../common/Overlay.jsx';
import CloseButton from '../common/CloseButton.jsx';
import Button from '../common/Button.jsx';
import ProductImage from '../catalog/ProductImage.jsx';
import { FAMILIES, GENDERS } from '../../config/constants.js';
import { uniqueId, uploadImage } from '../../services/catalogAdminService.js';

const EMPTY = {
  brand: '',
  name: '',
  subtitle: 'Eau de Parfum - 100 ml',
  description: '',
  family: FAMILIES[0],
  gender: GENDERS[0],
  featured: false,
  image: '',
  olfactoryPyramid: null,
};

const NOTE_FIELDS = [
  ['topNotes', 'Notas de salida'],
  ['heartNotes', 'Notas de corazón'],
  ['baseNotes', 'Notas de fondo'],
];

const toText = (list) => (list ?? []).join(', ');
const toList = (text) =>
  text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

// Crear (product = null) o editar un perfume. Devuelve el perfume completo con onSave.
export default function ProductForm({ product, products, onSave, onClose }) {
  const editing = Boolean(product);
  const [form, setForm] = useState(() => ({ ...EMPTY, ...product }));
  const [notes, setNotes] = useState(() =>
    Object.fromEntries(NOTE_FIELDS.map(([key]) => [key, toText(product?.olfactoryPyramid?.[key])])),
  );
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  function pickFile(e) {
    const picked = e.target.files?.[0];
    if (!picked) return;
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setError('El nombre es obligatorio.');
    if (!editing && !file) return setError('Añade una foto del perfume.');

    setSaving(true);
    setError('');
    try {
      const id = editing ? product.id : uniqueId(`${form.brand} ${form.name}`, products);
      const image = file ? await uploadImage(file, id) : form.image;
      const pyramid = Object.fromEntries(NOTE_FIELDS.map(([key]) => [key, toList(notes[key])]));
      const hasNotes = Object.values(pyramid).some((list) => list.length > 0);

      await onSave({
        ...form,
        id,
        brand: form.brand.trim(),
        name: form.name.trim(),
        subtitle: form.subtitle.trim(),
        description: form.description.trim(),
        image,
        olfactoryPyramid: hasNotes ? pyramid : null,
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Overlay onClose={onClose} label={editing ? 'Editar perfume' : 'Agregar perfume'}>
      <form
        onSubmit={submit}
        className="rise-in max-h-[92vh] w-full max-w-2xl overflow-y-auto border border-gold-line bg-surface"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gold-line bg-surface px-6 py-5">
          <h2 className="font-display text-lg tracking-luxe text-gold">
            {editing ? 'Editar perfume' : 'Agregar perfume'}
          </h2>
          <CloseButton onClick={onClose} />
        </div>

        <div className="grid gap-6 px-6 py-6 sm:grid-cols-[180px_1fr]">
          <div className="space-y-3">
            {preview ? (
              <div className="grid h-52 place-items-center bg-white">
                <img src={preview} alt="" className="h-full w-full object-contain p-2" />
              </div>
            ) : (
              <ProductImage product={form} className="h-52" imgClassName="p-2" />
            )}
            <label className="block cursor-pointer border border-gold-line px-3 py-2 text-center text-[11px] uppercase tracking-[0.15em] text-gold transition-colors duration-300 hover:border-gold">
              {form.image || preview ? 'Cambiar foto' : 'Subir foto'}
              <input type="file" accept="image/*" onChange={pickFile} className="sr-only" />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Marca">
              <input value={form.brand} onChange={set('brand')} placeholder="Ej. Lattafa" className={INPUT} />
            </Field>
            <Field label="Nombre *">
              <input value={form.name} onChange={set('name')} placeholder="Ej. Khamrah" className={INPUT} required />
            </Field>
            <Field label="Presentación" wide>
              <input value={form.subtitle} onChange={set('subtitle')} placeholder="Ej. Eau de Parfum - 100 ml" className={INPUT} />
            </Field>
            <Field label="Descripción breve" wide>
              <textarea
                value={form.description}
                onChange={set('description')}
                rows={3}
                maxLength={220}
                placeholder="Ej. Calidez oriental: canela y dátiles sobre vainilla. Especiado, dulce y envolvente."
                className={INPUT}
              />
            </Field>
            <Field label="Para">
              <select value={form.gender} onChange={set('gender')} className={INPUT}>
                {GENDERS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </Field>
            <Field label="Familia olfativa">
              <select value={form.family} onChange={set('family')} className={INPUT}>
                {FAMILIES.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </Field>
            <label className="flex items-center gap-3 self-end pb-2 text-sm text-soft">
              <input type="checkbox" checked={form.featured} onChange={set('featured')} className="h-4 w-4 accent-gold" />
              Destacado
            </label>
          </div>
        </div>

        <fieldset className="space-y-3 border-t border-gold-line px-6 py-6">
          <legend className="sr-only">Pirámide olfativa</legend>
          <p className="text-xs uppercase tracking-luxe text-muted">Pirámide olfativa (opcional, separa con comas)</p>
          {NOTE_FIELDS.map(([key, label]) => (
            <Field key={key} label={label}>
              <input
                value={notes[key]}
                onChange={(e) => setNotes((n) => ({ ...n, [key]: e.target.value }))}
                placeholder="Ej. Canela, Dátil, Praliné"
                className={INPUT}
              />
            </Field>
          ))}
        </fieldset>

        <div className="sticky bottom-0 flex items-center gap-3 border-t border-gold-line bg-surface px-6 py-5">
          {error && <p className="flex-1 text-sm text-red-400">{error}</p>}
          <Button variant="outline" className="ml-auto" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Overlay>
  );
}

const INPUT =
  'w-full border border-gold-line bg-ink-2 px-3 py-2.5 text-sm text-soft placeholder:text-muted/60 transition-colors duration-300 focus:border-gold focus:outline-none';

function Field({ label, wide = false, children }) {
  return (
    <label className={`block space-y-1.5 ${wide ? 'sm:col-span-2' : ''}`}>
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted">{label}</span>
      {children}
    </label>
  );
}
