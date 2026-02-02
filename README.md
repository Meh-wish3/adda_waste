## Ward-level Source Segregation & Pickup – Guwahati (Ward 4)

Prototype for **Track 4: Waste Management (SDG 12)** – focused strictly on a **single urban ward** in Guwahati, with **30–50 households** and exactly **two actors: Citizen & Collector**.

Backend: **Node.js + Express + MongoDB (Mongoose)**  
Frontend: **React (Vite) + Tailwind CSS**

---

### 1. Getting started

#### 1.1. Backend

```bash
cd backend
npm install
npm run seed        # seeds 40 households + 1 collector
npm run dev         # runs on http://localhost:5000
```

Mongo URI (default): `mongodb://127.0.0.1:27017/ward4_waste`  
You can override it via `MONGO_URI` in a `.env` file.

#### 1.2. Frontend

```bash
cd frontend
npm install
npm run dev         # runs on http://localhost:5173
```

Open `http://localhost:5173` in the browser.

---

### 2. Demo flow (live script)

**Context**: Ward 4 of Guwahati with 40 seeded households across Bhetapara, Bhangagarh, GS Road and Beltola.  
Actors: **Citizen web view** and **Collector (ward worker) web dashboard**.

#### Step 0 – Seed data

Run:

```bash
cd backend
npm run seed
```

This creates:

- 40 `households` (with `householdId`, `area`, `location`)
- 1 `collector` for Ward 4
- Clears any old `pickupRequests` and `incentives`

#### Step 1 – Create 6 pickup requests (Citizen)

1. In the frontend, stay in the **Citizen** tab.
2. Use the **Schedule a segregated pickup** card.
3. Choose **different households** and **waste types** (e.g. 3 wet, 2 dry, 1 e-waste) at times within today.
4. Tick **Overflow alert** for at least one request.
5. Submit until you have **6 requests** created.

You can then open **"My recent pickups"** to confirm they are listed.

#### Step 2 – Generate optimized route (Collector)

1. Switch to the **Collector** tab.
2. The top table shows all **pending** pickup requests for the current shift.
3. Click **“Generate Route”**.
4. The **“Optimized pickup route (single shift)”** panel shows:
   - Ordered list of stops (`sequence` 1…N)
   - Household IDs, areas, waste type, preferred time
   - Overflow flags clearly highlighted
   - An explanation text for each step describing *why* it’s next.

#### Step 3 – Mark pickups completed

1. In the Collector table, click **“Mark Completed + Points”** on a few rows (e.g. all 6).
2. Each completion:
   - Sets pickup `status` to `completed`
   - Triggers incentive points for that `householdId` with **correct segregation assumed**.
3. Regenerate the route if needed to see fewer pending stops.

#### Step 4 – Incentive points updated (Citizen)

1. Switch back to **Citizen** tab.
2. In **“My recent pickups”**, select a household that just had a completed pickup.
3. The **“My segregation score”** card shows updated points.

---

### 3. Routing logic (explainable heuristic)

Goal: **Ward-level, single-shift routing** that is easy to explain, tweak and operate by ward staff. No ML, no city-wide optimization.

Implementation details (in `backend/services/routingService.js`):

1. **Scope**: only `pickupRequests` with `status = "pending"` are considered.
2. **Enrichment**:
   - Join each pickup with its `household` to get `area` and `location`.
3. **Fixed area loop**:
   - Define a fixed area order that reflects a practical loop a ward worker would take:
     - `Bhetapara - Lane 1`
     - `Bhetapara - Lane 2`
     - `Bhetapara - Lane 3`
     - `Bhangagarh - Block A`
     - `Bhangagarh - Block B`
     - `GS Road - Point 1`
     - `GS Road - Point 2`
     - `GS Road - Point 3`
     - `Beltola - Market Side`
     - `Beltola - Residential Cluster`
4. **Greedy ordering**:
   - Sort all pending pickups by:
     1. **Area rank** (based on the list above)
     2. **Citizen preferred pickupTime** (earlier first)
   - This gives a **simple greedy route**:
     - Clear all requests in one area before moving to the next.
     - Within the area, honour earlier requested times.
5. **Explainability**:
   - Each route step carries a short `explanation` string such as:
     - *“Visit Bhetapara - Lane 1 (household H001) as stop #1 to reduce back-and-forth between areas.”*
   - The Collector Route view also shows the full **ward loop order** for the judges.

This is:

- **Ward-level** (only uses pre-defined ward areas and seeded households)
- **Deterministic and tweakable** (change the area order, not the code structure)
- **Easy to communicate** to municipal officials.

---

### 4. Incentive mechanism

Implementation in `backend/services/incentiveService.js`:

- A separate `incentives` collection keeps:
  - `householdId`
  - `points`
- Points are added **only when** a pickup is:
  - Marked **completed** by the collector, and
  - Marked as **correctly segregated** (`correctSegregation = true` from the dashboard).

#### Points table

- Wet waste: **5 points**
- Dry waste: **8 points**
- E-waste: **15 points**

In this demo, the Collector dashboard assumes correct segregation when you click *“Mark Completed + Points”*.

On the **Citizen** interface, the card **“My segregation score”** shows:

- Current point total (from `incentives` collection)
- A textual mapping of points to **mock coupons / discounts** (no real payment, no real vendors).

Examples of how municipalities could map points:

- 100 pts → Rs. 50 discount at local kirana (co-created with vendors)
- 200 pts → Waiver on a month’s user fee

In the prototype this is only **described**; no external payment is processed.

---

### 5. How this fits municipal collection (ward level)

1. **Ward-only scope**  
   - Data is limited to **one ward** with **40 households** and fixed areas.  
   - No city-wide dashboards, no multi-admin workflows.

2. **Source segregation at household**  
   - Citizen form **forces waste-type selection** (Wet / Dry / E-Waste).  
   - Explanatory text nudges them to keep separate containers.

3. **Last-mile collection efficiency**  
   - Ward worker dashboard shows **only current-shift requests**, not the whole city.  
   - Route generator batches by area to **minimize criss-crossing** of the ward.

4. **Overflow handling**  
   - Citizens can raise an **overflow alert**; collectors see it as a priority flag in both the request list and route view.

5. **Incentive-aligned operations**  
   - Points are awarded **only on successful, correctly segregated pickups**.  
   - This encourages both citizens and collectors to respect segregation at source.

6. **Simple to deploy**  
   - Runs on a basic **Node + Mongo** stack with a light React UI.  
   - Routing heuristic is explainable and can be encoded in **ward SOPs** without needing data scientists.

---

### 6. Data model (Mongo collections)

#### `households`

- `householdId` (string, unique)
- `headName` (string)
- `area` (string; ward-level cluster, e.g., *“Bhetapara - Lane 1”*)
- `location` (lat, lng)
- `addressNote` (optional)

#### `pickupRequests`

- `householdId` (string, FK-style reference)
- `wasteType` (`"wet" | "dry" | "e-waste"`)
- `pickupTime` (Date)
- `overflow` (boolean)
- `status` (`"pending" | "assigned" | "completed"`)

#### `collectors`

- `name`
- `assignedWard` (e.g., `"Ward 4 - Guwahati"`)
- `shift` (`"morning" | "evening"`)

#### `incentives`

- `householdId`
- `points`

---

### 7. UI / UX notes

- **Color palette**:
  - Primary deep green `#0B3D2E`
  - Secondary lime green `#A7E92F`
  - Background light grey `#F4F6F5`
  - Status chips in green / yellow / red
- **Typography**:
  - Headings: `Poppins` / `Inter` (via Tailwind `font-heading`)
  - Body: `Inter` / `Roboto` (via Tailwind `font-body`)
- **Layout**:
  - Mobile-first, card-based, rounded corners, soft shadows.
  - No marketing pages; just **Citizen** and **Collector** flows.

You can walk judges through the full journey in **under 30 seconds** while still being able to double-click into routing and incentive logic when questioned.

