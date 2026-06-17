# VoteChain — Decentralized Voting dApp

A fully functional on-chain voting platform built with **Solidity**, **Hardhat**, **Next.js**, **TypeScript**, **Wagmi**, and **RainbowKit**.

Users can connect their wallets, create time-bound polls, cast secure votes, and view live results — all recorded transparently on the Ethereum blockchain.

## 🚀 Features

- **On-chain Poll Creation** — Create polls with custom questions, options (2-10), and duration (1h to 30 days)
- **Secure Voting** — One vote per wallet per poll with reentrancy protection
- **Real-time Results** — Live vote counting and results dashboard
- **Wallet Integration** — MetaMask, WalletConnect, Rainbow, and other wallets via RainbowKit + Wagmi
- **Time-bound Polls** — Automatic deadline enforcement using block timestamps
- **Admin Controls** — Poll creators and contract owner can close polls early
- **Responsive UI** — Modern, clean interface built with Tailwind CSS

## 🛠 Tech Stack

**Smart Contracts**
- Solidity ^0.8.20
- Hardhat
- OpenZeppelin (ReentrancyGuard, Ownable)

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- Wagmi v2 + RainbowKit
- Tailwind CSS + shadcn/ui components
- Viem for contract interactions

## 📁 Project Structure

```
votechain-dapp/
├── contracts/
│   └── VoteChain.sol          # Main voting smart contract
├── scripts/
│   └── deploy.ts              # Deployment script for Sepolia
├── test/
│   └── VoteChain.test.ts      # Contract tests
├── frontend/                  # Next.js frontend (see below)
├── hardhat.config.ts
└── README.md
```

## ⚡ Quick Start (Smart Contracts)

### 1. Install dependencies

```bash
npm install
```

### 2. Compile contracts

```bash
npm run compile
```

### 3. Run tests

```bash
npm test
```

### 4. Deploy to Sepolia

1. Create a `.env` file:
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_key
```

2. Deploy:
```bash
npm run deploy:sepolia
```

## 🖥 Frontend Setup (Next.js + Wagmi)

The frontend is located in the `frontend/` directory (or can be created as a separate app).

### Recommended Frontend Stack (already matches your resume)

```bash
npx create-next-app@latest frontend --yes
cd frontend
npm install wagmi viem @rainbow-me/rainbowkit tailwindcss
```

Then integrate the `VoteChain` contract ABI and address.

**Key pages to implement:**
- `/` — Landing + Connect Wallet
- `/create` — Create new poll form
- `/polls` — List of active polls
- `/poll/[id]` — Voting interface + live results

Would you like me to generate the complete Next.js frontend code as well?

## 📸 Screenshots / Demo

_Add screenshots of the dApp here after building the frontend._

## 🔗 Contract Addresses

- **Sepolia Testnet**: `0x...` (update after deployment)
- **Localhost**: Deploy locally with `npx hardhat node`

## 🧪 Testing

The project includes comprehensive Hardhat tests covering:
- Poll creation
- Voting logic & double-vote prevention
- Deadline enforcement
- Access control

Run with `npm test`.

## 🖋️ Future Improvements

- [ ] Add poll categories/tags
- [ ] Implement vote delegation
- [ ] Add results visualization with charts
- [ ] IPFS integration for poll metadata
- [ ] Mobile-first PWA support

## 👨‍💻 Author

**Vipul Kumar Jha**  
Backend & Blockchain Developer  
[GitHub](https://github.com/vipul45) | [LinkedIn](https://linkedin.com/in/vipul-kumar-jha)

---

Built as part of my portfolio to demonstrate full-stack blockchain development skills (Solidity + Modern Web3 frontend). 

This project directly showcases experience with **smart contract development, Web3 integration, wallet connectivity, and production-ready dApp architecture** — matching requirements for Full Stack Blockchain Developer roles.