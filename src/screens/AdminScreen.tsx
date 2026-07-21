import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { ORGANISMS } from '../data';

export function AdminScreen() {
  return (
    <div className="flex-1 p-8 bg-surface-container-low min-h-0 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-primary mb-2">Content Management</h1>
            <p className="text-on-surface-variant">Manage organism profiles, 3D models, and educational content.</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors shadow-sm">
            <Plus className="w-5 h-5" />
            Add Organism
          </button>
        </div>

        <div className="bg-surface rounded-2xl shadow-sm border border-surface-container-high overflow-hidden">
          <div className="p-4 border-b border-surface-container-high bg-surface-container-lowest flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="text"
                placeholder="Search database..."
                className="w-full bg-surface-container border border-surface-container-highest rounded-md py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2 text-sm">
              <button className="px-3 py-1.5 rounded bg-secondary-container text-on-secondary-container font-medium">All</button>
              <button className="px-3 py-1.5 rounded text-on-surface-variant hover:bg-surface-container">Published</button>
              <button className="px-3 py-1.5 rounded text-on-surface-variant hover:bg-surface-container">Drafts</button>
            </div>
          </div>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-container-high bg-surface-container-low/50">
                <th className="py-3 px-6 font-mono text-xs font-semibold text-outline tracking-wider uppercase">Name</th>
                <th className="py-3 px-6 font-mono text-xs font-semibold text-outline tracking-wider uppercase">Category</th>
                <th className="py-3 px-6 font-mono text-xs font-semibold text-outline tracking-wider uppercase">Status</th>
                <th className="py-3 px-6 font-mono text-xs font-semibold text-outline tracking-wider uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ORGANISMS.map((org, i) => (
                <tr key={org.id} className="border-b border-surface-container-high hover:bg-surface-container-low/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-surface-container overflow-hidden flex items-center justify-center">
                        {org.imageUrl ? (
                           <img src={org.imageUrl} alt={org.name} className="w-full h-full object-cover" />
                        ) : (
                           <span className="text-xl">🍄</span>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-primary">{org.name}</div>
                        <div className="text-xs text-on-surface-variant font-mono">{org.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-on-surface-variant">{org.category}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary-container text-on-secondary-container">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      Published
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
