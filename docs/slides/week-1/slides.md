---
theme: seriph
title: 'Coffee Shop Course — Week 1'
info: |
  ## Week 1 — Monorepo + Next.js Foundation
  Coffee Shop Full-Stack Course (6 weeks)
class: text-center
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
transition: fade
mdc: true
fonts:
  sans: 'Inter, ui-sans-serif, system-ui'
  mono: 'JetBrains Mono, Fira Code, ui-monospace, monospace'
defaults:
  layout: default
---

# ☕ Coffee Shop Course

## Week 1 · Session 1

### Monorepo + Next.js Foundation

<div class="muted mt-8 text-sm">
[Date] · [Instructor]
</div>

<!--
เปิดง่ายๆ ตั้งโทน warm. ถามชื่อ + level ของคนฟัง 1 รอบ ก่อนเริ่ม.
-->

---

## layout: center

# ปลายทาง 6 สัปดาห์

<div class="text-lg muted mb-4">ของจริง — deploy บน VPS ของตัวคุณ</div>

```
┌─────────────────────────────────────────────────┐
│  Storefront        Admin Panel       Reports    │
│  (customer)        (CRUD + orders)   (Recharts) │
│       \                /                  |      │
│        └── Next.js 16 + Tailwind v4 ──────┘     │
│                       ║                          │
│                   NestJS 11                      │
│                       ║                          │
│                   Postgres                       │
│                       ║                          │
│                   VPS + Caddy                    │
└─────────────────────────────────────────────────┘
```

<!--
เริ่มจากปลายทาง — show end before start. ทำให้คนเห็นภาพว่ากำลัง build ไปไหน.
-->

---

# 6-Week Arc

<div class="grid grid-cols-2 gap-x-6 gap-y-3 mt-6 text-base">

<div><span class="coffee font-mono">Week 1</span> · FE Foundation</div>
<div class="muted">Next.js + monorepo</div>

<div><span class="coffee font-mono">Week 2</span> · BE Foundation</div>
<div class="muted">NestJS + Postgres</div>

<div><span class="coffee font-mono">Week 3</span> · FE ↔ BE</div>
<div class="muted">First end-to-end slice</div>

<div><span class="coffee font-mono">Week 4</span> · Order Flow</div>
<div class="muted">Cart, checkout, kitchen</div>

<div><span class="coffee font-mono">Week 5</span> · Stock + Reports</div>
<div class="muted">Business logic core ⭐</div>

<div><span class="coffee font-mono">Week 6</span> · Deploy + GitOps</div>
<div class="muted">Live ขึ้น VPS</div>

</div>

<div class="mt-10 muted text-sm">วันนี้ · Week 1 · วาง groundwork</div>

---

# Today's Goal

<div class="mt-8 text-xl">

จบ session นี้ คุณจะ:

<v-clicks>

- ✅ มี monorepo + Turborepo working
- ✅ มี Next.js app run บน <code>localhost:3000</code>
- ✅ เข้าใจ App Router · layouts · route groups
- ⚪ RSC vs Client — เกริ่นเฉยๆ <span class="muted">(Session 2 deep dive)</span>

</v-clicks>

</div>

<!--
Goal slide — สั้น. ตั้งความคาดหวัง. มี ⚪ ตัวเดียว — ไม่ rush.
-->

---

## layout: section

# 🛠️ Setup

<div class="muted text-base">ตรวจ tools + clone repo + รันได้ก่อนเริ่ม</div>

<!--
Block สั้นๆ ตรวจ environment ก่อนเข้า content จริง. คนที่ทำ pre-class แล้ว ข้ามได้ — แต่อย่าข้าม คนที่ติด.
-->

---

# Pre-Class Tools

<div class="mt-4 grid grid-cols-2 gap-6">

<div>

### Required

<v-clicks>

- ✅ Node 20+ <span class="muted">(via nvm/fnm)</span>
- ✅ pnpm 9+ <span class="muted">(via corepack)</span>
- ✅ Git + GitHub SSH key
- ✅ VS Code + 8 extensions <span class="muted">(ESLint, Prettier, Tailwind, Prisma, ES7 React, GitLens, vscode-icons, cSpell)</span>
- ✅ Docker Desktop

</v-clicks>

</div>

<div>

### Verify all-in-one

```bash
node --version       # v20+
pnpm --version       # 9+
git --version
docker --version
docker run hello-world
```

<div class="mt-4 muted text-sm">
ทุกตัว ✅ → ข้ามได้
</div>

</div>

</div>

<div class="mt-8 coffee text-center">
ติด ↓ — ดู <a href="/docs/student/setup-windows.html" target="_blank" rel="noopener" class="font-mono underline hover:opacity-80">docs/student/setup-windows.md</a>
</div>

---

# 🪟 Windows Stack

```text
┌────────── Windows 11 ──────────┐
│                                 │
│  VS Code  ←── (Remote-WSL)      │
│     │                           │
│     ▼                           │
│  ┌── WSL2 Ubuntu 22.04 ──┐     │
│  │  nvm → Node 20         │     │
│  │  pnpm 9, Git           │     │
│  │  project code (~/...)  │     │
│  └────────────────────────┘     │
│                                 │
│  Docker Desktop (WSL2 backend)  │
│                                 │
└─────────────────────────────────┘
```

<div class="mt-6 coffee text-center">
กฎ: code/terminal <span class="font-bold">อยู่ใน WSL</span>. PowerShell ใช้แค่เปิด Docker.
</div>

<!--
ผู้เรียนที่ใช้ Windows: WSL2 = Linux จริงในเครื่อง. Docker Desktop ใช้ backend นี้ → containers Linux ใช้ได้เหมือน macOS.
อย่า clone repo ใน /mnt/c/... — ช้าเป็น 10-100 เท่า. clone ใน ~/projects/...
-->

---

# 📦 Clone → Run · 7 Steps

<div class="text-base">

```bash {1|2|3-4|5|6|7|all}
git clone git@github.com:sangzn34/course-full-stack.git
cd course-full-stack && pnpm install         # 3-5 min
cp apps/api/.env.example apps/api/.env
pnpm db:up                                    # Postgres @ 5433
cd apps/api && pnpm prisma migrate deploy && pnpm prisma generate && cd ../..
pnpm --filter @coffee/api run db:seed         # Week 5+ only
pnpm dev                                      # web:3000 + api:4000
```

</div>

<div class="mt-6 grid grid-cols-2 gap-4 text-sm">
<div class="coffee">✓ http://localhost:3000 → /menu</div>
<div class="coffee">✓ http://localhost:4000/api/menu/products</div>
</div>

<div class="mt-6 muted text-sm">
รายละเอียด → <a href="/docs/student/setup-monorepo.html" target="_blank" rel="noopener" class="font-mono underline hover:opacity-80">docs/student/setup-monorepo.md</a>
</div>

---

# 🔁 Daily Workflow

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

### เปิดงาน

```bash
cd ~/projects/course-full-stack
git pull
pnpm install      # ถ้ามี deps ใหม่
pnpm db:up
pnpm dev
```

</div>

<div>

### เลิกงาน

```bash
Ctrl+C            # stop dev servers
pnpm db:down      # stop Postgres
git status        # ดูว่าค้างอะไร
git commit ...
```

</div>

</div>

<div class="mt-10 text-center text-lg coffee">
1 command per intent · clean shutdown ทุกครั้ง
</div>

<!--
หลัง setup เสร็จครั้งแรก — ใช้ daily flow นี้ไปตลอดคอร์ส.
ทำให้ environment สะอาดเสมอ — กัน "ของตกค้าง" จาก session ก่อน.
-->

---

## layout: center

# 📚 Setup Reference

<div class="mt-4 space-y-4 text-base">

<div>
🪟 <span class="coffee">Windows users</span> — install WSL2 + Node + Docker + VS Code<br>
<a href="/docs/student/setup-windows.html" target="_blank" rel="noopener" class="font-mono underline opacity-70 hover:opacity-100">docs/student/setup-windows.md</a>
</div>

<div>
🏗️ <span class="coffee">Monorepo flow</span> — clone, install, env, db, dev<br>
<a href="/docs/student/setup-monorepo.html" target="_blank" rel="noopener" class="font-mono underline opacity-70 hover:opacity-100">docs/student/setup-monorepo.md</a>
</div>

<div>
🔧 <span class="coffee">Pre-course (OS-agnostic)</span> — checklist + verify commands<br>
<a href="/docs/instructor/master/pre-course-checklist.html" target="_blank" rel="noopener" class="font-mono underline opacity-70 hover:opacity-100">docs/instructor/master/pre-course-checklist.md</a>
</div>

<div>
📘 <span class="coffee">JS / TS primer</span> — syntax, types, spread, async<br>
<a href="/docs/student/js-ts-primer.html" target="_blank" rel="noopener" class="font-mono underline opacity-70 hover:opacity-100">docs/student/js-ts-primer.md</a>
</div>

<div>
🆘 <span class="coffee">Common issues</span> — Docker daemon, ports, SSH, registry<br>
<span class="muted">ทั้ง 3 ไฟล์ข้างบนมี §Common Issues</span>
</div>

</div>

<div class="mt-10 muted text-center text-sm">
ติดอะไร — โพสต์ใน chat ทันที, อย่าทน
</div>

---

## layout: section

# 📘 JS / TS Primer

<div class="muted text-base">ปูพื้น syntax ก่อนลุย Next.js — 10 นาที</div>

<!--
Block สั้นๆ ทบทวน JS/TS. คนที่คล่องแล้ว ฟังผ่านได้ — ใช้ตรวจว่ารู้จริงไหม.
ลึกกว่านี้ → docs/student/js-ts-primer.md
-->

---

# Variables — `const` / `let`

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

```ts
const name = 'Latte';     // ห้าม rebind
let count = 0;            // เปลี่ยนได้
count = count + 1;        // OK

// const ≠ immutable
const items = [1, 2, 3];
items.push(4);            // OK
// items = [9];           // ❌
```

</div>

<div>

### กฎ

- ✅ `const` = default
- ✅ `let` = เฉพาะตอนต้อง reassign
- ❌ `var` = อย่าใช้ <span class="muted">(scope แปลก)</span>

</div>

</div>

<div class="mt-8 text-center coffee">
"const รัด rebind, ไม่รัด mutate"
</div>

---

# `var` — ทำไมถึงห้าม

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

### ❌ Bug 1 — function scope (ไม่ใช่ block)

```ts
if (true) {
  var x = 1;
  let y = 2;
}
console.log(x);   // 1   ← หลุดออกมา 😱
console.log(y);   // ❌ ReferenceError
```

</div>

<div>

### ❌ Bug 2 — hoisting

```ts
console.log(a);   // undefined (!)
var a = 5;

console.log(b);   // ❌ ReferenceError
let b = 5;
```

</div>

</div>

<div class="mt-6">

### ❌ Bug 3 — re-declare ได้ (เงียบ ๆ)

```ts
var price = 65;
var price = 70;     // OK — ไม่เตือนเลย → bug ใน file ใหญ่
```

</div>

<div class="mt-4 coffee text-center">
สรุป: <code>const</code> default · <code>let</code> เมื่อต้อง reassign · <code>var</code> ไม่มีเหตุผลให้ใช้
</div>

---

# Arrow Function

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

### Syntax — สั้นลงเรื่อย ๆ

```ts
// regular function
function add(a, b) {
  return a + b;
}

// arrow — full
const add = (a, b) => {
  return a + b;
};

// arrow — implicit return
const add = (a, b) => a + b;

// 1 param → ไม่ต้องใส่ ()
const double = n => n * 2;

// return object → ห่อ ( )
const wrap = x => ({ value: x });
```

</div>

<div>

### ใช้ที่ไหน

```ts
// callbacks
[1, 2, 3].map(n => n * 2);

// React handler
<button onClick={() => setOpen(true)}>

// React component
const Card = ({ title }) => (
  <div>{title}</div>
);

// async arrow
const load = async () => {
  const r = await fetch(url);
  return r.json();
};
```

</div>

</div>

---

# Arrow vs `function` — `this` Binding

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

### ❌ regular function — `this` เปลี่ยน

```ts
class Cart {
  items = [];
  add(item) {
    [1, 2].forEach(function (n) {
      this.items.push(n);   // ❌ this = undefined
    });
  }
}
```

</div>

<div>

### ✅ arrow — ไม่มี `this` ของตัวเอง

```ts
class Cart {
  items = [];
  add(item) {
    [1, 2].forEach(n => {
      this.items.push(n);   // ✅ this = Cart
    });
  }
}
```

</div>

</div>

<div class="mt-6 muted text-sm">

ข้อต่างอื่น ๆ:

- ❌ Arrow ไม่มี `arguments` object
- ❌ Arrow ใช้เป็น constructor (`new Foo()`) ไม่ได้
- ✅ Arrow เหมาะกับ callback · class method ใช้ regular ก็ได้

</div>

<div class="mt-4 coffee text-center">
Default ในคอร์สนี้: arrow function — <span class="muted">เว้น top-level helper ที่ต้อง hoist</span>
</div>

<!--
Common bug — มือใหม่ใช้ function() ใน setTimeout/forEach แล้ว this หาย.
Arrow แก้ปัญหานี้ได้ฟรี.
-->

---

# Primitives — Number / String / Boolean

```ts
// Number — มี type เดียว ไม่แยก int/float
const price = 65;
const tax = 0.07;
const big = 1_000_000;       // _ คั่นให้อ่านง่าย

// String — ใช้ template literal เป็นหลัก
const name = 'Latte';
const line = `${name} - ฿${price}`;     // 'Latte - ฿65'

// Boolean
const isOpen = true;

// null vs undefined
let user;                     // undefined  (ยังไม่ assign)
const empty = null;           // null       (จงใจให้ "ไม่มี")
```

<div class="mt-4 muted text-sm">
⚠️ <code>0.1 + 0.2 === 0.3</code> → false (floating point) · <code>NaN === NaN</code> → false
</div>

---

# Arrays

```ts
const drinks = ['Latte', 'Espresso', 'Mocha'];

drinks[0]                    // 'Latte'  (zero-indexed)
drinks.length                // 3
drinks.at(-1)                // 'Mocha'

// non-mutate (ใช้ใน React บ่อย — สร้าง array ใหม่)
const louder = drinks.map(d => d.toUpperCase());
const cheap  = drinks.filter(d => d.length < 6);
const total  = [10, 20, 30].reduce((s, n) => s + n, 0);  // 60

// mutate (เปลี่ยน array เดิม)
drinks.push('Americano');
drinks.pop();
```

<div class="mt-4 coffee text-center">
React → ใช้ <code>map</code> / <code>filter</code> / <code>reduce</code> · ห้าม <code>push</code> ใน state
</div>

---

# Objects

```ts
const product = {
  id: 1,
  name: 'Latte',
  price: 65,
};

product.name                  // 'Latte'
product.price = 70;           // update
product.category = 'hot';     // เพิ่ม property

// shorthand เมื่อ key === variable name
const id = 1;
const name = 'Latte';
const obj = { id, name };     // === { id: id, name: name }
```

<div class="mt-4 muted text-center text-sm">
destructuring → 2 slides ถัดไป
</div>

---

# Destructuring — Arrays

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

### Basic + skip + rest

```ts
const arr = [1, 2, 3, 4];

// pick by position
const [first, second] = arr;
// first = 1, second = 2

// skip ด้วยช่อง ,,
const [, , third] = arr;
// third = 3

// rest — เก็บที่เหลือ
const [head, ...tail] = arr;
// head = 1, tail = [2, 3, 4]

// default ถ้า undefined
const [a, b, c, d, e = 0] = arr;
// e = 0
```

</div>

<div>

### Use cases — เจอบ่อย

```ts
// useState — return tuple
const [count, setCount] = useState(0);

// swap — ไม่ต้องใช้ temp
let x = 1, y = 2;
[x, y] = [y, x];
// x = 2, y = 1

// split first / rest (functional)
const [pivot, ...others] = items;

// useEffect cleanup pattern
const [data, error] =
  await tryFetch(url);
```

</div>

</div>

<div class="mt-4 coffee text-center">
<code>useState</code> ใช้ pattern นี้ทุกครั้ง — array destructuring ที่ React forced
</div>

---

# Destructuring — Objects

```ts
const product = { id: 1, name: 'Latte', price: 65, stock: 12 };

// basic
const { name, price } = product;

// rename
const { name: title } = product;
//       ^^^^  ^^^^^
//      key   ตัวแปรใหม่

// default — ถ้า key ไม่มี / เป็น undefined
const { discount = 0 } = product;

// rename + default
const { name: title = 'No name' } = product;

// rest — เก็บ key ที่เหลือเป็น object ใหม่
const { id, ...rest } = product;
// id = 1, rest = { name, price, stock }
```

<div class="mt-4 coffee text-center">
ใช้ทุก React component — <code>const &#123; title, price &#125; = props</code>
</div>

---

# Destructuring — Function Parameters

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

### React component (เจอทุกไฟล์)

```ts
type Props = {
  title: string;
  price: number;
  onAdd?: () => void;
};

// destructure ใน param
const ProductCard = ({
  title,
  price,
  onAdd,
}: Props) => (
  <div>
    <h3>{title}</h3>
    <p>฿{price}</p>
    <button onClick={onAdd}>+</button>
  </div>
);
```

</div>

<div>

### Default + rename + rest

```ts
// default param object
function fetcher({
  url,
  method = 'GET',
  headers = {},
} = {}) {
  return fetch(url, { method, headers });
}

// extract แค่ที่ต้องใช้
const log = ({ id, name }) =>
  console.log(id, name);

// rest props (Spread to child)
const Button = ({ size, ...rest }) =>
  <button {...rest} data-size={size} />;
```

</div>

</div>

<div class="mt-4 coffee text-center text-sm">
"ดึงเฉพาะที่ต้องใช้ → ตัวแปรในฟังก์ชันสะอาด"
</div>

---

# Destructuring — Nested

```ts
const order = {
  id: 'O-001',
  customer: { name: 'Alice', address: { city: 'Bangkok', zip: '10100' } },
  items: [{ name: 'Latte', qty: 2 }],
};

// ลึก 2 ชั้น
const { customer: { name } } = order;
// name = 'Alice'

// ลึก + rename + default
const {
  customer: { address: { city, country = 'TH' } },
} = order;

// array ใน object
const { items: [firstItem] } = order;
// firstItem = { name: 'Latte', qty: 2 }

// destructure ทั้ง parent และ child (ใช้ : 2 ครั้งคนละความหมาย)
const { customer, customer: { name: customerName } } = order;
```

<div class="mt-4 muted text-center text-sm">
⚠️ Nested ลึกเกิน 2 ชั้น → อ่านยาก แตกเป็นบรรทัด ๆ ดีกว่า
</div>

---

# Spread `...` — Arrays

```ts
const a = [1, 2, 3];

const b = [...a, 4, 5];          // [1, 2, 3, 4, 5]
const merged = [...a, ...b];     // รวม 2 array
const copy = [...a];             // shallow copy
```

<div class="mt-6">

### ใน destructuring → Rest

```ts
const [head, ...tail] = [1, 2, 3, 4];
// head = 1
// tail = [2, 3, 4]
```

</div>

---

# Spread `...` — Objects

```ts
const base = { name: 'Latte', price: 65 };

// copy + override
const updated = { ...base, price: 70 };
// { name: 'Latte', price: 70 }

// add field
const withCategory = { ...base, category: 'hot' };

// ขวาชนะ (right wins)
const x = { a: 1, b: 2 };
const y = { ...x, b: 99 };       // { a: 1, b: 99 }
```

<div class="mt-4 coffee text-center">
Pattern นี้ใช้ทุกครั้งที่ update React state
</div>

<!--
Common mistake — มือใหม่ทำ obj.x = 99 แล้ว setState(obj) → React ไม่ re-render เพราะ reference เดิม.
ใช้ {...obj, x: 99} เสมอ.
-->

---

# Control Flow — `if` / `else`

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

```ts
const stock = 5;

if (stock === 0) {
  console.log('Out of stock');
} else if (stock < 5) {
  console.log('Low');
} else {
  console.log('OK');
}
```

</div>

<div>

### ใช้ `===` เท่านั้น

```ts
1 === '1'   // false ✅
1 == '1'    // true  ❌
```

`==` แปลงให้อัตโนมัติ → bug เงียบ

</div>

</div>

<div class="mt-6 muted">
ESLint จะเตือนถ้าเผลอใช้ <code>==</code>
</div>

---

# Ternary + Logical Operators

```ts
// ternary — short if
const label = stock > 0 ? 'In stock' : 'Out';

// && (AND) — render กับเปล่า ใน JSX
{isOpen && <Badge>Open now</Badge>}

// || (OR) — fallback
const display = name || 'Guest';

// ?? (nullish) — fallback เฉพาะ null/undefined
const count = value ?? 0;
//   value = 0      → count = 0    ('' / 0 ผ่าน)
//   value = null   → count = 0
//   value = undef  → count = 0

// ?. (optional chain) — ปลอดภัยตอน undefined
user?.address?.city
```

<div class="mt-4 coffee text-center">
<code>??</code> + <code>?.</code> = lifesaver ใน React/Next
</div>

---

# File Extensions — `.ts` vs `.tsx`

<div class="grid grid-cols-2 gap-6 mt-2">

<div>

| ext      | TS  | JSX | ใช้                       |
| -------- | :-: | :-: | ------------------------- |
| `.ts`    | ✅  | ❌  | logic, hooks, utils, types|
| `.tsx`   | ✅  | ✅  | React component (JSX)     |
| `.js`    | ❌  | ❌  | config files              |
| `.jsx`   | ❌  | ✅  | (เก่า — ใช้ `.tsx` แทน)   |

</div>

<div>

### กฎจำง่าย

> ไฟล์มี <code>&lt;Tag /&gt;</code> → <code>.tsx</code><br>
> ไม่งั้น <code>.ts</code>

```tsx
// MenuCard.tsx ✅
export const Card = () =>
  <div>Hello</div>;

// format.ts ✅
export const fmt =
  (n: number) => `฿${n}`;
```

</div>

</div>

<div class="mt-4 muted text-sm text-center">
ใส่ JSX ใน <code>.ts</code> → TS error: <code>'div' is not defined</code> (TS คิดว่า <code>&lt;</code> = generic)
</div>

---

# Convention ในคอร์สนี้

```
apps/web/
├── app/
│   ├── layout.tsx              ← <html><body>...</body></html>
│   ├── page.tsx                ← React component
│   ├── (storefront)/menu/page.tsx
│   └── api/menu/route.ts       ← return Response, ไม่มี JSX
├── components/
│   ├── MenuCard.tsx            ← <div className="...">
│   └── CartIcon.tsx
├── hooks/
│   └── use-cart.ts             ← return value, ไม่ใช่ JSX
├── lib/
│   └── format.ts               ← pure utils
└── types/
    └── product.ts              ← type-only

apps/api/                       ← NestJS — ทั้งหมด .ts (ไม่มี JSX)
```

<div class="mt-6 coffee text-center">
ตั้งใจสงสัย → ลอง <code>.ts</code> ก่อน · IDE จะเตือนถ้าต้อง rename เป็น <code>.tsx</code>
</div>

<!--
Common confusion — มือใหม่เห็น 2 extension แล้วงงว่าเลือกตัวไหน. กฎเดียว: มี JSX = .tsx.
hooks เป็น .ts เสมอ (return value/function — ไม่ใช่ element).
-->

---

# TypeScript — Type Annotations

```ts
const name: string = 'Latte';
const price: number = 65;
const isOpen: boolean = true;
const tags: string[] = ['hot', 'milk'];
```

<div class="mt-6">

### ส่วนใหญ่ TS เดาให้ — ไม่ต้องเขียน

```ts
const name = 'Latte';        // TS รู้: string
const price = 65;             // TS รู้: number
```

### Union types

```ts
type Status = 'pending' | 'paid' | 'cancelled';
let s: Status = 'paid';
// s = 'unknown';   ❌ TS error
```

</div>

---

# TypeScript — `type` for Objects

```ts
type Product = {
  id: number;
  name: string;
  price: number;
  available?: boolean;          // ? = optional
};

const latte: Product = {
  id: 1,
  name: 'Latte',
  price: 65,
};

// function with types
function format(p: Product): string {
  return `${p.name} - ฿${p.price}`;
}
```

<div class="mt-4 muted text-sm">
ใช้ <code>type</code> เป็น default · <code>interface</code> เฉพาะตอน extend class หรือทำ library
</div>

---

## layout: center

# 🎮 Interactive Playground

<div class="muted text-base mb-6">เห็นภาพ scope · spread · destructuring · this binding ผ่าน animation</div>

<div class="surface rounded-xl p-6 max-w-2xl mx-auto">

```
┌─ 7 Interactive Demos ──────────────────────┐
│  1. Variable Scope (let/const/var)         │
│  2. Type Coercion ( === vs == )            │
│  3. Truthy / Falsy live tester             │
│  4. Array map / filter / reduce animation  │
│  5. Spread — items flying in containers    │
│  6. Destructuring — values extracted       │
│  7. Arrow `this` binding (Cart class demo) │
└────────────────────────────────────────────┘
```

</div>

<div class="mt-6 text-center">
<a href="/docs/student/js-playground/" target="_blank" rel="noopener" class="font-mono coffee underline text-lg">
  📘 docs/student/js-playground/
</a>
</div>

<div class="mt-3 muted text-sm text-center">
เปิดทิ้งไว้ — เปิดมาเล่นทุกครั้งที่ลืม syntax
</div>

---

## layout: center

# 🎯 จำ Pattern พวกนี้ → อ่าน code 80% เข้าใจ

<div class="mt-6 grid grid-cols-1 gap-3 text-base text-left max-w-3xl mx-auto">

<div><code class="coffee">const &#123; x &#125; = props</code> · React component (destructure props)</div>
<div><code class="coffee">arr.map(x =&gt; ...)</code> · render list</div>
<div><code class="coffee">&#123; ...obj, x: 99 &#125;</code> · update state, spread props</div>
<div><code class="coffee">user?.email ?? ''</code> · safe access + fallback</div>
<div><code class="coffee">type Product = &#123; ... &#125;</code> · model shapes</div>
<div><code class="coffee">async/await + fetch</code> · Server Component, route handler</div>

</div>

<div class="mt-8 text-center muted text-sm">
ลึกกว่านี้ → <a href="/docs/student/js-ts-primer.html" target="_blank" rel="noopener" class="font-mono underline hover:opacity-80">docs/student/js-ts-primer.md</a>
</div>

---

## layout: center

# The Split-Repo Problem

```
┌─────────────────┐         ┌─────────────────┐
│  repo-frontend  │  ──?──  │  repo-backend   │
└─────────────────┘         └─────────────────┘
         │                            │
         │  types ที่ต้อง sync        │
         │  deploy order matters       │
         │  2 PRs to merge together    │
         │  integration tests ลำบาก   │
         └────────── pain ─────────────┘
```

<div class="mt-6 muted">เคยเจอเคสนี้ไหม?</div>

<!--
ถามคนฟังก่อน — "เคยเจอเคส types frontend ไม่ตรงกับ backend แล้ว runtime พัง?"
ทุกคนยกมือเสมอ.
-->

---

## layout: center

# Monorepo Mental Model

```
┌────────── 1 repo: course-full-stack ──────────┐
│                                                │
│    apps/web ──┐                                │
│               ├──► uses ◄── packages/shared   │
│    apps/api ──┘                                │
│                                                │
│    1 PR · 1 history · 1 type system           │
└────────────────────────────────────────────────┘
```

<div class="mt-6 muted">Single source of truth. Atomic changes across stack.</div>

---

# pnpm + Turborepo Stack

```
              ┌─────────────────┐
              │   Turborepo     │  ← orchestrate tasks
              │  (cache, pipe)  │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  pnpm workspace │  ← link packages
              │  (no copy)      │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   apps + pkgs   │
              └─────────────────┘
```

<div class="mt-4 muted">pnpm = workspace. Turbo = task runner. <span class="coffee">คนละชั้น.</span></div>

<!--
Common confusion — คนคิดว่า Turbo == pnpm. ไม่ใช่. Turbo รัน task, pnpm จัดการ deps.
-->

---

# App Router File Convention

```
app/
├── layout.tsx       ← wraps everything (mandatory)
├── page.tsx         ← URL: /
├── about/
│   └── page.tsx     ← URL: /about
└── shop/
    ├── layout.tsx   ← wraps shop and below
    └── page.tsx     ← URL: /shop
```

<div class="mt-6 text-xl coffee">file path = URL path</div>

---

# Pages Router vs App Router

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

### Pages Router <span class="muted">(เก่า)</span>

```
pages/
├── index.tsx
├── _app.tsx
└── about.tsx
```

- Client-only by default
- `getServerSideProps`
- `getStaticProps`

</div>

<div>

### App Router <span class="coffee">(ใหม่)</span>

```
app/
├── page.tsx
├── layout.tsx
└── about/page.tsx
```

- **Server Components**
- `async` components
- Streaming + Suspense

</div>

</div>

<div class="mt-8 text-center text-xl">🎯 We use <span class="coffee">App Router</span></div>

---

# Route Groups

```
app/
├── (storefront)/             ← group, NOT in URL
│   ├── layout.tsx
│   ├── menu/page.tsx         → /menu
│   └── cart/page.tsx         → /cart
├── (admin)/                  ← another group
│   ├── layout.tsx
│   └── admin/menu/page.tsx   → /admin/menu
```

<div class="mt-6 grid grid-cols-2 gap-4">
<div><code class="coffee">( )</code> = group <span class="muted">(URL invisible)</span></div>
<div><code class="coffee">[ ]</code> = dynamic segment</div>
</div>

<!--
Route group สำหรับแชร์ layout ต่างกันระหว่าง storefront vs admin —
เช่น storefront มี header แบบลูกค้า, admin มี sidebar.
-->

---

## layout: center

# Layouts Persist

<div class="text-lg muted mb-4">Navigate: <code>/menu</code> → <code>/cart</code></div>

```
┌─── /menu ────┐         ┌─── /cart ────┐
│ Header       │         │ Header       │  ← same instance
│ (CartIcon)   │         │ (CartIcon)   │  ← state persists
├──────────────┤         ├──────────────┤
│ Menu list    │         │ Cart items   │  ← only this re-renders
│              │         │              │
└──────────────┘         └──────────────┘
```

<div class="mt-6 muted">นี่คือเหตุผลที่ cart count <span class="coffee">ไม่ flicker</span> เวลาเปลี่ยนหน้า</div>

---

# 📝 Homework + Recap

<div class="grid grid-cols-2 gap-8 mt-4">

<div>

### Homework <span class="muted">(~3-5 hrs)</span>

Week 1 plan, Tasks 5-8:

- [ ] Task 5: Tailwind verify
- [ ] Task 6: shadcn/ui install + components
- [ ] Task 7: Static menu page <span class="muted">(Server)</span>
- [ ] Task 8: Cart icon <span class="coffee">(Client) ← aha moment</span>

<div class="mt-4 text-sm muted">
PR <code>week1-homework</code> → <code>main</code><br>
Deadline: next session
</div>

</div>

<div>

### 🎯 Recap quiz

<v-clicks>

1. Monorepo คืออะไร?
2. App Router file convention?
3. Route group `( )` ใช้ทำอะไร?

</v-clicks>

</div>

</div>

---

## layout: cover

# ☕ Session 2

## Week 1 · Session 2

### RSC + TDD Form

<div class="muted mt-8 text-sm">[Date] · [Instructor]</div>

---

# Today's Goal

<div class="mt-8 text-xl">

จบ session นี้ คุณจะ:

<v-clicks>

- ✅ อธิบาย Server vs Client Component ได้ลึก
- ✅ Setup Vitest ใน Next.js
- ✅ Build form + 3 tests แบบ TDD
- ✅ พร้อมเข้า Week 2 <span class="muted">(NestJS + Postgres)</span>

</v-clicks>

</div>

---

# Server vs Client Mental Model

<div class="grid grid-cols-2 gap-6 mt-2">

<div>

### 🖥️ SERVER

- Query DB
- Read fs
- Use secrets
- Render HTML

<div class="mt-4 coffee text-sm">Server Comp. (default)</div>

<div class="mt-4 muted text-sm">

❌ no `useState`
❌ no `onClick`

</div>

</div>

<div>

### 🌐 CLIENT (browser)

- `useState` / `useEffect`
- `onClick` / `onChange`
- `window` / `localStorage`
- Animations / Hydration

<div class="mt-4 coffee text-sm">Client Comp. (`'use client'`)</div>

<div class="mt-4 muted text-sm">

❌ no DB direct
❌ no fs

</div>

</div>

</div>

<div class="mt-6 text-center muted">HTML + props → hydrate → interact</div>

---

## layout: center

# Decision Rule

<div class="text-xl mt-2 mb-6">Default: <span class="coffee">Server</span></div>

<div class="text-lg">Switch to Client เมื่อต้องการ:</div>

<v-clicks>

- 1️⃣ State (`useState`, `useReducer`)
- 2️⃣ Effects (`useEffect`)
- 3️⃣ Browser APIs
- 4️⃣ Event handlers ที่ interactive
- 5️⃣ Hooks ที่ build บน 1-4 <span class="muted">(TanStack Query, Zustand)</span>

</v-clicks>

---

# Composition Rule

<div class="space-y-4 mt-8 text-lg">

<div>✅ <span class="coffee">Server Component</span> ── render ──► Client Component</div>

<div>❌ Client Component ── import ──► Server Component <span class="muted">(ERROR)</span></div>

<div>✅ Client Component ── children ──► <span class="coffee">Server Component</span> <span class="muted">(OK pattern)</span></div>

</div>

<div class="mt-10 muted">
จำตัวลูกศรสำคัญ — diagram นี้จะอยู่ในใจตอนเขียน code.
</div>

---

## layout: center

# Bundle Impact

<div class="mt-2 mb-6 muted">First Load JS</div>

```
  100% Server Component        ~50 KB
  Mixed (some Client)         ~120 KB
  100% Client (anti-pattern)  ~250 KB+
```

<div class="mt-8 coffee text-center text-lg">
"Every <code>'use client'</code> = code goes to user's browser"
</div>

---

# Test Pyramid

```
                     🔺
                     E2E
                  Playwright
                    slow
                ──────────────
                Integration
                medium speed
              ──────────────────
                  Unit
            Vitest · fast · focused
        ────────────────────────────
```

<div class="mt-6 coffee text-center">← วันนี้เรา focus ที่ <span class="font-bold">Unit</span></div>

---

## layout: center

# TDD Cycle

```
     🔴  RED
     เขียน test → fail
          │
          ▼
     🟢  GREEN
     เขียน code น้อยที่สุด → pass
          │
          ▼
     🔵  REFACTOR
     ปรับ code ให้สวย → ยัง pass
          │
          └──── repeat ──────┐
                             │
                          (ยินดี)
```

---

# Vitest vs Jest

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

### Jest

- ✅ Same API: `describe` / `it` / `expect()`
- 🐢 Slower (Babel)
- 📦 CommonJS-first
- 📚 Older ecosystem

</div>

<div>

### Vitest <span class="coffee">←</span>

- ✅ Same API: `describe` / `it` / `expect()`
- ⚡ Faster (esbuild)
- 📦 Native ESM
- 🌱 Vite ecosystem

</div>

</div>

<div class="mt-10 text-center text-xl">Modern Next.js → <span class="coffee">Vitest</span></div>

---

# Zod + RHF Pairing

```
   Zod schema           ───►  validation
       │
       ▼
   z.infer<typeof>      ───►  TypeScript type
       │
       ▼
   zodResolver(...)     ───►  React Hook Form
       │
       ▼
   register('field')    ───►  <Input> props
```

<div class="mt-8 text-center text-xl coffee">
Single source of truth: <span class="font-bold">schema</span>
</div>

<!--
Pattern นี้ใช้ตลอดคอร์ส — Login form, Menu CRUD, Recipe editor.
-->

---

# TDD Live Build Plan

<div class="mt-6 space-y-3 text-lg">

<v-clicks>

- 1️⃣ Install RHF + Zod <span class="muted">(3 min)</span>
- 2️⃣ Write failing test (1 case) <span class="muted">(10 min)</span> <span class="coffee">← RED</span>
- 3️⃣ Implement minimal component <span class="muted">(15 min)</span> <span class="coffee">← GREEN</span>
- 4️⃣ Add 2 more tests <span class="muted">(8 min)</span>
- 5️⃣ Use in real page <span class="muted">(3 min)</span>
- 6️⃣ Test + typecheck + commit <span class="muted">(1 min)</span>

</v-clicks>

</div>

<div class="mt-8 muted">~40 min total · slide → live code · 2 windows</div>

---

# Week 2 Preview

<div class="text-xl coffee mt-4">BE Foundation</div>

<v-clicks>

- 🆕 NestJS <span class="muted">(modules, controllers, providers)</span>
- 🆕 Postgres ใน Docker
- 🆕 Prisma <span class="muted">(schema, migrate, client)</span>
- 🆕 JWT auth + bcrypt + Guards

</v-clicks>

<div class="mt-10">

### Pre-class

- [ ] Install Docker Desktop
- [ ] Verify: `docker run hello-world`

<div class="mt-4 muted text-sm">ผมจะส่ง pre-class checklist ใน Slack</div>

</div>

---

layout: center
class: text-center

---

# ❓ คำถาม ❓

<div class="mt-8 text-lg space-y-4">

<v-clicks>

- Recap quiz (verbal)
- Anything still unclear?
- What surprised you this week?

</v-clicks>

</div>

<div class="mt-16 muted text-sm">
ถ้าไม่มีคำถามตรงนี้ — ใน Slack ทักได้ตลอด
</div>

<style>
/* per-deck overrides */
.coffee { color: #f5a623; font-weight: 600; }
.muted { color: #a6adc8; }
</style>
