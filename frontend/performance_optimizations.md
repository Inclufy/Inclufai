# Frontend Performance Optimizations

## 1. Code Splitting
```typescript
// Use React.lazy for route-based code splitting
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Projects = lazy(() => import('./pages/Projects'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </Suspense>
  );
}
```

## 2. Image Optimization
```typescript
// Use next-gen formats and lazy loading
<img 
  src="image.webp" 
  alt="Description"
  loading="lazy"
  width={800}
  height={600}
/>
```

## 3. Memoization
```typescript
import { useMemo, useCallback } from 'react';

function ProjectList({ projects }) {
  const sortedProjects = useMemo(
    () => projects.sort((a, b) => b.createdAt - a.createdAt),
    [projects]
  );
  
  const handleClick = useCallback(
    (id) => {
      // Handle click
    },
    []
  );
  
  return sortedProjects.map(p => <ProjectCard key={p.id} onClick={handleClick} />);
}
```

## 4. Virtual Scrolling for Long Lists
```typescript
import { FixedSizeList } from 'react-window';

function LargeProjectList({ projects }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={projects.length}
      itemSize={80}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <ProjectCard project={projects[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

## 5. Bundle Size Optimization
```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer

# Tree shaking - only import what you need
import { Button } from '@/components/ui/button';  // Good
import * as Components from '@/components';        // Bad
```
