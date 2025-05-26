import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useProjectStorage } from './ProjectStorageContext';
import { setProjects, type RootState } from './store';

export type ProjectMeta = {
  id: string;
  name: string;
  created: string;
  graph?: unknown; // persisted serialized graph
};

export function ProjectScreen({ onSelect }: { onSelect: (id: string) => void }) {
  const projectStorage = useProjectStorage();
  const dispatch = useDispatch();
  const projects = useSelector((state: RootState) => state.projects.projects);
  const [newName, setNewName] = useState('');

  function handleCreate() {
    if (!newName.trim()) return;
    const id = `p${Date.now()}`;
    const meta: ProjectMeta = {
      id,
      name: newName.trim(),
      created: new Date().toISOString(),
      graph: undefined,
    };
    projectStorage.set(id, meta);
    dispatch(setProjects(projectStorage.list()));
    setNewName('');
    onSelect(id);
  }

  function handleLoad(id: string) {
    onSelect(id);
  }

  return (
    <div className="project-manager padding-xl margin-x-auto" style={{ textAlign: 'left' }}>
      <h2>Project Manager</h2>
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New project name"
          style={{ marginRight: 8 }}
        />
        <button onClick={handleCreate}>Create Project</button>
      </div>
      <h3>Existing Projects</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
        {projects.length === 0 && <li>No projects found.</li>}
        {projects.map((p) => (
          <li key={p.id} style={{ padding: 0, margin: 0 }}>
            <div
              onClick={() => handleLoad(p.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px 12px', // NO
                borderRadius: 4,
                transition: 'background 0.15s',
                background: '#23272e',
                marginBottom: 4,
                border: '1px solid var(--color-border)',
                fontWeight: 500,
                fontSize: 16,
                color: 'var(--color-text-main)',
                textAlign: 'left',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#2a2d33')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#23272e')}
            >
              <span style={{ marginRight: 12, color: '#4dabf7', fontSize: 18, userSelect: 'none' }}>
                📄
              </span>
              <span style={{ flex: 1 }}>{p.name}</span>
              <span style={{ color: '#888', fontSize: 13, marginLeft: 12 }}>
                {new Date(p.created).toLocaleString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
