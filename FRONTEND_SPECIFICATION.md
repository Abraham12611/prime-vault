# Prime Vault - Frontend Specification Document

**Version:** 1.0.0  
**Date:** February 2026  
**Purpose:** Complete UI/UX specification for redesign and development

---

## TABLE OF CONTENTS

1. [SITEMAP & PAGE STRUCTURE](#1-sitemap--page-structure)
2. [PAGE DETAILS](#2-page-details)
3. [COMPONENTS](#3-components)
4. [BUTTONS & ACTIONS](#4-buttons--actions)
5. [MODALS](#5-modals)
6. [FORMS & INPUTS](#6-forms--inputs)
7. [DATA TABLES](#7-data-tables)
8. [NAVIGATION](#8-navigation)
9. [UI/UX SPECIFICATIONS](#9-uiux-specifications)
10. [ANIMATIONS & TRANSITIONS](#10-animations--transitions)
11. [RESPONSIVE BREAKPOINTS](#11-responsive-breakpoints)
12. [THEMING & VARIABLES](#12-theming--variables)

---

## 1. SITEMAP & PAGE STRUCTURE

```
/
├── /landing (Public - Marketing Landing Page)
│   └── /#features
│   └── /#how-it-works
│   └── /#pricing
│   └── /#security
│
├── /connect (Public - Wallet Connection)
│
├── /onboard (Protected - Institution Onboarding)
│   ├── /onboard/welcome
│   ├── /onboard/safe-setup
│   ├── /onboard/risk-config
│   └── /onboard/complete
│
├── /dashboard (Protected - Main Dashboard)
│   ├── /dashboard/overview
│   ├── /dashboard/portfolio
│   ├── /dashboard/trade
│   ├── /dashboard/risk
│   └── /dashboard/history
│
├── /vault (Protected - Vault Management)
│   ├── /vault/deposit
│   ├── /vault/withdraw
│   └── /vault/settings
│
├── /governance (Protected - Multi-sig)
│   ├── /governance/pending
│   ├── /governance/executed
│   └── /governance/settings
│
├── /analytics (Protected - Reports)
│   ├── /analytics/performance
│   ├── /analytics/risk
│   └── /analytics/export
│
└── /settings (Protected - User Settings)
    ├── /settings/profile
    ├── /settings/security
    ├── /settings/notifications
    └── /settings/api
```

---

## 2. PAGE DETAILS

### 2.1 LANDING PAGE (`/landing`)

**Purpose:** Marketing page for institutions to learn about Prime Vault

**Layout Structure:**
- Fixed navigation header
- Hero section with CTA
- Logo carousel (institutional partners)
- Features grid (4-6 cards)
- How it works section (3 steps)
- Security features section
- Testimonials carousel
- Pricing section
- FAQ accordion
- Footer with links

**Sections:**

1. **Hero Section**
   - Headline: "Institutional DeFi, Simplified"
   - Subheadline: "Secure, compliant prime brokerage for decentralized finance"
   - CTA Button: "Get Started" (primary)
   - Secondary CTA: "View Demo" (ghost)
   - Background: Gradient or abstract geometric pattern

2. **Trust Bar**
   - Text: "Trusted by leading institutions"
   - Logo carousel (5-8 logos)

3. **Features Grid**
   - 6 feature cards in 3x2 grid
   - Each card: icon + title + description

4. **How It Works**
   - 3-step vertical timeline
   - Step 1: Connect & Configure
   - Step 2: Deposit & Trade
   - Step 3: Monitor & Govern

5. **Security Section**
   - Safe multi-sig integration showcase
   - Compliance badges
   - Security certifications

6. **Testimonials**
   - Carousel with 3 testimonials
   - Institution logo + quote + person

7. **Pricing**
   - 3-tier pricing cards
   - Enterprise CTA

8. **FAQ**
   - Accordion with 5-8 questions

---

### 2.2 CONNECT PAGE (`/connect`)

**Purpose:** Wallet connection gateway

**Layout:**
- Centered card layout
- Logo at top
- Wallet connection options
- Network selector

**Elements:**
1. **Prime Vault Logo** (centered, large)
2. **Connect Wallet Button Group**:
   - MetaMask
   - WalletConnect
   - Coinbase Wallet
   - Ledger
3. **Network Selector Dropdown**:
   - Arbitrum One
   - Arbitrum Sepolia (testnet)
4. **Terms Checkbox**: "I agree to Terms of Service"
5. **Help Link**: "Need help connecting?"

---

### 2.3 ONBOARDING FLOW (`/onboard/*`)

**Purpose:** Step-by-step institution setup

#### 2.3.1 Welcome (`/onboard/welcome`)

**Layout:**
- Progress indicator (step 1 of 4)
- Centered content
- Large illustration/icon

**Content:**
- Title: "Welcome to Prime Vault"
- Description: "Let's set up your institutional vault in a few simple steps"
- "What you'll need:" checklist
- CTA: "Get Started" button

#### 2.3.2 Safe Setup (`/onboard/safe-setup`)

**Layout:**
- Progress indicator (step 2 of 4)
- Form layout

**Form Fields:**
1. **Institution Name** (text input)
2. **Owner Addresses** (dynamic list)
   - Add/remove buttons
   - Minimum 2 owners
   - Address validation
3. **Signature Threshold** (slider or dropdown)
   - Range: 1 to N (number of owners)
   - Recommendation: "We recommend 3 of 5 for security"
4. **Preview Card**: Shows Safe configuration summary

**Buttons:**
- "Back" (secondary)
- "Continue" (primary, disabled until valid)

#### 2.3.3 Risk Configuration (`/onboard/risk-config`)

**Layout:**
- Progress indicator (step 3 of 4)
- Form with sections

**Configuration Options:**

1. **Collateral Requirements**
   - Min Collateral Ratio slider (120% - 200%)
   - Display: "150% selected"
   - Tooltip: "Minimum collateral required for trading"

2. **Position Limits**
   - Max Position Size input (ETH denomination)
   - Daily Trade Limit input

3. **Approved Protocols**
   - Checkbox list:
     * Uniswap V3
     * Curve Finance
     * Aave V3
     * Balancer
   - "Select All" option

4. **Liquidation Settings**
   - Grace period slider (hours)
   - Notification preferences

**Buttons:**
- "Back" (secondary)
- "Review Configuration" (primary)

#### 2.3.4 Complete (`/onboard/complete`)

**Layout:**
- Progress indicator (step 4 of 4 - complete)
- Success animation
- Summary cards

**Content:**
- Success icon/animation
- Title: "Your Vault is Ready!"
- Summary cards:
  * Safe Address (with copy button)
  * Institution ID
  * Risk Level badge
  * Next steps checklist
- CTA: "Go to Dashboard" (primary)

---

### 2.4 DASHBOARD (`/dashboard/*`)

**Purpose:** Main control center for institutions

**Layout:**
- Fixed sidebar navigation
- Top header with search/notifications
- Main content area

#### 2.4.1 Overview (`/dashboard/overview`)

**Widgets (Grid Layout 2x2 or 3x2):**

1. **Portfolio Value Card**
   - Total value (large number)
   - 24h change (percentage + trend arrow)
   - Mini sparkline chart
   - "View Details" link

2. **Risk Score Card**
   - Risk score (0-100 gauge)
   - Status badge ("Healthy", "Warning", "Critical")
   - Collateral ratio

3. **Active Positions Card**
   - Number of positions
   - Largest position (asset + value)
   - "View All" link

4. **Pending Transactions Card**
   - Number pending
   - Time since first pending
   - Quick action buttons

5. **Recent Activity Timeline**
   - Last 5 activities
   - Icons for different actions
   - Time ago labels

6. **Quick Actions Grid**
   - 4 buttons: Trade, Deposit, Withdraw, Govern

#### 2.4.2 Portfolio (`/dashboard/portfolio`)

**Layout:**
- Summary header
- Asset breakdown (pie/bar chart)
- Positions table
- Performance chart

**Sections:**

1. **Portfolio Summary**
   - Total value
   - Asset allocation
   - Unrealized P&L

2. **Asset Allocation Chart**
   - Interactive pie/donut chart
   - Legend with percentages
   - Click to filter table

3. **Positions Table**
   - Columns:
     * Asset (icon + symbol + name)
     * Position Size
     * Value (USD)
     * Entry Price
     * Current Price
     * P&L (% + $)
     * Actions (Close, Edit)
   - Filters: Asset type, P&L status
   - Sorting: All columns
   - Pagination: 10/25/50/100 rows

4. **Performance Chart**
   - Time range selector (1D, 1W, 1M, 3M, 1Y, ALL)
   - Line chart with two lines:
     * Portfolio value
     * Benchmark (optional)
   - Hover tooltips

#### 2.4.3 Trade (`/dashboard/trade`)

**Layout:**
- Two-column layout
- Left: Order form
- Right: Market data + confirmation

**Order Form:**

1. **Protocol Selector**
   - Dropdown: Uniswap, Curve, etc.
   - Shows TVL and gas estimate

2. **Trade Type Tabs**
   - Market Order
   - Limit Order
   - Stop Loss

3. **Token Pair Selector**
   - From: Token dropdown + amount input
   - Swap direction button (icon)
   - To: Token dropdown + amount output
   - Exchange rate display

4. **Order Details**
   - Slippage tolerance slider (0.1% - 5%)
   - Minimum received
   - Price impact warning (>2%)
   - Gas estimate
   - Protocol fee

5. **Risk Check Preview**
   - Post-trade collateral ratio
   - Position size check
   - Warning if approaching limits

**Confirmation Panel:**
- Trade summary
- Multi-sig requirement notice
- "Create Proposal" button (submits to Safe)

#### 2.4.4 Risk (`/dashboard/risk`)

**Layout:**
- Risk dashboard
- Metrics grid
- Alerts section

**Sections:**

1. **Risk Overview**
   - Risk score gauge (0-100)
   - Health status (color coded)
   - Key metrics:
     * Collateral Ratio
     * Liquidation Price
     * Available Margin

2. **Risk Metrics Grid**
   - 6 metric cards:
     * Current Leverage
     * Max Drawdown
     * Daily Volume Used
     * Largest Position Concentration
     * Liquidation Buffer
     * Approved Protocols Used

3. **Alerts & Warnings**
   - List of active alerts
   - Severity levels (info, warning, critical)
   - Dismissible alerts
   - Timestamp

4. **Risk Settings Quick Access**
   - "Modify Risk Parameters" button
   - Shows current settings summary

#### 2.4.5 History (`/dashboard/history`)

**Layout:**
- Filter bar
- Transaction table
- Export options

**Transaction Table:**
- Columns:
  * Transaction Hash (truncated)
  * Type (Trade, Deposit, Withdraw, Governance)
  * Asset(s)
  * Amount
  * Value (USD)
  * Status (Pending, Success, Failed)
  * Timestamp
  * Actions (View on Arbiscan)
- Filters:
  * Date range picker
  * Transaction type
  * Asset
  * Status
- Sorting: All columns
- Pagination: 10/25/50/100 rows
- Export: CSV, PDF buttons

---

### 2.5 VAULT (`/vault/*`)

**Purpose:** Deposit and withdrawal management

#### 2.5.1 Deposit (`/vault/deposit`)

**Layout:**
- Single column form
- QR code display
- Asset selection

**Form:**

1. **Asset Selector**
   - Dropdown with token icons
   - Search functionality
   - Shows balance

2. **Deposit Address Display**
   - Safe address (read-only)
   - Copy button
   - QR code (large)
   - "This is your institution's Safe address"

3. **Amount Input**
   - Number input with token symbol
   - "Max" button
   - Shows USD equivalent

4. **Network Warning**
   - "Only send on Arbitrum One"
   - Warning about lost funds on wrong network

5. **Transaction Preview**
   - Shows estimated gas
   - Deposit time estimate

**Buttons:**
- "Generate Deposit Transaction" (creates Safe tx)

#### 2.5.2 Withdraw (`/vault/withdraw`)

**Layout:**
- Two-step process
- Form + confirmation

**Step 1 - Form:**

1. **Destination Address**
   - Address input with validation
   - Address book dropdown (saved addresses)
   - "Same as Safe" toggle

2. **Asset & Amount**
   - Asset selector
   - Amount input
   - Balance display
   - "Max" button

3. **Security Checks**
   - Withdrawal limit check
   - Daily limit status
   - "This withdrawal requires multi-sig approval"

**Step 2 - Confirmation:**
- Withdrawal summary
- Address verification (show full address)
- Amount + fee breakdown
- Multi-sig requirement notice
- "Create Withdrawal Proposal" button

#### 2.5.3 Settings (`/vault/settings`)

**Layout:**
- Tabs or accordion

**Sections:**

1. **General Settings**
   - Institution name (editable)
   - Safe address (read-only)
   - Creation date

2. **Owner Management**
   - List of current owners
   - Add owner button (opens modal)
   - Remove owner buttons
   - Change threshold button

3. **Risk Parameters**
   - Edit all risk settings
   - Shows current vs proposed changes
   - "Propose Changes" button

4. **Emergency Actions**
   - Pause trading button
   - Emergency withdraw button
   - Both require multi-sig

---

### 2.6 GOVERNANCE (`/governance/*`)

**Purpose:** Multi-sig transaction management

#### 2.6.1 Pending (`/governance/pending`)

**Layout:**
- Queue of pending transactions
- Action buttons per item

**Pending Transaction Cards:**

Each card shows:
- Transaction type icon
- Title (e.g., "Swap 1000 USDC for ETH")
- Submitted by + timestamp
- Current confirmation count: "2 of 3 signatures"
- List of signers (confirmed vs pending)
- Action buttons:
  * "Confirm" (if not signed)
  * "Reject" (if not executed)
  * "View Details"

**Details Modal:**
- Full transaction data
- Raw transaction hex
- Simulation results
- Signer status for each owner
- History of signatures

#### 2.6.2 Executed (`/governance/executed`)

**Layout:**
- Similar to pending but historical
- Status badges (Success, Failed)

**Table:**
- Transaction hash
- Description
- Execution date
- Signers who approved
- Gas used
- Status
- Actions: View on Arbiscan

#### 2.6.3 Settings (`/governance/settings`)

**Layout:**
- Current configuration display
- Modification proposals

**Content:**
- Current threshold display
- Owner list with names (editable)
- "Propose New Owner" button
- "Propose Threshold Change" button
- Transaction history settings

---

### 2.7 ANALYTICS (`/analytics/*`)

**Purpose:** Performance and risk reporting

#### 2.7.1 Performance (`/analytics/performance`)

**Layout:**
- Date range selector
- Charts and metrics

**Charts:**
1. **Portfolio Value Over Time**
   - Line chart
   - Compare to ETH, BTC
   - Zoom/pan enabled

2. **Returns Breakdown**
   - Bar chart by asset
   - Realized vs unrealized

3. **Trading Activity**
   - Volume over time
   - Trade frequency

**Metrics:**
- Total Return (%, $)
- Annualized Return
- Sharpe Ratio
- Max Drawdown
- Win Rate
- Average Trade Size

#### 2.7.2 Risk (`/analytics/risk`)

**Layout:**
- Risk visualization
- Historical risk metrics

**Visualizations:**
1. **Risk Score History**
   - Line chart over time

2. **Collateral Ratio History**
   - Shows ratio over time
   - Highlight danger zones

3. **Exposure Analysis**
   - Heat map by asset/protocol
   - Correlation matrix

**Risk Reports:**
- Value at Risk (VaR)
- Expected Shortfall
- Stress test results

#### 2.7.3 Export (`/analytics/export`)

**Layout:**
- Report generation form

**Options:**
1. **Report Type**
   - Portfolio Statement
   - Tax Report
   - Trade History
   - Risk Report

2. **Date Range**
   - Start date
   - End date
   - Presets (This Month, Last Month, YTD, etc.)

3. **Format**
   - PDF
   - CSV
   - Excel

4. **Generate Button**
   - Shows loading state
   - Download link when ready

---

### 2.8 SETTINGS (`/settings/*`)

**Purpose:** User account and application settings

#### 2.8.1 Profile (`/settings/profile`)

**Form:**
1. **Display Name**
2. **Email Address**
3. **Institution Role**
   - Dropdown: Admin, Trader, Viewer
4. **Avatar/Logo Upload**
5. **Save Changes Button**

#### 2.8.2 Security (`/settings/security`)

**Sections:**

1. **Connected Wallets**
   - List connected wallets
   - Disconnect button
   - Primary wallet indicator

2. **Session Management**
   - Active sessions list
   - Revoke all sessions button
   - Last active timestamps

3. **Two-Factor Authentication**
   - Enable/Disable 2FA
   - QR code setup
   - Backup codes

4. **Transaction Signing**
   - Hardware wallet integration
   - Signing preferences

#### 2.8.3 Notifications (`/settings/notifications`)

**Preferences:**
- Email notifications toggle
- Push notifications toggle
- Notification types:
  * Trade executions
  * Governance actions
  * Risk alerts
  * Security events
  * Weekly summaries

#### 2.8.4 API (`/settings/api`)

**Sections:**

1. **API Keys**
   - Generate new key button
   - List of existing keys
   - Revoke button per key
   - Permissions selector per key

2. **Webhook Configuration**
   - URL input
   - Event type selector
   - Test webhook button
   - Secret key display

3. **Documentation Link**
   - Link to API docs

---

## 3. COMPONENTS

### 3.1 Reusable UI Components

#### 3.1.1 Token Selector
- **Purpose:** Select cryptocurrency tokens
- **Elements:**
  * Search input
  * Token list with icons
  * Recent selections section
  * Balance display
- **States:** Default, Open, Selected, Disabled
- **Props:** `tokens[]`, `onSelect`, `selectedToken`, `showBalances`

#### 3.1.2 Risk Gauge
- **Purpose:** Display risk score visually
- **Elements:**
  * Semi-circular gauge (0-100)
  * Color gradient (green → yellow → red)
  * Current value display
  * Status label
- **States:** Healthy, Warning, Critical
- **Props:** `score`, `size`, `showLabel`

#### 3.1.3 Transaction Status Badge
- **Purpose:** Show transaction state
- **Variants:**
  * Pending (spinner + "Pending")
  * Success (checkmark + "Confirmed")
  * Failed (X + "Failed")
  * Requires Action (exclamation)
- **Props:** `status`, `confirmations`, `requiredConfirmations`

#### 3.1.4 Portfolio Chart
- **Purpose:** Show portfolio value over time
- **Elements:**
  * Line chart
  * Hover tooltips
  * Time range selector
  * Legend
- **Props:** `data`, `timeRange`, `showBenchmark`, `height`

#### 3.1.5 Asset Allocation Chart
- **Purpose:** Show portfolio composition
- **Elements:**
  * Pie or donut chart
  * Interactive segments
  * Legend with percentages
  * Click to filter
- **Props:** `allocations[]`, `onSegmentClick`, `showLegend`

#### 3.1.6 Price Display
- **Purpose:** Show asset price with change
- **Elements:**
  * Current price (large)
  * 24h change (percentage + arrow)
  * Trend indicator (up/down arrow)
- **Props:** `price`, `change24h`, `currency`, `decimals`

#### 3.1.7 Safe Address Display
- **Purpose:** Show Safe wallet address
- **Elements:**
  * Truncated address (0x1234...5678)
  * Copy button
  * External link (Arbiscan)
  * QR code option
- **Props:** `address`, `showQR`, `network`

#### 3.1.8 Multi-sig Progress
- **Purpose:** Show signature progress
- **Elements:**
  * Progress bar
  * "X of Y signatures"
  * List of signers with status icons
- **Props:** `signatures`, `required`, `signers[]`, `showDetails`

#### 3.1.9 Network Badge
- **Purpose:** Indicate active network
- **Elements:**
  * Network icon
  * Network name
  * Connection status dot
- **Variants:** Arbitrum One, Arbitrum Sepolia, Disconnected
- **Props:** `network`, `isConnected`

#### 3.1.10 Slippage Selector
- **Purpose:** Set slippage tolerance
- **Elements:**
  * Preset buttons (0.1%, 0.5%, 1%)
  * Custom input option
  * Current selection highlight
- **Props:** `value`, `onChange`, `presets[]`

---

## 4. BUTTONS & ACTIONS

### 4.1 Primary Buttons

| Button | Location | Action | States |
|--------|----------|--------|--------|
| **Connect Wallet** | /connect | Opens wallet connection modal | Default, Hover, Loading, Connected |
| **Get Started** | /landing | Navigates to /connect | Default, Hover |
| **Create Institution** | /onboard/safe-setup | Creates Safe + registers | Default, Hover, Loading, Disabled |
| **Continue** | Onboarding steps | Proceeds to next step | Default, Hover, Disabled |
| **Execute Trade** | /dashboard/trade | Submits trade proposal | Default, Hover, Loading, Disabled |
| **Confirm Transaction** | /governance | Signs pending tx | Default, Hover, Loading |
| **Deposit** | /vault/deposit | Creates deposit proposal | Default, Hover, Loading |
| **Withdraw** | /vault/withdraw | Creates withdrawal proposal | Default, Hover, Loading |
| **Generate Report** | /analytics/export | Creates PDF/CSV | Default, Hover, Loading |
| **Save Changes** | Settings pages | Persists settings | Default, Hover, Loading |

### 4.2 Secondary Buttons

| Button | Location | Action | States |
|--------|----------|--------|--------|
| **View Demo** | /landing | Opens demo video | Default, Hover |
| **Back** | Onboarding | Returns to previous | Default, Hover |
| **Cancel** | Modals | Closes modal without action | Default, Hover |
| **Reject Transaction** | /governance | Rejects pending tx | Default, Hover |
| **Disconnect** | Header | Disconnects wallet | Default, Hover |
| **Copy** | Address displays | Copies to clipboard | Default, Copied (temporary) |
| **View on Arbiscan** | Transaction tables | Opens explorer | Default, Hover |
| **Export** | Tables | Exports data | Default, Hover, Loading |

### 4.3 Icon Buttons

| Button | Icon | Location | Action |
|--------|------|----------|--------|
| **Notifications** | Bell | Header | Opens notification dropdown |
| **Settings** | Gear | Header | Opens settings menu |
| **Refresh** | Refresh | Dashboard | Refreshes data |
| **Expand** | Maximize | Charts | Opens full-screen view |
| **Filter** | Filter | Tables | Opens filter panel |
| **Search** | Search | Header | Opens search modal |
| **Close** | X | Modals/Toasts | Closes element |
| **Info** | Info | Form fields | Shows tooltip |

### 4.4 Action Buttons in Tables

| Button | Icon | Purpose |
|--------|------|---------|
| **Edit** | Pencil | Edit row data |
| **Delete** | Trash | Delete row |
| **View** | Eye | View details |
| **Copy** | Copy | Copy data |
| **External Link** | External Link | Open in new tab |
| **More** | Three dots | Open actions menu |

---

## 5. MODALS

### 5.1 Wallet Connection Modal

**Trigger:** Click "Connect Wallet" button

**Layout:**
- Centered card
- Dark overlay background

**Content:**
1. **Header**: "Connect Wallet" + close X
2. **Wallet Options** (list):
   - MetaMask (icon + name)
   - WalletConnect (icon + name)
   - Coinbase Wallet (icon + name)
   - Ledger (icon + name)
3. **Terms Checkbox**: "I agree to Terms"
4. **Footer**: "Need help?" link

**States:**
- Default: Show wallet options
- Connecting: Loading spinner on selected wallet
- Error: Show error message with retry

---

### 5.2 Trade Confirmation Modal

**Trigger:** Click "Review Trade" button

**Layout:**
- Centered card (large)

**Content:**
1. **Header**: "Confirm Trade" + close X
2. **Trade Summary**:
   - From: [Amount] [Token]
   - Arrow icon (↓)
   - To: [Amount] [Token]
   - Exchange rate
3. **Details Table**:
   | Label | Value |
   |-------|-------|
   | Slippage | 0.5% |
   | Min. Received | [Amount] |
   | Protocol Fee | [Amount] |
   | Gas Estimate | [Amount] |
4. **Risk Check Results**:
   - Post-trade collateral ratio
   - Status (✓ Healthy / ⚠ Warning)
5. **Multi-sig Notice**: "This requires X of Y signatures"
6. **Buttons**:
   - "Cancel" (secondary)
   - "Create Proposal" (primary)

---

### 5.3 Deposit/Withdraw Modal

**Trigger:** Click "Deposit" or "Withdraw" buttons

**Layout:**
- Centered card

**Deposit Content:**
1. **Header**: "Deposit to Safe"
2. **Safe Address Display**:
   - Full address
   - Copy button
   - QR code (large)
3. **Warning**: "Only send on Arbitrum One"
4. **Supported Assets** list
5. **Close Button**

**Withdraw Content:**
1. **Header**: "Withdraw Funds"
2. **Form**:
   - Destination address input
   - Asset selector
   - Amount input
3. **Summary**:
   - Withdrawal amount
   - Network fee
   - Total
4. **Multi-sig Notice**
5. **Buttons**:
   - "Cancel"
   - "Create Withdrawal Proposal"

---

### 5.4 Transaction Details Modal

**Trigger:** Click on transaction row

**Layout:**
- Centered card (large)

**Content:**
1. **Header**: Transaction type icon + "Transaction Details"
2. **Status Badge**: Pending/Success/Failed
3. **Info Grid**:
   | Field | Value |
   |-------|-------|
   | Hash | 0x1234...5678 [copy] [external] |
   | Type | Swap |
   | From | Token A |
   | To | Token B |
   | Amount | 1000 USDC |
   | Timestamp | Jan 15, 2026 14:30 |
   | Gas Used | 125,000 |
4. **Signers Section** (for pending):
   - List of signers
   - Checkmark for confirmed
   - Clock icon for pending
5. **Raw Data**: Collapsible section
6. **Footer Buttons**:
   - "Close"
   - "View on Arbiscan"

---

### 5.5 Add Owner Modal

**Trigger:** Click "Add Owner" in governance settings

**Content:**
1. **Header**: "Add Safe Owner"
2. **Form**:
   - Owner address input (with validation)
   - Owner name input (optional)
3. **Current Threshold**: "Currently requires X of Y"
4. **New Threshold**: Slider to adjust
5. **Warning**: "This requires multi-sig approval"
6. **Buttons**:
   - "Cancel"
   - "Create Proposal"

---

### 5.6 Risk Alert Modal

**Trigger:** Automatic when risk threshold exceeded

**Layout:**
- Centered card
- Warning color scheme (orange/red)

**Content:**
1. **Header**: Warning icon + "Risk Alert"
2. **Alert Message**: "Your collateral ratio has fallen below 150%"
3. **Current Metrics**:
   - Current ratio: 142%
   - Liquidation threshold: 110%
   - Buffer: 32%
4. **Recommended Actions**:
   - "Deposit collateral" button
   - "Reduce positions" button
5. **Dismiss Button**: "I understand the risks"

---

### 5.7 Token Selector Modal

**Trigger:** Click token selector in trade form

**Layout:**
- Centered card (medium height)

**Content:**
1. **Header**: "Select Token" + search input
2. **Tabs**: "All" | "Favorites" | "Popular"
3. **Token List** (scrollable):
   - Token icon
   - Symbol
   - Name
   - Balance
4. **Footer**: "Manage token list" link

**Features:**
- Real-time search
- Keyboard navigation (arrow keys + enter)
- Recently used section

---

### 5.8 Settings Confirmation Modal

**Trigger:** When changing critical settings

**Content:**
1. **Header**: "Confirm Changes"
2. **Change Summary**:
   - Setting name
   - Old value → New value
3. **Impact Warning**: "This will affect..."
4. **Multi-sig notice**: "Requires X of Y signatures"
5. **Buttons**:
   - "Cancel"
   - "Confirm & Create Proposal"

---

### 5.9 QR Code Modal

**Trigger:** Click "Show QR" on address displays

**Content:**
1. **Header**: "Scan QR Code"
2. **Large QR Code**: Centered
3. **Address**: Below QR code (copyable)
4. **Network**: Badge showing network
5. **Close Button**

---

### 5.10 Help/Tooltip Modal

**Trigger:** Click info icon

**Content:**
1. **Header**: Contextual title
2. **Body**: Explanatory text
3. **Learn More**: External link
4. **Close Button**

---

## 6. FORMS & INPUTS

### 6.1 Text Inputs

| Input | Validation | Placeholder | Help Text |
|-------|------------|-------------|-----------|
| **Institution Name** | Required, 3-100 chars | "Acme Capital" | "This name will be displayed throughout the app" |
| **Owner Address** | Valid Ethereum address | "0x..." | "Enter a valid Ethereum address" |
| **Amount** | Number, >0, <= balance | "0.0" | "Enter amount in token units" |
| **Search** | Optional | "Search tokens, transactions..." | - |
| **Email** | Valid email format | "admin@institution.com" | "For notifications and alerts" |

### 6.2 Select Inputs

| Input | Options | Default |
|-------|---------|---------|
| **Protocol** | Uniswap V3, Curve, Aave, Balancer | Uniswap V3 |
| **Token** | Dynamic based on approved list | ETH |
| **Time Range** | 1D, 1W, 1M, 3M, 1Y, ALL | 1M |
| **Network** | Arbitrum One, Sepolia | Arbitrum One |
| **Report Type** | Portfolio, Tax, Trades, Risk | Portfolio |
| **Signature Threshold** | 1 to N (owners) | 2 |

### 6.3 Sliders

| Slider | Range | Step | Default |
|--------|-------|------|---------|
| **Collateral Ratio** | 120% - 200% | 5% | 150% |
| **Slippage** | 0.1% - 5% | 0.1% | 0.5% |
| **Signature Threshold** | 1 - N | 1 | 2 |
| **Daily Limit** | 0 - 1000 ETH | 10 ETH | 100 ETH |
| **Position Size** | 0 - 500 ETH | 5 ETH | 50 ETH |

### 6.4 Checkboxes

| Checkbox | Default | Description |
|----------|---------|-------------|
| **I agree to Terms** | Unchecked | Required for registration |
| **Uniswap V3** | Checked | Approved protocol |
| **Curve Finance** | Checked | Approved protocol |
| **Aave V3** | Unchecked | Approved protocol |
| **Email Notifications** | Checked | Receive email alerts |
| **Push Notifications** | Checked | Receive push alerts |

### 6.5 Toggle Switches

| Toggle | Default | Description |
|--------|---------|-------------|
| **2FA Enabled** | Off | Two-factor authentication |
| **Test Mode** | Off | Use testnet |
| **Auto-approve Small Trades** | Off | Skip multi-sig for small amounts |
| **Dark Mode** | System | UI theme |

---

## 7. DATA TABLES

### 7.1 Positions Table

**Columns:**
1. **Asset**: Icon + Symbol + Name
2. **Amount**: Number with decimals
3. **Value**: USD formatted
4. **Entry Price**: USD formatted
5. **Current Price**: USD formatted
6. **P&L**: Percentage + USD (color coded)
7. **Actions**: Close button

**Features:**
- Sortable columns
- Filter by asset type
- Search
- Pagination (10/25/50/100)
- Export to CSV

---

### 7.2 Transaction History Table

**Columns:**
1. **Hash**: Truncated with copy button
2. **Type**: Icon + label (Swap, Deposit, Withdraw)
3. **Asset**: Token icons
4. **Amount**: With + or - prefix
5. **Value**: USD at time of tx
6. **Status**: Badge
7. **Time**: Relative (2 mins ago)
8. **Actions**: View details button

**Features:**
- Date range filter
- Type filter
- Status filter
- Asset filter
- Sort by time

---

### 7.3 Governance Queue Table

**Columns:**
1. **Transaction**: Description
2. **Submitted**: Time ago
3. **Signatures**: Progress bar
4. **Your Status**: Confirmed/Pending
5. **Actions**: Confirm/Reject buttons

**Features:**
- Group by status
- Priority ordering

---

## 8. NAVIGATION

### 8.1 Main Navigation (Sidebar)

**Items:**
1. **Dashboard** (Home icon)
   - Overview
   - Portfolio
   - Trade
   - Risk
   - History

2. **Vault** (Wallet icon)
   - Deposit
   - Withdraw
   - Settings

3. **Governance** (Shield icon)
   - Pending
   - Executed
   - Settings

4. **Analytics** (Chart icon)
   - Performance
   - Risk
   - Export

5. **Settings** (Gear icon)
   - Profile
   - Security
   - Notifications
   - API

**States:**
- Collapsed: Icons only
- Expanded: Icons + labels
- Active item: Highlighted background

### 8.2 Top Header

**Elements:**
1. **Logo**: Prime Vault mark
2. **Search Bar**: Global search (cmd/ctrl + k)
3. **Network Badge**: Current network
4. **Notifications**: Bell with badge count
5. **Wallet**: Address display + disconnect
6. **User Menu**: Avatar dropdown
   - Profile
   - Settings
   - Help
   - Disconnect

### 8.3 Breadcrumbs

**Format:** Home > Section > Page

**Example:** Dashboard > Trade > Execute

**Features:**
- Click to navigate back
- Current page not clickable

### 8.4 Mobile Navigation

**Bottom Tab Bar:**
1. Dashboard
2. Trade
3. Vault
4. Governance
5. Menu

---

## 9. UI/UX SPECIFICATIONS

### 9.1 Color Palette

**Primary Colors:**
- Primary: `#0052FF` (Arbitrum blue)
- Primary Dark: `#0039B3`
- Primary Light: `#4D85FF`

**Semantic Colors:**
- Success: `#00C853`
- Warning: `#FFB300`
- Error: `#FF1744`
- Info: `#00B0FF`

**Neutral Colors:**
- Background: `#0A0A0F`
- Surface: `#141419`
- Surface Elevated: `#1E1E24`
- Border: `#2A2A35`
- Text Primary: `#FFFFFF`
- Text Secondary: `#9CA3AF`
- Text Tertiary: `#6B7280`

**Accent Colors:**
- ETH: `#627EEA`
- USDC: `#2775CA`
- WBTC: `#F7931A`

### 9.2 Typography

**Font Family:** Inter, system-ui, sans-serif

**Hierarchy:**
| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| H1 | 48px | 700 | 1.1 | Page titles |
| H2 | 36px | 600 | 1.2 | Section headers |
| H3 | 24px | 600 | 1.3 | Card titles |
| H4 | 20px | 600 | 1.4 | Subsection |
| Body | 16px | 400 | 1.5 | Paragraphs |
| Body Small | 14px | 400 | 1.5 | Secondary text |
| Caption | 12px | 500 | 1.4 | Labels, timestamps |
| Button | 16px | 600 | 1 | Button text |

### 9.3 Spacing System

**Base Unit:** 4px

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Icon gaps |
| md | 16px | Component padding |
| lg | 24px | Section gaps |
| xl | 32px | Large gaps |
| 2xl | 48px | Page sections |
| 3xl | 64px | Major sections |

### 9.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 4px | Buttons, inputs |
| md | 8px | Cards, modals |
| lg | 12px | Large cards |
| xl | 16px | Modals |
| full | 9999px | Pills, avatars |

### 9.5 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| sm | 0 1px 2px rgba(0,0,0,0.3) | Buttons |
| md | 0 4px 6px rgba(0,0,0,0.4) | Cards |
| lg | 0 10px 15px rgba(0,0,0,0.5) | Modals |
| glow | 0 0 20px rgba(0,82,255,0.3) | Primary buttons |

---

## 10. ANIMATIONS & TRANSITIONS

### 10.1 Page Transitions

**Type:** Fade + slide
- Duration: 300ms
- Easing: ease-out
- Effect: Opacity 0→1, translateY 20px→0

### 10.2 Button Hover

**Primary Button:**
- Background lightens 10%
- Box shadow glow appears
- Duration: 200ms
- Easing: ease

**Secondary Button:**
- Border color changes to primary
- Duration: 200ms

### 10.3 Modal Open/Close

**Open:**
- Overlay fade in: 200ms
- Scale modal: 0.95→1, opacity 0→1
- Duration: 300ms
- Easing: cubic-bezier(0.16, 1, 0.3, 1)

**Close:**
- Reverse animation
- Duration: 200ms

### 10.4 Loading States

**Button Loading:**
- Spinner replaces text
- Disabled state
- Spinner: rotate 360deg, 1s linear infinite

**Skeleton Loading:**
- Shimmer animation
- Background gradient moves left to right
- Duration: 1.5s
- Easing: ease-in-out

### 10.5 Data Updates

**Number Changes:**
- Count up animation
- Duration: 500ms
- Easing: ease-out

**Table Row Add:**
- Slide in from left
- Fade in
- Duration: 300ms

### 10.6 Toast Notifications

**Enter:**
- Slide in from right
- Duration: 300ms
- Easing: cubic-bezier(0.68, -0.55, 0.265, 1.55)

**Exit:**
- Slide out to right
- Duration: 200ms

**Auto-dismiss:** 5 seconds

### 10.7 Chart Animations

**Line Chart:**
- Draw line animation left to right
- Duration: 1s
- Easing: ease-out

**Pie Chart:**
- Segments expand from center
- Duration: 800ms
- Stagger: 100ms between segments

---

## 11. RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Target |
|------------|-------|--------|
| Mobile | < 640px | Phones |
| Tablet | 640px - 1024px | Tablets |
| Desktop | 1024px - 1440px | Laptops |
| Large | > 1440px | Desktops |

### Mobile Adaptations

- Sidebar → Bottom tab bar
- Tables → Card lists
- Two columns → Single column
- Modals → Full screen sheets
- Charts → Simplified versions
- Navigation → Hamburger menu

### Tablet Adaptations

- Sidebar → Collapsible
- Tables → Horizontal scroll
- Charts → Adjusted legends

---

## 12. THEMING & VARIABLES

### 12.1 CSS Variables

```css
:root {
  /* Colors */
  --color-primary: #0052FF;
  --color-primary-dark: #0039B3;
  --color-primary-light: #4D85FF;
  
  --color-success: #00C853;
  --color-warning: #FFB300;
  --color-error: #FF1744;
  --color-info: #00B0FF;
  
  --color-bg: #0A0A0F;
  --color-surface: #141419;
  --color-surface-elevated: #1E1E24;
  --color-border: #2A2A35;
  
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #9CA3AF;
  --color-text-tertiary: #6B7280;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.4);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.5);
  
  /* Typography */
  --font-family: 'Inter', system-ui, sans-serif;
  
  /* Animation */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
}
```

### 12.2 Dark Mode (Default)

All specifications above are for dark mode (default).

### 12.3 Light Mode (Optional)

If implementing light mode:

```css
[data-theme="light"] {
  --color-bg: #FFFFFF;
  --color-surface: #F9FAFB;
  --color-surface-elevated: #FFFFFF;
  --color-border: #E5E7EB;
  
  --color-text-primary: #111827;
  --color-text-secondary: #4B5563;
  --color-text-tertiary: #9CA3AF;
  
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

---

## APPENDIX

### A. Icon Set

**Library:** Lucide React or Heroicons

**Required Icons:**
- Home, LayoutDashboard, Wallet, Shield, BarChart3, Settings
- ArrowRight, ArrowLeft, ChevronDown, ChevronUp
- Plus, Minus, X, Check, Copy, ExternalLink
- AlertCircle, AlertTriangle, Info, CheckCircle
- RefreshCw, Search, Filter, Download, Upload
- Menu, Bell, User, LogOut, Moon, Sun
- TrendingUp, TrendingDown, Activity, DollarSign
- Lock, Unlock, Key, Eye, EyeOff
- Clock, Calendar, Hash, Link

### B. Image Assets Needed

1. **Logo**: Prime Vault mark (SVG)
2. **Logo Full**: Logo + wordmark (SVG)
3. **Partner Logos**: Institution partner logos
4. **Illustrations**: 
   - Onboarding welcome illustration
   - Empty states illustrations
   - Security illustration
5. **Token Icons**: All supported token icons

### C. External Dependencies

**Blockchain:**
- ethers.js / viem
- @safe-global/protocol-kit
- @safe-global/api-kit
- permissionless.js

**UI:**
- React / Next.js
- TailwindCSS
- Radix UI (primitives)
- Framer Motion (animations)
- Recharts (charts)
- Lucide React (icons)

**Utilities:**
- date-fns (date formatting)
- react-hook-form (forms)
- zod (validation)
- react-query (data fetching)

---

**END OF SPECIFICATION**
