# 📘 JavaScript & TypeScript Primer

> **Audience:** student-facing — สำหรับคนที่ยังไม่คุ้น JS/TS หรืออยากทบทวน
> **Time:** ~30-45 นาที อ่าน + ลอง code ตาม
> **Goal:** เข้าใจ syntax พื้นฐานพอที่จะอ่าน code ใน course นี้ได้

> 🎮 **Interactive playground** → เปิด [`js-playground/index.html`](js-playground/index.html) เล่น scope · spread · destructuring · `this` binding แบบมี animation

ทุกตัวอย่างใน doc นี้รันได้บน Node 20+ หรือ browser console เลย. ลอง paste แล้ว run ทันที.

---

## 0️⃣ ลองรันก่อน (Setup เร็ว ๆ)

เปิด terminal ที่ folder project แล้วลอง:

```bash
node                       # เปิด Node REPL
> 1 + 1
2
> .exit
```

หรือสร้างไฟล์ทดลอง:

```bash
mkdir -p ~/projects/js-practice
cd ~/projects/js-practice
echo 'console.log("hello")' > play.js
node play.js               # → hello
```

สำหรับ TypeScript ไฟล์ `.ts` ใน project ของเรา compile อัตโนมัติผ่าน Next.js / NestJS — ไม่ต้อง config เอง.

---

## 1️⃣ การประกาศตัวแปร — `let` / `const` / (อย่าใช้ `var`)

```ts
const name = 'Coffee';     // ห้ามเปลี่ยนค่า (default นี้)
let count = 0;             // เปลี่ยนค่าได้
count = count + 1;         // OK

// const ไม่ได้แปลว่า "อ่านอย่างเดียว" — แค่ rebind ไม่ได้
const items = [1, 2, 3];
items.push(4);             // OK — array ภายในเปลี่ยนได้
// items = [9];            // ❌ rebind ไม่ได้
```

**กฎใช้งานในคอร์สนี้:**

| ใช้       | เมื่อไหร่                                       |
| --------- | ----------------------------------------------- |
| `const`   | default ทุกครั้ง — ค่าไม่ rebind                |
| `let`     | เฉพาะตอนต้อง reassign จริง ๆ (loop counter ฯลฯ) |
| ~~`var`~~ | อย่าใช้ — มี hoisting แปลก ๆ ไม่มี block scope  |

### ทำไมห้าม `var` — 3 bugs จริง

```ts
// 1) function scope (ไม่ใช่ block)
if (true) {
  var x = 1;
  let y = 2;
}
console.log(x);   // 1   ← หลุดออกมา 😱
console.log(y);   // ReferenceError

// 2) hoisting — อ่านก่อนประกาศได้ แต่ค่าเป็น undefined
console.log(a);   // undefined (!)
var a = 5;

console.log(b);   // ReferenceError ✅ (ดีกว่า — fail loud)
let b = 5;

// 3) re-declare ได้เงียบ ๆ
var price = 65;
var price = 70;   // OK — ไม่มี warning เลย
let cost = 65;
let cost = 70;    // ❌ SyntaxError ✅
```

`let`/`const` (ES2015+) แก้ทั้ง 3 ปัญหา → ไม่มีเหตุผลแตะ `var` เลย.

---

## 2️⃣ Primitive Types — Number / String / Boolean

### Number

JavaScript มี number type เดียว — ไม่แยก int / float.

```ts
const price = 65;            // integer
const tax = 0.07;            // float
const total = price * (1 + tax);   // 69.55

const big = 1_000_000;       // ใส่ _ คั่นให้อ่านง่าย (ไม่กระทบค่า)
const hex = 0xff;            // 255

// operations
1 + 2        // 3
10 / 3       // 3.333...
10 % 3       // 1   (modulo)
2 ** 8       // 256 (power)
```

**Gotchas:**

```ts
0.1 + 0.2 === 0.3       // false (floating point)
NaN === NaN             // false  → ใช้ Number.isNaN(x)
parseInt('10px')        // 10
Number('10px')          // NaN
```

### String

มี 3 รูปแบบ — ใช้ backtick (`` ` ``) บ่อยที่สุด.

```ts
const a = 'single';
const b = "double";
const c = `template literal`;       // ← ใช้แบบนี้

// interpolation (แทรกค่า)
const name = 'Latte';
const price = 65;
const line = `${name} - ฿${price}`;     // 'Latte - ฿65'

// multiline
const block = `
  Order received
  Total: ${price}
`;

// methods ใช้บ่อย
'Coffee'.toLowerCase()        // 'coffee'
'Coffee'.toUpperCase()        // 'COFFEE'
'Coffee'.length               // 6
'Coffee'.includes('off')      // true
'Coffee'.slice(0, 3)          // 'Cof'
'a,b,c'.split(',')            // ['a','b','c']
['a','b','c'].join('-')       // 'a-b-c'
```

### Boolean

```ts
const isOpen = true;
const isClosed = false;

// truthy / falsy — JS จะแปลงให้
if ('hello') {}              // truthy
if ('') {}                   // falsy
if (0) {}                    // falsy
if (null) {}                 // falsy
if (undefined) {}            // falsy
if ([]) {}                   // truthy! (empty array ยัง truthy)
if ({}) {}                   // truthy! (empty object ยัง truthy)
```

### `null` vs `undefined`

```ts
let user;                    // undefined  (ยังไม่ assign)
const empty = null;          // null       (จงใจให้ "ไม่มี")

// เช็ครวม
if (value == null) { ... }   // จับทั้ง null และ undefined
```

---

## 3️⃣ Arrays

```ts
const drinks = ['Latte', 'Espresso', 'Mocha'];

drinks[0]                    // 'Latte'  (zero-indexed)
drinks.length                // 3
drinks.at(-1)                // 'Mocha'  (negative = ท้าย)

// mutate (เปลี่ยน array เดิม)
drinks.push('Americano');           // เพิ่มท้าย
drinks.pop();                       // ตัดท้าย
drinks.unshift('Espresso');         // เพิ่มหัว
drinks.shift();                     // ตัดหัว

// non-mutate (สร้าง array ใหม่ — ใช้ใน React บ่อย)
const louder = drinks.map(d => d.toUpperCase());
const cheap = drinks.filter(d => d.length < 6);
const total = [10, 20, 30].reduce((sum, n) => sum + n, 0);  // 60

// iterate
for (const drink of drinks) {
  console.log(drink);
}

drinks.forEach((d, i) => console.log(i, d));
```

### Array destructuring

```ts
const arr = [1, 2, 3, 4];

// pick by position
const [first, second] = arr;          // first = 1, second = 2

// skip ด้วยช่อง ,,
const [, , third] = arr;              // third = 3

// rest
const [head, ...tail] = arr;          // head = 1, tail = [2, 3, 4]

// default (เฉพาะตอน undefined)
const [a, b, c, d, e = 0] = arr;      // e = 0

// swap — ไม่ต้องใช้ temp
let x = 1, y = 2;
[x, y] = [y, x];                      // x = 2, y = 1

// useState — return tuple
const [count, setCount] = useState(0);
```

---

## 4️⃣ Objects

```ts
const product = {
  id: 1,
  name: 'Latte',
  price: 65,
  available: true,
};

// access
product.name                 // 'Latte'
product['name']              // 'Latte'

// update
product.price = 70;
product.category = 'hot';    // เพิ่ม property ใหม่

// shorthand เมื่อชื่อ key = ชื่อ variable
const id = 1;
const name = 'Latte';
const obj = { id, name };    // เท่ากับ { id: id, name: name }
```

### Object destructuring

```ts
const product = { id: 1, name: 'Latte', price: 65, stock: 12 };

// basic
const { name, price } = product;

// rename
const { name: title } = product;
//        ^^^^  ^^^^^
//        key  ตัวแปรใหม่

// default — เฉพาะตอน key เป็น undefined
const { discount = 0 } = product;

// rename + default ผสม
const { name: title = 'No name' } = product;

// rest — เก็บที่เหลือเป็น object ใหม่
const { id, ...rest } = product;
// id = 1, rest = { name, price, stock }

// computed key (key เป็น variable)
const k = 'price';
const { [k]: value } = product;       // value = 65
```

### Function parameter destructuring

ใช้ทุก React component:

```ts
type Props = { title: string; price: number; onAdd?: () => void };

// destructure ตรงใน param
const ProductCard = ({ title, price, onAdd }: Props) => (
  <div>
    <h3>{title}</h3>
    <p>฿{price}</p>
    <button onClick={onAdd}>+</button>
  </div>
);

// default param object — กัน undefined
function fetcher({ url, method = 'GET', headers = {} } = {}) {
  return fetch(url, { method, headers });
}

// rest props pattern (forward props ไปลูก)
const Button = ({ size, ...rest }) =>
  <button {...rest} data-size={size} />;
```

### Nested destructuring

```ts
const order = {
  id: 'O-001',
  customer: { name: 'Alice', address: { city: 'Bangkok', zip: '10100' } },
  items: [{ name: 'Latte', qty: 2 }],
};

// ลึก 2 ชั้น
const { customer: { name } } = order;            // name = 'Alice'

// ลึก + rename + default
const { customer: { address: { city, country = 'TH' } } } = order;

// array ใน object
const { items: [firstItem] } = order;             // firstItem = { name, qty }

// ดึงทั้ง parent และ child key
const { customer, customer: { name: customerName } } = order;
```

⚠️ ลึกเกิน 2 ชั้น → อ่านยาก. แตกเป็นบรรทัด ๆ หรือทำ `const c = order.customer` ก่อนแล้วค่อย destructure อีกที.

---

## 5️⃣ Spread `...` & Rest `...`

ตัว `...` ทำสองอย่าง — ดูจาก context:

### Spread — กระจายออก

```ts
// arrays
const a = [1, 2, 3];
const b = [...a, 4, 5];                  // [1, 2, 3, 4, 5]
const merged = [...a, ...b];             // รวม 2 array
const copy = [...a];                     // shallow copy

// objects (ใช้บ่อยมากใน React/Redux)
const base = { name: 'Latte', price: 65 };
const updated = { ...base, price: 70 };  // { name: 'Latte', price: 70 }
const withCategory = { ...base, category: 'hot' };

// คำสั่งทับซ้อน — ขวาชนะ
const x = { a: 1, b: 2 };
const y = { ...x, b: 99 };               // { a: 1, b: 99 }
```

### Rest — เก็บที่เหลือ

```ts
// ใน destructuring
const [head, ...tail] = [1, 2, 3, 4];
// head = 1, tail = [2, 3, 4]

const { id, ...rest } = { id: 1, name: 'Latte', price: 65 };
// id = 1, rest = { name: 'Latte', price: 65 }

// ใน function
function sum(...nums: number[]) {
  return nums.reduce((s, n) => s + n, 0);
}
sum(1, 2, 3, 4);            // 10
```

---

## 6️⃣ Control Flow — `if` / `else` / `switch`

### if / else

```ts
const stock = 5;

if (stock === 0) {
  console.log('Out of stock');
} else if (stock < 5) {
  console.log('Low stock');
} else {
  console.log('In stock');
}
```

**ใช้ `===` (strict) เท่านั้น — อย่าใช้ `==`:**

```ts
1 === '1'      // false  ✅ ตามที่คาด
1 == '1'       // true   ❌ JS แปลงให้ — สับสน
```

### Ternary (short if)

```ts
const label = stock > 0 ? 'In stock' : 'Out of stock';
const price = isMember ? 50 : 65;
```

### Logical operators

```ts
// AND
isOpen && hasStock          // true ก็ต่อเมื่อทั้งคู่ true

// OR
name || 'Guest'             // ถ้า name falsy → 'Guest'

// Nullish coalescing (??) — เหมือน || แต่จับเฉพาะ null/undefined
count ?? 0                  // ถ้า count เป็น null/undefined → 0
                            // (0 หรือ '' ยังคงเดิม — ต่างจาก ||)

// Optional chaining (?.) — เลี่ยง error ตอน undefined
user?.address?.city         // ถ้า user หรือ address undefined → undefined
```

### switch

```ts
const status = 'paid';

switch (status) {
  case 'pending':
    console.log('Waiting...');
    break;
  case 'paid':
  case 'preparing':
    console.log('Order in progress');
    break;
  default:
    console.log('Unknown');
}
```

> **Tip:** ใน TS code ส่วนใหญ่จะเขียนเป็น object map แทน switch:
>
> ```ts
> const labels = { pending: 'Waiting', paid: 'Done', cancelled: 'X' };
> labels[status];
> ```

---

## 7️⃣ Functions

### Regular function

```ts
function add(a: number, b: number): number {
  return a + b;
}
```

### Arrow function — สั้นลงเรื่อย ๆ

```ts
// full body
const add = (a: number, b: number): number => {
  return a + b;
};

// implicit return (1 expression — ไม่ต้องมี return / { })
const add2 = (a: number, b: number) => a + b;

// 1 parameter — ไม่ต้องมี ( )
const double = (n: number) => n * 2;

// return object — ห่อ ( ) เพื่อไม่ให้ JS คิดว่าเป็น block
const wrap = (x: number) => ({ value: x });

// default parameter
const greet = (name: string = 'Guest') => `Hello ${name}`;

// optional parameter (TS) + nullish fallback
const fmt = (price: number, currency?: string) =>
  `${currency ?? '฿'}${price}`;
```

### Arrow vs `function` — ต่างกันยังไง

ตัวที่สำคัญสุดคือ **`this` binding**:

```ts
// ❌ regular function — มี this ของตัวเอง (ขึ้นอยู่กับว่าใครเรียก)
class Cart {
  items: number[] = [];
  add() {
    [1, 2, 3].forEach(function (n) {
      this.items.push(n);    // ❌ this = undefined (strict mode)
    });
  }
}

// ✅ arrow — ไม่มี this ของตัวเอง → ใช้ this จาก scope แม่
class Cart {
  items: number[] = [];
  add() {
    [1, 2, 3].forEach((n) => {
      this.items.push(n);    // ✅ this = Cart instance
    });
  }
}
```

ข้อต่างอื่น:

| feature           | regular `function`        | arrow                          |
| ----------------- | ------------------------- | ------------------------------ |
| `this` ของตัวเอง  | ✅ (ขึ้นกับ caller)       | ❌ ใช้ของ scope แม่            |
| `arguments` object| ✅                        | ❌ ใช้ `...args` แทน           |
| `new Foo()`       | ✅ ใช้เป็น constructor ได้| ❌                             |
| Hoisting          | ✅ เรียกก่อนประกาศได้     | ❌ (เป็น `const` — temporal DZ)|

**กฎใช้งานในคอร์สนี้:**

- ✅ Arrow function เป็น default — โดยเฉพาะ callback (`map`, `filter`, `onClick`, `useEffect`)
- ✅ React component → arrow ได้ (`const Card = (props) => ...`) หรือ `function` ก็ได้
- ⚠️ Class method → ใช้ `function` shorthand (`add() { }`) — ไม่ใช่ arrow ใน class field (ยกเว้นจงใจ bind `this`)

---

## 7️⃣.5 File Extensions — `.ts` vs `.tsx` vs `.js`

ก่อนเข้า TS section — เคลียร์เรื่องนามสกุลไฟล์ก่อน. ในคอร์สนี้คุณจะเจอทั้ง `.ts` และ `.tsx` — ต่างกันแค่นี้:

| ext    | TypeScript | JSX (React) | ใช้เขียน                                     |
| ------ | :--------: | :---------: | -------------------------------------------- |
| `.ts`  |     ✅     |     ❌      | logic, utils, hooks, types, server code      |
| `.tsx` |     ✅     |     ✅      | React component ที่ return JSX (`<div>...`)  |
| `.js`  |     ❌     |     ❌      | plain JavaScript (config files ส่วนใหญ่)     |
| `.jsx` |     ❌     |     ✅      | (เก่า — เราใช้ `.tsx` แทนเสมอ)               |

### กฎจำง่ายที่สุด

> **ไฟล์มี `<Tag />` → `.tsx`. ไม่งั้น `.ts`**

### ตัวอย่างจริงจาก project

```
apps/web/
├── app/
│   ├── layout.tsx              ← มี <html><body>...</body></html>
│   ├── page.tsx                ← React component
│   └── (storefront)/
│       └── menu/page.tsx       ← React component
├── components/
│   ├── MenuCard.tsx            ← <div className="...">
│   └── CartIcon.tsx            ← <svg>...</svg>
├── lib/
│   ├── format.ts               ← function formatPrice() — ไม่มี JSX
│   ├── api-client.ts           ← fetch wrapper
│   └── cart-store.ts           ← Zustand store
├── hooks/
│   └── use-cart.ts             ← custom hook (return value, ไม่ใช่ JSX)
└── types/
    └── product.ts              ← type Product = { ... }
```

### ทำไมต้องแยก?

JSX ไม่ใช่ JavaScript ปกติ — มัน look-alike แต่ compile ต่างกัน:

```tsx
// .tsx
const card = <div>Hello</div>;
// ↓ compile เป็น ↓
const card = React.createElement('div', null, 'Hello');
```

TypeScript compiler ต้องรู้ก่อนว่า "ไฟล์นี้มี JSX" — เลยใช้นามสกุลเป็น flag.

### ถ้าใส่ JSX ใน `.ts` จะเกิดอะไร?

```ts
// hooks/use-cart.ts  ❌
export function useCart() {
  return <div>Cart</div>;     // TS error: 'div' is not defined
                              // (TS คิดว่า < คือ generic type comparison)
}
```

**แก้:** rename เป็น `use-cart.tsx`. หรือดีกว่า — แยก hook (logic) ออกจาก component (JSX).

### Convention ในคอร์สนี้

| Folder            | Default ext | เหตุผล                                          |
| ----------------- | :---------: | ----------------------------------------------- |
| `app/**/page`     |   `.tsx`    | Next.js page = component                        |
| `app/**/layout`   |   `.tsx`    | Layout wraps children — ใช้ JSX                 |
| `components/**`   |   `.tsx`    | UI component                                    |
| `hooks/**`        |   `.ts`     | hooks return data/function — ไม่ return JSX     |
| `lib/**`          |   `.ts`     | utility / pure logic                            |
| `types/**`        |   `.ts`     | type-only                                       |
| `app/api/**/route`|   `.ts`     | route handler — return Response, ไม่ใช่ JSX     |
| backend (`apps/api`) | `.ts`    | NestJS = no JSX                                 |

> **Tip:** ถ้าไม่แน่ใจ — ตั้ง `.ts` ก่อน. พอจะ return JSX แล้ว rename เป็น `.tsx`. VS Code/IDE จะเตือนเองถ้าเขียน `<...>` ใน `.ts`.

---

## 8️⃣ TypeScript — เพิ่ม type ให้ JavaScript

### Type annotations

```ts
const name: string = 'Latte';
const price: number = 65;
const isOpen: boolean = true;
const tags: string[] = ['hot', 'milk'];
const ids: Array<number> = [1, 2, 3];     // เขียนได้ 2 แบบ
```

ส่วนใหญ่ TS เดาให้เอง (type inference) — เลยไม่ต้องเขียน annotation ทุกที่:

```ts
const name = 'Latte';        // TS รู้เลยว่าเป็น string
const price = 65;            // number
```

### Object types — `type` vs `interface`

```ts
// type alias
type Product = {
  id: number;
  name: string;
  price: number;
  available?: boolean;       // ? = optional
};

// interface (ใช้แทนกันได้เกือบหมด)
interface Product2 {
  id: number;
  name: string;
}

const latte: Product = {
  id: 1,
  name: 'Latte',
  price: 65,
};
```

> **Rule of thumb ในคอร์สนี้:** ใช้ `type` เป็น default. ใช้ `interface` เฉพาะตอน extend class หรือทำ public API library.

### Union types

```ts
type Status = 'pending' | 'paid' | 'cancelled';

let s: Status = 'paid';
s = 'pending';               // OK
// s = 'unknown';            // ❌ TS error
```

### Function types

```ts
type AddFn = (a: number, b: number) => number;

const add: AddFn = (a, b) => a + b;
```

### Generics — แบบเร็ว

เห็นเยอะใน React/Next/NestJS:

```ts
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

first([1, 2, 3]);            // type: number | undefined
first(['a', 'b']);           // type: string | undefined
```

---

## 9️⃣ Async / Await — เร็ว ๆ พอเข้าใจ

```ts
// fetch ข้อมูลจาก API
async function loadProducts() {
  const res = await fetch('http://localhost:4000/api/menu/products');
  const data = await res.json();
  return data;
}

loadProducts().then(products => console.log(products));

// ใน React Server Component เรียกตรง ๆ ได้:
export default async function Page() {
  const products = await loadProducts();
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

จำหลักนี้พอ:

- `async function` คืน `Promise` เสมอ
- `await` รอผลใน function ที่เป็น `async` เท่านั้น
- error → ใช้ `try { } catch (err) { }`

---

## 🔟 Modules — `import` / `export`

```ts
// math.ts
export const PI = 3.14;
export function area(r: number) {
  return PI * r * r;
}
export default function defaultThing() { ... }
```

```ts
// app.ts
import defaultThing, { PI, area } from './math';
import * as math from './math';        // ทุกอย่างเป็น namespace

import { useState } from 'react';      // จาก package
```

> ใน Next.js / NestJS ใช้ `@/...` หรือ `~/...` เป็น alias ไป `src/` — ดูใน `tsconfig.json`.

---

## ✅ Self-Check Quiz

ลองตอบในหัวก่อน — ถ้าตอบไม่ได้ กลับไปอ่าน section ที่เกี่ยวข้อง.

1. ต่างกันยังไง: `let`, `const`, `var` — ใช้ตัวไหนเป็น default?
2. `0.1 + 0.2 === 0.3` ได้ผลอะไร? เพราะอะไร?
3. ค่าใดที่เป็น **falsy** ทั้งหมด? `0`, `''`, `[]`, `null`, `undefined`, `NaN`
4. Spread `...` ใน array vs object ต่างกันยังไง?
5. `??` ต่างจาก `||` ตรงไหน?
6. เขียน `type` สำหรับ `Product` ที่มี `id: number`, `name: string`, `price: number`, `available` (optional boolean)
7. Arrow function `(a, b) => a + b` กับ `function (a, b) { return a + b }` ต่างกันที่ไหน?

---

## 📚 อยากต่อยอด

- **MDN Web Docs** — [developer.mozilla.org](https://developer.mozilla.org) — reference อันดับ 1
- **TypeScript Handbook** — [typescriptlang.org/docs/handbook](https://www.typescriptlang.org/docs/handbook) — อ่านลำดับต่อ
- **JavaScript.info** — [javascript.info](https://javascript.info) — tutorial ลึกแบบไม่งง

ใน course นี้ syntax ที่ใช้บ่อยที่สุด:

| Pattern              | เจอที่ไหน                              |
| -------------------- | -------------------------------------- |
| `const { x } = obj`  | ทุก React component (props)            |
| `arr.map(...)`       | render list                            |
| `{ ...obj, x: 99 }`  | update state, spread props             |
| `?.` / `??`          | safe access (อย่าง `user?.email ?? ''`)|
| `type X = { ... }`   | ทุกไฟล์ TS                             |
| `async/await + fetch`| Server Component, route handlers       |

จำ pattern พวกนี้ได้ → อ่าน code ใน course รู้เรื่อง 80%.
