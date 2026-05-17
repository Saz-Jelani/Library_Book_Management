# Library Book Management - Full Project Explanation (Bangla)

## 1) Project ta ki?
Eta Angular 15 based ekti in-memory Library Management app.

Core features:
- Admin login
- Book catalog/list/add/edit/delete
- Member select kore book issue
- Issue renew/return/overdue/fine
- Dashboard stats
- Analytics charts

Important: kono backend/api nai. Data memory/localStorage based.

## 2) Entry point + App bootstrap

### `src/main.ts`
- `platformBrowserDynamic().bootstrapModule(AppModule)` diye Angular app start hoy.
- Error hole `console.error` e dekhay.

### `src/app/app.module.ts`
- Root module.
- `BrowserModule`, `BrowserAnimationsModule`, `AppRoutingModule`, `SharedModule` import.
- `AppComponent` bootstrap hoy.

## 3) Routing structure

### `src/app/app-routing.module.ts`
Routes:
- `/login` -> `AuthModule` (Guard: `RedirectIfLoggedInGuard`)
- `/dashboard` -> `DashboardModule` (Guard: `AuthGuard`)
- `/catalog` -> `CatalogModule` (Guard: `AuthGuard`)
- `/books` -> `BooksModule` (Guard: `AuthGuard`)
- `/issues` -> `IssuesModule` (Guard: `AuthGuard`)
- `/analytics` -> `AnalyticsModule` (Guard: `AuthGuard`)
- `/` -> `/login`
- `**` -> `/login`

## 4) Admin kivabe login kortese (exact flow)

### `src/app/features/auth/login.component.ts`
- Reactive form: `email`, `password`.
- Validation:
  - email required + valid email
  - password required + min 6
- `submit()` e:
  - invalid hole return

  LoginComponent-এ সহজভাবে যা হচ্ছে:


import ... অংশ

Component, FormBuilder, Validators, Router, MatSnackBar, AuthService আনা হয়েছে যেন login form বানানো, validation করা, page change করা, message দেখানো আর auth check করা যায়।



Component({ template: ... })

এখানে পুরো login UI inline template হিসেবে লেখা:


Email input

Password input (show/hide toggle সহ)

Error text (Valid email required, Min length 6)

Login button

loading হলে spinner দেখায়




hide = true; loading = false;


hide: password লুকানো থাকবে নাকি দেখাবে

loading: login click করার পর spinner/control করার জন্য




form = this.fb.group(...)

Reactive form বানানো হয়েছে 2টা field নিয়ে:


email: required + valid email format

password: required + minimum 6 character




constructor(...)

Dependency injection দিয়ে services নেওয়া হয়েছে:

fb → form বানাতে

auth → login check করতে

snack → ভুল হলে popup message

router → success হলে dashboard এ যেতে


submit() method

Form submit হলে এই flow:


যদি form invalid হয়, সাথে সাথে return

loading = true

setTimeout(..., 800) দিয়ে 800ms delay (fake loading effect)

তারপর auth.login(email, password) call

ok true হলে '/dashboard' এ navigate

false হলে snackbar: "Wrong credentials"

  - `loading=true`
  - 800ms `setTimeout` er por `auth.login(email,password)` call
  - success -> `/dashboard` navigate
  - fail -> snackbar `Wrong credentials`

### `src/app/core/services/auth.service.ts`
- `KEY = 'libraryUser'`
- `login(email,password)`:
  - hardcoded credential check: `admin@grade.com` + `admin123`
  - match hole `localStorage` e `{ email, role: 'Admin' }` save
  - true return
  - na hole false
- `logout()`:
  - localStorage key remove
  - `/login` e navigate
- `currentUser`:
  - localStorage theke user parse kore
- `isAuthenticated`:
  - `currentUser` thakle true

### Guard flow
#### `src/app/core/guards/auth.guard.ts`
- Protected route e dhukte chaile `auth.isAuthenticated` check.
- false hole `/login` e path tree return.

#### `src/app/core/guards/redirect-if-logged-in.guard.ts`
- Already login thakle `/login` e dhukte dibe na.
- direct `/dashboard` e path tree return.

## 5) Layout + Navbar

### `src/app/app.component.ts`
- `NavigationEnd` listen kore.
- URL `/login` hole `showNavbar=false`; onnothay `true`.

### `src/app/app.component.html`
- `showNavbar=true` hole full shell:
  - top navbar
  - left sidebar links
  - router-outlet main panel
- login route e simple router-outlet.

### `src/app/shared/navbar.component.ts`
- logged-in user email show kore.
- `logout()` e duita kaj:
  - `library.resetState()` -> issues clear
  - `auth.logout()` -> session remove + login page

## 6) Member data kothay

### `src/app/core/services/library.service.ts`
- `readonly members: Member[]` e hardcoded 8 jon member.
- kono create/update/delete member feature nai.
- issue modal e ei list use hoy.

### `src/app/core/models/library.models.ts`
- `Member` interface:
  - `id`, `name`, `email`, `phone`, `category`

## 7) Book data kothay, kivabe manage hocche

### `LibraryService` book state
- `booksSubject = new BehaviorSubject<Book[]>([...seed books...])`
- initial 10 ta book `mkBook(...)` diye create.
- `getBooks()` observable.
- `getBookById(id)` finder.

### CRUD methods
- `addBook(book)`:
  - new id generate: `B001`, `B002` style
  - list e push
- `updateBook(id, updates)`:
  - book find
  - `totalCopies` change hole active issues dhore `availableCopies` recalc
- `deleteBook(id)`:
  - active issued book hole delete block (`false`)
  - no active issue hole remove (`true`)
- `searchBooks(query)`:
  - title/author/isbn/genre filter

### UI side
#### `src/app/features/books/book-list.component.ts`
- table e books show
- search + CSV export
- actions: view/edit/issue/delete
- delete result snackbar e dekhay

#### `src/app/features/books/book-form.component.ts`
- add/edit same form
- route id thakle edit mode (`:id/edit`)
- publicationDate future hole block
- save hole `/books` e fire

#### `src/app/features/catalog/book-catalog.component.ts`
- card grid + details panel
- details theke issue/edit trigger

#### `src/app/features/catalog/book-details.component.ts`
- selected book details
- Issue Book / Edit button emit

#### `src/app/shared/book-card.component.ts`
- card click e selected emit
- availability text show

## 8) Issue system kothay, kivabe

### Issue data store
- `issuesSubject = new BehaviorSubject<Issue[]>([])`
- app start e empty.

### Issue create
#### `LibraryService.issueBook(bookId, memberId, dueDate?)`
Checks:
- book exist + availableCopies > 0
- member active issues < 3
Then:
- new issue create (`I001` style)
- default dueDate = issueDate + 14 days
- status `Issued`
- fine `0`
- renewal `0`
- `issuedBy = 'Admin'`
- issue save
- book availableCopies -1

### Issue return
#### `LibraryService.returnBook(issueId)`
- issue find
- return hole no-op
- overdue days calc
- fine = overdueDays * 5
- status `Returned`, returnDate set
- book availableCopies +1

### Renew
#### `LibraryService.renewBook(issueId)`
- max 2 renew
- due date +14 days
- renewalCount +1
- status `Issued`

### Overdue auto sync
#### `LibraryService.syncOverdues()`
- dueDate cross hole status `Overdue`, fine live update
- due date future hole overdue status back to `Issued`
- changed hole BehaviorSubject update

### Issue modal
#### `src/app/shared/issue-return-modal.component.ts` + `.html`
- selected book show
- member autocomplete
- dueDate pick
- rule:
  - member select must
  - book available must
  - dueDate future must
  - member already 3 active hole block
- confirm e `issueBook(...)` call

### Issue management page
#### `src/app/features/issues/issue-management.component.ts`
Tabs:
- Active Issues: renew/return
- Overdue: fine list
- Issue History: all status

## 9) Analytics kivabe kaj kore

### `src/app/features/analytics/analytics-dashboard.component.ts`
Cards:
- Total books
- Total members
- Active issues
- Overdue issues

Charts:
- Bar chart: genre wise book count
- Line chart: monthly issue count + monthly return count

Data source:
- `getBooks()` subscribe -> genre map build
- `getIssues()` subscribe -> active/overdue update
- `getMonthlyIssueCount()` -> last 12 month issue trend

### `src/app/features/analytics/analytics.module.ts`
- `NgChartsModule` import for `baseChart`.

## 10) Dashboard

### `src/app/features/dashboard/dashboard-home.component.ts`
- total books: books observable
- total members: static member array length
- active/overdue: service methods

Note: active/overdue constructor e set kora, issue change hole auto update hocche na unless component recreate hoy.

## 11) SharedModule role

### `src/app/shared/shared.module.ts`
- Common Angular Material modules centralize kore.
- Reusable components declare/export:
  - `NavbarComponent`
  - `BookCardComponent`
  - `IssueReturnModalComponent`

## 12) UI theme

### `src/styles.css`
- Angular Material `indigo-pink` base theme import
- Google font `Nunito`
- custom CSS variables + mat component skinning

### `src/app/app.component.css`
- fixed header
- left sidebar layout
- responsive style (<980px)

## 13) Data persistence summary
- Login session: `localStorage` (`libraryUser`)
- Books/issues/members: backend nai
- Books & issues runtime memory te (refresh hole reset)
- Members hardcoded static
- Logout e issues manually reset

## 14) Important limitations / reality check
- Real authentication na, hardcoded credential
- Role-based access actually single role only
- Member management CRUD nai
- Backend/database nai
- Dashboard active/overdue reactive na (possible improvement)

## 15) File map quick
- Auth:
  - `src/app/core/services/auth.service.ts`
  - `src/app/features/auth/login.component.ts`
  - `src/app/core/guards/auth.guard.ts`
  - `src/app/core/guards/redirect-if-logged-in.guard.ts`
- Books:
  - `src/app/features/books/*`
  - `src/app/features/catalog/*`
  - `src/app/shared/book-card.component.ts`
- Issues:
  - `src/app/features/issues/issue-management.component.ts`
  - `src/app/shared/issue-return-modal.component.ts`
  - `src/app/core/services/library.service.ts`
- Analytics:
  - `src/app/features/analytics/analytics-dashboard.component.ts`
- Models/state:
  - `src/app/core/models/library.models.ts`
  - `src/app/core/services/library.service.ts`

## 16) "Line by line" kivabe porte hobe practical way
Jodi literally line-by-line poro, ei order e porle easiest:
1. `main.ts`
2. `app.module.ts`
3. `app-routing.module.ts`
4. `auth.service.ts` + guards
5. `app.component.ts/html/css`
6. `library.models.ts`
7. `library.service.ts`
8. `features/*` modules and components
9. `shared/*`
10. `styles.css`

Eita follow korle "ki, keno, kivabe" logically clear hoy.
