# VoteChain — Decentralized Voting dApp

A fully functional on-chain voting platform built with **Solidity**, **Hardhat**, **Next.js**, **TypeScript**, **Wagmi**, and **RainbowKit**.

Users can connect their wallets, create time-bound polls, cast secure votes, and view live results — all recorded transparently on the Ethereum blockchain.

## 🚀 Features

- **On-chain Poll Creation** — Create polls with custom questions, options (2-10), and duration
- **Secure Voting** — One vote per wallet per poll
- **Real-time Results** — Live vote counting
- **Wallet Integration** — MetaMask, WalletConnect via RainbowKit + Wagmi
- **Time-bound Polls** — Automatic deadline enforcement

## 📁 Project Structure

```
votechain-dapp/
├── contracts/          # Solidity smart contracts
├── frontend/           # Next.js + Wagmi frontend
├── hardhat.config.ts
└── README.md
```

## ⚡ How to Run (Complete dApp)

### 1. Clone & Install

```bash
git clone https://github.com/vipul45/votechain-dapp.git
cd votechain-dapp
```

### 2. Run Smart Contracts (Hardhat)

```bash
npm install
npm run compile

# Start local blockchain
npx hardhat node
```

In another terminal:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

### 3. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Important Notes

- Update `CONTRACT_ADDRESS` in `frontend/app/page.tsx` with your deployed contract address.
- For Sepolia, change the chain in `lib/wagmi.ts`.
- This is a working MVP. Full event listening and poll loading can be enhanced further.

## 👨‍💻 Author

**Vipul Kumar Jha**

---

Ready for interview demonstration.