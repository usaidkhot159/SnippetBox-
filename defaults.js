export const DEFAULT_SNIPPETS = [
  {
    title: 'Debounce Function',
    language: 'JavaScript',
    category: 'Utilities',
    tags: ['debounce', 'performance', 'async'],
    description: 'Delays function execution until after wait milliseconds have elapsed since the last invocation. Perfect for search inputs and resize handlers.',
    code: `function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Usage
const handleSearch = debounce((query) => {
  console.log('Searching:', query);
}, 400);`,
    favorite: true,
    copyCount: 42,
  },
  {
    title: 'Fetch API with Error Handling',
    language: 'JavaScript',
    category: 'API',
    tags: ['api', 'fetch', 'async', 'error-handling'],
    description: 'A robust fetch wrapper that handles errors, returns JSON, and provides a clean async/await interface.',
    code: `async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}

// Usage
const data = await fetchData('https://api.example.com/users');`,
    favorite: true,
    copyCount: 38,
  },
  {
    title: 'CSS Glassmorphism Card',
    language: 'CSS',
    category: 'CSS Tricks',
    tags: ['glassmorphism', 'ui', 'modern', 'backdrop'],
    description: 'Creates a beautiful frosted glass effect using backdrop-filter. Works best over colorful or image backgrounds.',
    code: `.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 24px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}`,
    copyCount: 27,
  },
  {
    title: 'Binary Search',
    language: 'C++',
    category: 'Algorithms',
    tags: ['algorithm', 'search', 'binary-search', 'leetcode'],
    description: 'Efficient O(log n) binary search on a sorted array. Returns the index of the target or -1 if not found.',
    code: `int binarySearch(vector<int>& nums, int target) {
  int left = 0, right = nums.size() - 1;

  while (left <= right) {
    int mid = left + (right - left) / 2;

    if (nums[mid] == target) return mid;
    if (nums[mid] < target)  left  = mid + 1;
    else                     right = mid - 1;
  }

  return -1;
}`,
    favorite: true,
    copyCount: 19,
  },
  {
    title: 'CSS Flexbox Center',
    language: 'CSS',
    category: 'CSS Tricks',
    tags: ['flexbox', 'centering', 'layout'],
    description: 'The classic one-liner to perfectly center any element both horizontally and vertically.',
    code: `.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Full viewport center */
.full-center {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}`,
    copyCount: 31,
  },
  {
    title: 'useLocalStorage Hook',
    language: 'JavaScript',
    category: 'React',
    tags: ['react', 'hooks', 'storage', 'custom-hook'],
    description: 'A custom React hook that syncs state with localStorage, so values persist across page refreshes.',
    code: `import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'dark');`,
    copyCount: 24,
  },
  {
    title: 'BFS — Breadth First Search',
    language: 'C++',
    category: 'Algorithms',
    tags: ['algorithm', 'graph', 'bfs', 'queue', 'leetcode'],
    description: 'Standard BFS traversal for an unweighted graph represented as an adjacency list.',
    code: `void bfs(int start, vector<vector<int>>& adj, int n) {
  vector<bool> visited(n, false);
  queue<int> q;

  visited[start] = true;
  q.push(start);

  while (!q.empty()) {
    int node = q.front();
    q.pop();
    cout << node << " ";

    for (int neighbor : adj[node]) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        q.push(neighbor);
      }
    }
  }
}`,
    copyCount: 15,
  },
  {
    title: 'Dark Mode Toggle',
    language: 'JavaScript',
    category: 'Frontend',
    tags: ['dark-mode', 'toggle', 'ui', 'localStorage'],
    description: 'Toggles dark/light mode and persists the preference in localStorage.',
    code: `function initDarkMode() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved ? saved === 'dark' : prefersDark;

  document.documentElement.classList.toggle('dark', isDark);

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', current ? 'dark' : 'light');
  });
}

initDarkMode();`,
    copyCount: 28,
  },
  {
    title: 'Python List Comprehension',
    language: 'Python',
    category: 'Utilities',
    tags: ['python', 'list', 'functional', 'concise'],
    description: 'Common list comprehension patterns — filter, transform, and nested loops.',
    code: `# Filter even numbers
evens = [x for x in range(20) if x % 2 == 0]

# Transform: square each item
squares = [x**2 for x in range(10)]

# Nested: flatten 2D list
flat = [item for row in matrix for item in row]

# Dictionary comprehension
word_lengths = {word: len(word) for word in words}

# Set comprehension (unique values)
unique_lengths = {len(word) for word in words}`,
    copyCount: 21,
  },
  {
    title: 'Two Pointers Pattern',
    language: 'C++',
    category: 'Algorithms',
    tags: ['algorithm', 'two-pointers', 'array', 'leetcode'],
    description: 'Classic two-pointer approach for sorted array problems. O(n) time, O(1) space.',
    code: `// Two Sum (sorted input)
vector<int> twoSum(vector<int>& nums, int target) {
  int left = 0, right = nums.size() - 1;

  while (left < right) {
    int sum = nums[left] + nums[right];

    if (sum == target)  return {left + 1, right + 1};
    if (sum < target)   left++;
    else                right--;
  }

  return {};
}`,
    pinned: true,
    copyCount: 18,
  },
  {
    title: 'CSS Grid Layout',
    language: 'CSS',
    category: 'CSS Tricks',
    tags: ['grid', 'layout', 'responsive'],
    description: 'A responsive CSS Grid setup with auto-fill columns and sensible gap values.',
    code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

/* Named template areas */
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}`,
    copyCount: 22,
  },
  {
    title: 'Throttle Function',
    language: 'JavaScript',
    category: 'Utilities',
    tags: ['throttle', 'performance', 'scroll'],
    description: 'Limits how often a function fires. Use for scroll events, resize, and mouse moves.',
    code: `function throttle(fn, limit = 300) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

// Usage
window.addEventListener('scroll', throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 100));`,
    copyCount: 16,
  },
  {
    title: 'SQL — Common Queries',
    language: 'SQL',
    category: 'Database',
    tags: ['sql', 'database', 'query', 'join'],
    description: 'Essential SQL query patterns: select with filter, join, group by, and subquery.',
    code: `-- Basic select with filter
SELECT name, email, created_at
FROM users
WHERE active = 1
ORDER BY created_at DESC
LIMIT 10;

-- Inner join
SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.total > 100;

-- Group by with aggregate
SELECT category, COUNT(*) as count, AVG(price) as avg_price
FROM products
GROUP BY category
HAVING COUNT(*) > 5;`,
    copyCount: 14,
  },
  {
    title: 'Gradient Text CSS',
    language: 'CSS',
    category: 'CSS Tricks',
    tags: ['gradient', 'typography', 'visual'],
    description: 'Apply a beautiful gradient color to text using background-clip technique.',
    code: `.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

/* Animated gradient text */
.animated-gradient-text {
  background: linear-gradient(270deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}`,
    copyCount: 33,
  },
  {
    title: 'Express.js REST API',
    language: 'JavaScript',
    category: 'Backend',
    tags: ['express', 'backend', 'api', 'node', 'rest'],
    description: 'Minimal Express server with RESTful CRUD routes, JSON middleware, and error handling.',
    code: `const express = require('express');
const app = express();
app.use(express.json());

const items = [];

app.get('/api/items', (req, res) => {
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const item = { id: Date.now(), ...req.body };
  items.push(item);
  res.status(201).json(item);
});

app.put('/api/items/:id', (req, res) => {
  const idx = items.findIndex(i => i.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  items[idx] = { ...items[idx], ...req.body };
  res.json(items[idx]);
});

app.delete('/api/items/:id', (req, res) => {
  const idx = items.findIndex(i => i.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  items.splice(idx, 1);
  res.status(204).end();
});

app.listen(3000, () => console.log('Server running on port 3000'));`,
    copyCount: 29,
  },
];
