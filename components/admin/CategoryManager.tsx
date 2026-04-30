"use client";

import { CategoryDB, SectionType, VariantType } from "@/lib/types/database";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface CategoryManagerProps {
  categories: CategoryDB[];
}

const SECTION_LABELS: Record<SectionType, string> = {
  perfume: "Perfumes",
  ropa: "Ropa",
  general: "General / Artículos",
};

const VARIANT_LABELS: Record<VariantType, string> = {
  ml: "Por ML (perfumes)",
  size: "Por talla (ropa)",
};

export function CategoryManager({ categories: initial }: CategoryManagerProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryDB[]>(initial);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [newName, setNewName] = useState("");
  const [newSection, setNewSection] = useState<SectionType>("perfume");
  const [newVariantType, setNewVariantType] = useState<VariantType>("ml");

  function toSlug(name: string) {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
  }

  async function handleAdd() {
    if (!newName.trim()) return toast.error("Escribe un nombre");
    setSaving(true);

    const slug = toSlug(newName);
    const sort_order = categories.length + 1;

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName.trim(),
        slug,
        variant_type: newVariantType,
        section: newSection,
        sort_order,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Error al crear categoría");
    } else {
      toast.success("Categoría creada");
      setCategories([...categories, data]);
      setNewName("");
      setAdding(false);
      router.refresh();
    }
    setSaving(false);
  }

  async function handleDelete(cat: CategoryDB) {
    if (!confirm(`¿Eliminar categoría "${cat.name}"?\nLos productos con esta categoría quedarán sin categoría visible.`)) return;
    setDeleting(cat.id);

    const res = await fetch(`/api/categories/${cat.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Categoría eliminada");
      setCategories(categories.filter((c) => c.id !== cat.id));
      router.refresh();
    } else {
      toast.error("Error al eliminar");
    }
    setDeleting(null);
  }

  async function handleToggle(cat: CategoryDB) {
    const res = await fetch(`/api/categories/${cat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !cat.is_active }),
    });
    if (res.ok) {
      setCategories(categories.map((c) =>
        c.id === cat.id ? { ...c, is_active: !c.is_active } : c
      ));
      router.refresh();
    }
  }

  const grouped = {
    perfume: categories.filter((c) => c.section === "perfume"),
    ropa: categories.filter((c) => c.section === "ropa"),
    general: categories.filter((c) => c.section === "general"),
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Categorías de productos</h2>
        <Button size="sm" onClick={() => setAdding(!adding)}>
          <Plus size={14} />
          Nueva categoría
        </Button>
      </div>

      {/* Formulario nueva categoría */}
      {adding && (
        <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3 border border-gray-200">
          <Input
            label="Nombre de la categoría"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="ej: Perfumes Unisex"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Sección</label>
              <select
                value={newSection}
                onChange={(e) => {
                  const s = e.target.value as SectionType;
                  setNewSection(s);
                  setNewVariantType(s === "perfume" ? "ml" : "size");
                }}
                className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:border-black outline-none"
              >
                {(Object.entries(SECTION_LABELS) as [SectionType, string][]).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Tipo de variantes</label>
              <select
                value={newVariantType}
                onChange={(e) => setNewVariantType(e.target.value as VariantType)}
                className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:border-black outline-none"
              >
                {(Object.entries(VARIANT_LABELS) as [VariantType, string][]).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Slug generado: <code className="bg-gray-100 px-1 rounded">{toSlug(newName) || "..."}</code>
          </p>
          <div className="flex gap-2">
            <Button size="sm" loading={saving} onClick={handleAdd}>Crear</Button>
            <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setNewName(""); }}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Lista agrupada por sección */}
      {(Object.entries(grouped) as [SectionType, CategoryDB[]][]).map(([section, cats]) =>
        cats.length === 0 ? null : (
          <div key={section}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {SECTION_LABELS[section]}
            </p>
            <div className="flex flex-col gap-1.5">
              {cats.map((cat) => (
                <div
                  key={cat.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                    cat.is_active ? "bg-white border-gray-100" : "bg-gray-50 border-dashed border-gray-200 opacity-60"
                  }`}
                >
                  <GripVertical size={14} className="text-gray-300 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{cat.name}</p>
                    <p className="text-xs text-gray-400">
                      {VARIANT_LABELS[cat.variant_type]} · /{cat.slug}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle(cat)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-all ${
                      cat.is_active
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}
                  >
                    {cat.is_active ? "Activa" : "Oculta"}
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    disabled={deleting === cat.id}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
