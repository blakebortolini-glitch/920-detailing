import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Star, Check, X, Trash2, Plus, Upload, ImageIcon } from 'lucide-react';

const SERVICE_OPTIONS = [
  { value: 'interior', label: 'Interior Detailing' },
  { value: 'exterior', label: 'Exterior & Paint Correction' },
  { value: 'ceramic', label: 'Ceramic Coating' },
  { value: 'full', label: 'Interior + Exterior Bundle' },
  { value: 'unsure', label: 'Other' },
];

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
        >
          <Star
            size={20}
            fill={(hovered || value) >= s ? 'hsl(214,89%,52%)' : 'none'}
            stroke={(hovered || value) >= s ? 'hsl(214,89%,52%)' : '#CCCCCC'}
          />
        </button>
      ))}
    </div>
  );
}

const empty = { customer_name: '', rating: 5, review_text: '', service: '', vehicle: '', approved: true, photo_urls: [] };

export default function ReviewsManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [uploadingEditPhotos, setUploadingEditPhotos] = useState(false);
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  const fetch = async () => {
    setLoading(true);
    const data = await base44.entities.Review.list('-created_date', 100);
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const toggleApprove = async (review) => {
    await base44.entities.Review.update(review.id, { approved: !review.approved });
    setReviews((prev) => prev.map((r) => r.id === review.id ? { ...r, approved: !r.approved } : r));
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    await base44.entities.Review.delete(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingPhotos(true);
    const uploaded = await Promise.all(
      files.map((file) => base44.integrations.Core.UploadFile({ file }))
    );
    const urls = uploaded.map((r) => r.file_url);
    setForm((f) => ({ ...f, photo_urls: [...(f.photo_urls || []), ...urls] }));
    setUploadingPhotos(false);
  };

  const removePhoto = (index) => {
    setForm((f) => ({ ...f, photo_urls: f.photo_urls.filter((_, i) => i !== index) }));
  };

  const startEdit = (r) => {
    setEditingId(r.id);
    setEditForm({ ...r, photo_urls: r.photo_urls || [] });
  };

  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const handleEditPhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingEditPhotos(true);
    const uploaded = await Promise.all(files.map((file) => base44.integrations.Core.UploadFile({ file })));
    const urls = uploaded.map((r) => r.file_url);
    setEditForm((f) => ({ ...f, photo_urls: [...(f.photo_urls || []), ...urls] }));
    setUploadingEditPhotos(false);
  };

  const removeEditPhoto = (index) => {
    setEditForm((f) => ({ ...f, photo_urls: f.photo_urls.filter((_, i) => i !== index) }));
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.Review.update(editingId, editForm);
    setReviews((prev) => prev.map((r) => r.id === editingId ? { ...r, ...editForm } : r));
    setEditingId(null);
    setSaving(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.Review.create(form);
    setForm(empty);
    setShowForm(false);
    await fetch();
    setSaving(false);
  };

  return (
    <div>
      {/* Add Review Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
          style={{ fontSize: '0.75rem', padding: '12px 24px' }}
        >
          <Plus size={14} />
          Add Review
        </button>
      </div>

      {/* Add Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border border-border p-8 mb-8 bg-secondary">
          <p className="small-caps-label text-tech-grey mb-6">New Review</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="small-caps-label text-tech-grey block mb-2">Customer Name *</label>
              <input
                className="input-underline"
                required
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                placeholder="Jane D."
              />
            </div>
            <div>
              <label className="small-caps-label text-tech-grey block mb-2">Vehicle</label>
              <input
                className="input-underline"
                value={form.vehicle}
                onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
                placeholder="2022 Toyota Camry"
              />
            </div>
            <div>
              <label className="small-caps-label text-tech-grey block mb-2">Service</label>
              <select
                className="input-underline"
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
              >
                <option value="">— Select —</option>
                {SERVICE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="small-caps-label text-tech-grey block mb-2">Rating *</label>
              <StarPicker value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
            </div>
            <div className="md:col-span-2">
              <label className="small-caps-label text-tech-grey block mb-2">Review Text *</label>
              <textarea
                className="input-underline resize-none"
                rows={4}
                required
                value={form.review_text}
                onChange={(e) => setForm({ ...form, review_text: e.target.value })}
                placeholder="Write the customer's review..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="small-caps-label text-tech-grey block mb-2">Photos</label>
              <div className="flex flex-wrap gap-3 mb-3">
                {(form.photo_urls || []).map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt="" className="w-20 h-20 object-cover border border-border" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-ink-black text-white flex items-center justify-center"
                      style={{ fontSize: '0.6rem' }}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhotos}
                  className="w-20 h-20 border border-border border-dashed flex flex-col items-center justify-center gap-1 hover:bg-secondary transition-colors text-tech-grey"
                >
                  {uploadingPhotos ? (
                    <div className="w-4 h-4 border-2 border-border border-t-ink-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Upload size={14} />
                      <span style={{ fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Upload</span>
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.approved}
                  onChange={(e) => setForm({ ...form, approved: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="small-caps-label text-tech-grey">Approved (visible on site)</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="submit" disabled={saving} className="btn-primary" style={{ fontSize: '0.75rem', padding: '12px 24px' }}>
              {saving ? 'Saving...' : 'Save Review'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline" style={{ fontSize: '0.75rem', padding: '12px 24px' }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-border border-t-ink-black rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 border border-border">
          <p className="small-caps-label text-tech-grey">No reviews yet</p>
        </div>
      ) : (
        <div className="border-t border-l border-border">
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-r border-border">
              {editingId === r.id ? (
                /* ── Edit Form ── */
                <form onSubmit={saveEdit} className="p-6 bg-secondary">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="small-caps-label text-tech-grey block mb-1">Customer Name *</label>
                      <input className="input-underline text-sm" required value={editForm.customer_name} onChange={(e) => setEditForm({ ...editForm, customer_name: e.target.value })} />
                    </div>
                    <div>
                      <label className="small-caps-label text-tech-grey block mb-1">Vehicle</label>
                      <input className="input-underline text-sm" value={editForm.vehicle || ''} onChange={(e) => setEditForm({ ...editForm, vehicle: e.target.value })} />
                    </div>
                    <div>
                      <label className="small-caps-label text-tech-grey block mb-1">Service</label>
                      <select className="input-underline text-sm" value={editForm.service || ''} onChange={(e) => setEditForm({ ...editForm, service: e.target.value })}>
                        <option value="">— Select —</option>
                        {SERVICE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="small-caps-label text-tech-grey block mb-1">Rating *</label>
                      <StarPicker value={editForm.rating} onChange={(v) => setEditForm({ ...editForm, rating: v })} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="small-caps-label text-tech-grey block mb-1">Review Text *</label>
                      <textarea className="input-underline resize-none text-sm" rows={3} required value={editForm.review_text} onChange={(e) => setEditForm({ ...editForm, review_text: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="small-caps-label text-tech-grey block mb-2">Photos</label>
                      <div className="flex flex-wrap gap-3">
                        {(editForm.photo_urls || []).map((url, i) => (
                          <div key={i} className="relative">
                            <img src={url} alt="" className="w-20 h-20 object-cover border border-border" />
                            <button type="button" onClick={() => removeEditPhoto(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-ink-black text-white flex items-center justify-center">
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => editFileInputRef.current?.click()}
                          disabled={uploadingEditPhotos}
                          className="w-20 h-20 border border-border border-dashed flex flex-col items-center justify-center gap-1 hover:bg-white transition-colors text-tech-grey"
                        >
                          {uploadingEditPhotos ? (
                            <div className="w-4 h-4 border-2 border-border border-t-ink-black rounded-full animate-spin" />
                          ) : (
                            <><Upload size={14} /><span style={{ fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Upload</span></>
                          )}
                        </button>
                        <input ref={editFileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleEditPhotoUpload} />
                      </div>
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editForm.approved} onChange={(e) => setEditForm({ ...editForm, approved: e.target.checked })} className="w-4 h-4" />
                        <span className="small-caps-label text-tech-grey">Approved (visible on site)</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button type="submit" disabled={saving} className="btn-primary" style={{ fontSize: '0.75rem', padding: '10px 24px' }}>{saving ? 'Saving…' : 'Save'}</button>
                    <button type="button" onClick={cancelEdit} className="btn-outline" style={{ fontSize: '0.75rem', padding: '10px 24px' }}>Cancel</button>
                  </div>
                </form>
              ) : (
                /* ── Read View ── */
                <div className="p-6 flex gap-4 items-start">
                  <div className="flex-shrink-0 self-stretch mt-1" style={{ background: r.approved ? 'hsl(214,89%,52%)' : '#E0E0E0', width: 3, minHeight: 40 }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <p className="font-inter font-bold text-ink-black" style={{ fontSize: '0.9rem' }}>{r.customer_name}</p>
                      {r.vehicle && <span className="font-mono text-tech-grey" style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}>{r.vehicle}</span>}
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={11} fill={r.rating >= s ? 'hsl(214,89%,52%)' : 'none'} stroke={r.rating >= s ? 'hsl(214,89%,52%)' : '#CCCCCC'} />
                        ))}
                      </div>
                      <span className="font-mono" style={{ fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: r.approved ? 'hsl(214,89%,52%)' : '#AAAAAA' }}>
                        {r.approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-ink-black" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>"{r.review_text}"</p>
                    {r.photo_urls && r.photo_urls.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {r.photo_urls.map((url, i) => (
                          <img key={i} src={url} alt="" className="w-14 h-14 object-cover border border-border" />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(r)} title="Edit" className="p-2 border border-border hover:bg-secondary transition-colors text-tech-grey">
                      <Plus size={14} style={{ transform: 'rotate(45deg)' }} />
                    </button>
                    <button onClick={() => toggleApprove(r)} title={r.approved ? 'Unapprove' : 'Approve'} className="p-2 border border-border hover:bg-secondary transition-colors" style={{ color: r.approved ? '#AAAAAA' : 'hsl(214,89%,52%)' }}>
                      <Check size={14} />
                    </button>
                    <button onClick={() => deleteReview(r.id)} title="Delete" className="p-2 border border-border hover:bg-destructive/10 transition-colors text-destructive">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}